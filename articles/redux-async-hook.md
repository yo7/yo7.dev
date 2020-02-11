---
path: "/articles/redux-async-hook"
date: "2020-02-09"
title: "Reduxの非同期処理にReact Hooksを使う"
img: "./images/redux-async-hook.png"
---

最近React / Reduxのアプリで、React Hooksを使って非同期処理を書いていて、シンプルでしっくりきているのでそれについて書こうと思います。

## 前置き

単にもう当たり前に使われて枯れたものになったからなのか、[useReducer](https://ja.reactjs.org/docs/hooks-reference.html#usereducer) hookや[Context API](https://ja.reactjs.org/docs/context.html)でReact自体での状態管理がやりやすくなってあまり使われなくなったのか、最近はReduxについての話はあまり聞かなくなった気がします。  
私はReduxの規約に乗っているとある程度秩序を保ちつつ楽に開発しやすいので、今でも一定以上複雑な状態をもつアプリを開発するケースではReduxを採用します。

ただ、個人的にReduxを使うときに悩みの種だったのが非同期周りでした。Reduxの非同期周りではredux-thunkやredux-sagaなどのミドルウェアを使う場合が多かったと思います。これらは必要以上に複雑だったりして、どれをとってもイマイチな気がしていました。そこでそれらのミドルウェアを使わずにReact Hooksで非同期周りを書くようにした、というのが今回の話です。

## react-reduxのHooks対応

React Hooksで非同期処理を扱う前提として、react-reduxではv7.1.0から[HooksのAPI](https://react-redux.js.org/next/api/hooks)が提供されるようになりました。

具体的には、[useSelector()](https://react-redux.js.org/next/api/hooks#useselector)と[useDispatch()](https://react-redux.js.org/next/api/hooks#usedispatch)です。

- `useSelector()`: セレクター関数(redux stateを引数に取得したいデータを返す関数)でstateから必要なデータを取得するためのhook

- `useDispatch()`: reduxの`dispatch`への参照を返し、actionをdispatchするためのhook

これらのHooksによって、[`connect()`](https://react-redux.js.org/next/api/connect#connect) HOCでstateやaction creatorをコンポーネントにマッピングしていたやり方をHooksで置き換えて、見通しがよく書けるようになりました。

## React Hooksでの非同期処理

私が開発している[hackernote](https://app.hackernote.io/)というノートアプリでの実際の例をもとに、React HooksでのReduxの非同期処理を扱い方を紹介します。

### 例1. アプリを開いた際にノートの一覧を取得する

ページを開いた際に外部からデータを取得する、というのは非同期処理の典型的なケースだと思います。

hackernoteの場合は、オフラインでもノートを読み書きできるように[IndexedDB](https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API)にノートを保存しています。そのため、アプリを開いた際にはノートの一覧をIndexedDBから取得する、という非同期な処理を実行する必要があります。以下でそれについて見ていきます。

取得する処理は以下のようなカスタムフックになっています（コードはTypeScriptです）。

```ts
export const useGetAllNotesOperation = () => {
  const worker = useWorkerProxy()
  const dispatch = useDispatch<Dispatch<GetNotesAction>>()

  const getAllNotes = React.useCallback(async () => {
    const note = await worker.getAllNotes()
    dispatch({ type: NotesActionTypes.GET_NOTES, payload: note })
  }, [dispatch])

  return { getAllNotes }
}
```

`useWorkerProxy()`はWebWorkerを介してIndexedDBを操作するためのオブジェクトを返します。`worker.getAllNotes()`でIndexedDBからノートの一覧が返ってきます。今回の本題とは関係ないので、例えば外部APIサーバーとやり取りするためのものと考えてもらってもいいと思います。

[useCallback()](https://ja.reactjs.org/docs/hooks-reference.html#usecallback)のコールバック内で非同期処理（今回であればIndexedDBからノートの一覧を取得する処理）を実行し、その結果をstateで管理するためのactionをdispatchします。

このカスタムフックは、[Container Component](https://redux.js.org/basics/usage-with-react/#presentational-and-container-components)としてredux storeのデータを下位のコンポーネントに渡す役割をもつコンポーネントから呼び出します。ノート一覧の取得はコンポーネントが描画された時点で実行したいので、`useEffect()`でコールバックを実行してしまいます。

```ts
const ListPaneContainer = () => {
  const { getAllNotes } = useGetAllNotesOperation()

  React.useEffect(() => {
      getAllNotes()
  }, [])
  
  const { notes } = useAllNotesSelector(allNotesSelector)
  
  return <ListPane notes={notes} />
}
```

「ノートの一覧を取得する」という処理はカスタムフックの中に閉じられており、コンポーネントはその詳細については気にせず返ってきたコールバックを実行するだけになります。

### 例2. ボタンを押した際にノートをゴミ箱に移動する

ユーザーのインタラクションに応じて非同期処理を実行する、というのも典型的な例です。ボタンを押した際にノートをゴミ箱に移動する、という処理をみてみます（アプリのUI上は`アーカイブ`と呼んでいますが、実態を考えると`ゴミ箱`が正しいことと気づきました...😅）

![ノートを削除する](https://i.gyazo.com/eebd780b4a43e03c3dd32ec6afc643ab.gif)

このカスタムフックでは、コールバック内で非同期の削除を実行、actionをdispatchして、さらにトップページへの遷移を実行しています（[hookrouter](https://github.com/Paratron/hookrouter)を使っています）。  
ノート一覧の取得処理との違いとしては、削除対象のノートを知る必要があるため、パラメータとしてノートIDを渡し、`useCallback()`のdependencyリストにIDを追加しています（追加しないと意図せずコールバックがメモ化されてしまうため）。

```ts
export const useDeleteNoteOperation = (id: string) => {
  const worker = useWorkerProxy()
  const dispatch = useDispatch<Dispatch>()

  const deleteNote = React.useCallback(async () => {
    try {
      await worker.deleteNote(id)
      dispatch({ type: NotesActionTypes.DELETE_NOTE, payload: id })
      navigate('/')
    } catch (e) {
      console.error(e)
    }
  }, [dispatch, id])

  return { deleteNote }
}
```

このカスタムフックもContainerで呼び出し、コールバックを下位のコンポーネントで`<i onClick={deleteNote} />`のようにイベントハンドラに渡します。

```ts
export const DeleteIconContainer = () => {
  const id = useSelector(focusedNoteIdSelector)
  const { archiveNote } = useArchiveNoteOperation(id)

  return <ArchiveIcon archive={archiveNote} />
}
```

## re-ducksのOperationsとしてのカスタムフック

[React/Reduxで秩序あるコードを書く](https://speakerdeck.com/naoishii/reduxde-zhi-xu-arukodowoshu-ku)を参考に、[re-ducks](https://github.com/alexnm/re-ducks)パターンに近い方法でRedux周りのコードを整理しています。

[re-ducks](https://github.com/alexnm/re-ducks)は[ducks](https://github.com/erikras/ducks-modular-redux)というパターンの派生で、`action`や`reducer`といったReduxの登場人物の単位でディレクトリを切るのではなく、ドメインごとにディレクトリを切ろうという考え方です。

よくあるReduxのディレクトリ構成:
```
- actions/
  - notes.ts
  - config.ts
- reducers/
   - notes.ts
   - config.ts
```

`re-ducks`のディレクトリ構成
```
- modules/
  - notes
    - index.ts
    - actions.ts
    - reducer.ts
    - selectors.ts
    - operations.ts
```

また、re-ducks固有の点でselector / operationという新しい登場人物を加えています。selectorはReduxを使ったことがある人ならお馴染みの、stateから必要なデータだけを取得するための関数です。operationsは、複数のactionを発火したり、非同期処理を含む複雑なインタラクションを実行するための関数です。  本来、operationにはreduxのミドルウェアを使うことが推奨されていますが、そこで代わりにReact Hooksを使っています。

上のサンプルコードのようにノート一覧を取得する処理は`useGetAllNotesOperation`、削除する処理は`useDeleteNoteOperation`というようにoperationであるカスタムフックは`useXXXOperation`と命名しています。

re-ducksではstateをコンポーネントから参照する際にはselectorを使い、stateを変更する手続きは直接Actionをdispatchするのではなくoperationを介して実行します。

action / reducerなどを1ファイルにまとめるか、複数ファイルにわけるか、といったディレクトリ構成みたいな話はあまり重要じゃないと思っています。シンプルにアプリケーションの状態を操作するaction / reducerと、状態からUIに必要なデータを導出する層であるselectorや、状態を操作する際の複雑さな手続きを扱う層であるoperationを定義し、状態管理はクリーンなままにUIの複雑さselector / operationで受け止める、というように責務が分離されているのがre-ducksのいいところだと思います。

## おわり

React HooksでReduxの非同期処理を書いている話を書きました。個人開発でやってみている段階で、まだ特段複雑な処理を実装したりということはないのでそのあたりの知見がアップデートされたら別に書きたいと思います。

## 参考

- [Hooks - React Redux](https://react-redux.js.org/next/api/hooks)
- [React/Reduxで秩序あるコードを書く](https://speakerdeck.com/naoishii/reduxde-zhi-xu-arukodowoshu-ku)
- [非同期処理にredux-thunkやredux-sagaは必要無い](https://qiita.com/Naturalclar/items/6157d0b031bbb00b3c73) 

_Photo by Mel Poole on [Unsplash](https://unsplash.com/photos/Hg-uNVsg65Y)_
