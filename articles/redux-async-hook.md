---
path: "/articles/redux-async-hook"
date: "2020-02-09"
title: "Reduxの非同期処理にReact Hooksを使う"
img: "./images/redux-async-hook.png"
---

最近 React / Redux のアプリで、React Hooks を使って非同期処理を書いていて、シンプルでしっくりきているのでそれについて書こうと思います。

## 前置き

単にもう当たり前に使われて枯れたものになったからなのか、[useReducer](https://ja.reactjs.org/docs/hooks-reference.html#usereducer) hook や[Context API](https://ja.reactjs.org/docs/context.html)で React 自体での状態管理がやりやすくなってあまり使われなくなったのか、最近は Redux についての話はあまり聞かなくなった気がします。

私は今でも一定以上複雑な状態をもつアプリを開発するケースでは Redux を採用します。Redux の規約や乗ってつくっているとある程度秩序を保ちつつ楽に開発しやすいので。

Redux の非同期周りといえば、redux-thunk や redux-saga などのミドルウェアを使う場合が多かったと思います。これらは必要以上に複雑だったりどれをとってもイマイチな気がしていました（もちろんそれぞれいい点はあるのですが）。 そこでそれらのミドルウェアを使わずに React Hooks で非同期周りを書くようにした、というのが今回の話です。

## react-redux の Hooks 対応

React Hooks で非同期処理を扱う前提として、react-redux では v7.1.0 から[Hooks の API](https://react-redux.js.org/next/api/hooks)が提供されるようになりました。

具体的には、[`useSelector()`](https://react-redux.js.org/next/api/hooks#useselector)と[`useDispatch()`](https://react-redux.js.org/next/api/hooks#usedispatch)です。

- `useSelector()`: セレクター関数(redux state を引数に取得したいデータを返す関数)で state から必要なデータを取得するための hook

- `useDispatch()`: redux の`dispatch`への参照を返し、action を dispatch するための hook

これらの Hooks によって、[`connect()`](https://react-redux.js.org/next/api/connect#connect) HOC で state や action creator をコンポーネントにマッピングしていたやり方を Hooks で置き換えて、見通しがよく書けるようになりました。

## React Hooks での非同期処理

私が開発している[hackernote](https://app.hackernote.io/)というノートアプリでの実際の例をもとに、React Hooks での Redux の非同期処理を扱い方を紹介します。

### 例 1. アプリを開いた際にノートの一覧を取得する

ページを開いた際に外部からデータを取得する、というのは非同期処理の典型的なケースだと思います。

hackernote の場合は、オフラインでもノートを読み書きできるように[IndexedDB](https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API)にノートを保存しています。そのため、アプリを開いた際にはノートの一覧を IndexedDB から取得する、という非同期な処理を実行する必要があります。以下でそれについて見ていきます。

取得する処理は以下のようなカスタムフックになっています（コードは TypeScript です）。

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

`useWorkerProxy()`は WebWorker を介して IndexedDB を操作するためのオブジェクトを返します。`worker.getAllNotes()`で IndexedDB からノートの一覧が返ってきます。今回の本題とは関係ないので、例えば外部 API サーバーとやり取りするためのものと考えてもらってもいいと思います。

[useCallback()](https://ja.reactjs.org/docs/hooks-reference.html#usecallback)のコールバック内で非同期処理（今回であれば IndexedDB からノートの一覧を取得する処理）を実行し、その結果を state で管理するための action を dispatch します。

このカスタムフックは、[Container Component](https://redux.js.org/basics/usage-with-react/#presentational-and-container-components)として redux store のデータを下位のコンポーネントに渡す役割をもつコンポーネントから呼び出します。ノート一覧の取得はコンポーネントが描画された時点で実行したいので、`useEffect()`でコールバックを実行してしまいます。

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

### 例 2. ボタンを押した際にノートをゴミ箱に移動する

ユーザーのインタラクションに応じて非同期処理を実行する、というのも典型的な例です。ボタンを押した際にノートをゴミ箱に移動する、という処理をみてみます（`アーカイブ`と呼んでいますが、実態を考えると`ゴミ箱`が正しいと気づきました 😅）

![ノートをアーカイブする](https://i.gyazo.com/eebd780b4a43e03c3dd32ec6afc643ab.gif)

```ts
export const useArchiveNoteOperation = (id: string) => {
  const worker = useWorkerProxy()
  const dispatch = useDispatch<Dispatch>()

  const archiveNote = React.useCallback(async () => {
    try {
      await worker.archiveNote(id)
      dispatch({ type: NotesActionTypes.ARCHIVE_NOTE, payload: id })
      navigate("/")
    } catch (e) {
      console.error(e)
    }
  }, [dispatch, id])

  return { archiveNote }
}
```

## ディレクトリ構成

[React/Redux で秩序あるコードを書く](https://speakerdeck.com/naoishii/reduxde-zhi-xu-arukodowoshu-ku)を参考に、[re-ducks](https://github.com/alexnm/re-ducks)パターンに近い方法で Redux 周りのコードを整理しています。

[re-ducks](https://github.com/alexnm/re-ducks)は[ducks](https://github.com/erikras/ducks-modular-redux)というパターンの派生で、`action`や`reducer`といった Redux の登場人物の単位でディレクトリを切るのではなく、ドメインごとにディレクトリを切ろうという考え方です。

よくある Redux のディレクトリ構成:

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

また、re-ducks 固有の点で selectors / operations という新しい登場人物を加えています。

selector は Redux を使ったことがある人ならお馴染みの人だと思いますが、state から必要なデータだけを取得するための関数です。

operations は、複数の action を発火したり、非同期処理を含む複雑なインタラクションを実行するための関数です。

本来、operations には redux のミドルウェアを使うことが推奨されていますが、私はそこで代わりに React Hooks を使っています。また、`re-ducks`では本来、action や reducer などごとにファイルを分けるのを 1 ファイルにまとめてしまっていたり、厳密に従うというよりはよさそうなところだけ取り入れています。

## React Hooks と Operations

WIP

## おわり

React Hooks で Redux の非同期処理を書いている話を書きました。個人開発でやってみている段階で、まだ特段複雑な処理を実装したりということはないのでそのあたりの知見がアップデートされたら別に書くかもしれません。

## 参考

- [Hooks - React Redux](https://react-redux.js.org/next/api/hooks)
- [React/Redux で秩序あるコードを書く](https://speakerdeck.com/naoishii/reduxde-zhi-xu-arukodowoshu-ku)
- [非同期処理に redux-thunk や redux-saga は必要無い](https://qiita.com/Naturalclar/items/6157d0b031bbb00b3c73)

_Photo by Mel Poole on [Unsplash](https://unsplash.com/photos/Hg-uNVsg65Y)_
