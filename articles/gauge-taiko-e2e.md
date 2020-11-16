---
date: "2020-11-15"
title: "GaugeとTaikoではじめるE2Eテスト"
img: gauge-taiko-e2e.jpg
---

最近使っているGaugeと、Taikoというツールについて書きます。

## Gaugeについて

[Gauge](https://gauge.org/)はThoughtworks社が開発しているOSSのE2E / 受け入れテストのためのツールです。

テストのシナリオとテストコードが別ファイルに分離されるので、シナリオは自然言語で人間にとって読みやすく理解しやすいものにできるという特徴があります。

シナリオは`login.spec`というファイルに以下のようにマークダウンで書いて、


```md
## ログインできる

* トップページにいく
* ログインボタンを押す
```

実装は、例えばJavaScriptで以下のように書くといった具合です。

```js
step("トップページにいく", async () => {
  await goto("http://localhost:3000")
})

step("ログインボタンを押す", async () => {
  await click("ログイン")
})
```

シナリオとステップ実装の分離という点ではGherkin / Cucumberに近いですが、GaugeのシナリオはGherkinのようなDSL（`Given` `When` etc.）ではなくマークダウンで書くので、より自由度が高いです。

テストコードの実装はJS、Java、Go、Rubyなど色々なプログラミング言語で書くことができ、Webアプリに対するテストを書く際に使うブラウザ自動化ツールも後述するTaikoをはじめSeleniumなど好きなものと組み合わせることができます。


## Taikoについて

[Taiko](https://taiko.dev/)はGaugeのチームが開発しているnode.jsのブラウザ自動化ツールです。  

Gauge公式で推奨されていて、[Gaugeのトップページ](https://gauge.org/)にも`Gauge + Taiko = Reliable browser automation for your JavaScript tests!`という一文があります。

Node.jsならブラウザ自動化ツールとして使えるライブラリとして[Puppeteer](https://github.com/puppeteer/puppeteer)がありますが、Puppeteerはより汎用的で色々な目的に使われるのに対して、Taikoはテストに特化していてよりハイレベルなAPIになっています。

他のツールと比較してすぐれたTaikoの機能としては、[Smart Selectors](https://github.com/getgauge/taiko#smart-selectors)というものがあります。

これは、たとえば`click("ログイン")`というAPIで「ログイン」というテキストがある要素を探索してクリックしたり、`text("タイトル")`でタイトルというテキストノードをもつ要素を取得できるなど、テストコード側ではシンプルな記述でページ内のアクションや要素の探索をできる機能です。この機能のおかげテストのためにIDをつける、みたいなことを減らせます（なぜIDを使うのがアンチパターンなのかは、[なぜE2Eテストでidを使うべきではないのか](https://blog.autify.com/ja/why-id-should-not-be-used)に詳しいです）。

その他にも`Implicit waits`といってSPAなどで動的な要素が表示されるのを明示的にテストコードに書かなくても待ってくれるなど、ユーザーの操作に近いシンプルなテストコードが書けるようにライブラリ側でよしなにしてくれるという設計思想を感じます。

逆にTaikoを他のツールと比較した際の欠点としては、Node.jsのツールなのでたとえばSeleniumのように他の言語では書けない、[Chrome Devtool Protocol](https://chromedevtools.github.io/devtools-protocol/)を使っているのでChromiumベースのブラウザでしか動かずそれ以外のクロスブラウザテストはできない、などがあります。他ツールとの比較は[How Taiko compares to other browser automation tools](https://gauge.org/2019/08/21/how-taiko-compares-to-other-browser-automation-tools/)に詳しいです（GaugeのブログなのでTaikoに対して贔屓目かもしれないですが）。

今回はGaugeとTaikoを使ったプロジェクトを作成して、TypeScriptを使うなどいろいろ試してみます。


## Gauge / Taikoのプロジェクトをつくる

macなら`$ brew install gauge`など、[公式のGetting Started](https://github.com/getgauge/taiko#integrating-with-gauge)にしたがってgaugeをインストールします。

まずは次のコマンドで[gauge-js](https://github.com/getgauge/gauge-js)プラグインをインストールします。インストールしたプラグインは`$ gauge -v`で確認できます。

```sh
$ gauge install js
```

適当な空のディレクトリをつくり、次のコマンドでTaikoを使ったgaugeのサンプルプロジェクトが作成されます。

```sh
$ gauge init js
```

サンプルプロジェクトを開くと、`specs/example.spec`にサンプルのシナリオがあります。「Githubのページを開き、"Taiko"でプロジェクトを検索すると`getgauge/taiko`というテキストがある」というシナリオになっています。`tests/step_implementation.js`にステップの実装があります。

```md
## Search Taiko Repository

* Goto getgauge github page
* Search for "Taiko"
* Page contains "getgauge/taiko"
```


## テストを実行してみる

`npm i @getgauge/cli`でgaugeのCLIパッケージをインストールしてから`npm run test`を実行すると、上のシナリオが実行されます。
ブラウザがたちあがってテストが実行され、次のようなログがでてパスするはずです。

```sh
❯ npm run test

> gauge-taiko-template@ test /Users/yo7/dev/github.com/yo7/gauge-e2e-spike
> gauge run specs/

# Getting Started with Gauge
  ## Search Taiko Repository	 ✔ ✔ ✔

Successfully generated html-report to => /Users/yo7/dev/github.com/yo7/gauge-e2e-spike/reports/html-report/index.html

Specifications:	1 executed	1 passed	0 failed	0 skipped
Scenarios:	1 executed	1 passed	0 failed	0 skipped

Total time taken: 7.953s
```

Gaugeには[html-report](https://github.com/getgauge/html-report/blob/master/README.md)プラグインでテスト結果をHTML(+静的アセット)として保存される機能があり、`gauge init js`でプロジェクトを作成した際にデフォルトで有効化されています。`reports/html-report/index.html`をブラウザで開くと、以下のようなレポートが生成されているはずです。

![Image from Gyazo](https://i.gyazo.com/69288c9fa372fbb29910daab5c6fd31e.png)


## テストを書いてみる

ためしにサンプルでつくられたテストシナリオに、ステップを追加してみましょう。

元々あるシナリオが「Githubで`Taiko`を検索したら`getgauge/taiko`というテキストがある」というものなので、ここに「`getgauge/taiko`というリンクをクリックしたらTaikoのキャッチコピーがある」というステップを追加していきましょう。

```md
## Search Taiko Repository

* Goto getgauge github page
* Search for "Taiko"
* Page contains "getgauge/taiko"
ここから追加
* Click link "getgauge/taiko"
* Page contains "A Node.js library for testing modern web applications"
```

Taikoには、REPLでブラウザ操作を試す機能が備わっているので、せっかくなのでこれを使ってみましょう。

`$ ./node_modules/.bin/taiko`でTaikoのREPLが立ち上がります。

次のように、Taikoの関数を呼ぶと実際にブラウザがたちあがってブラウザが操作できます。

```sh
> openBrowser()
 ✔ Browser opened
> goto('https://github.com/getgauge')
 ✔ Navigated to URL https://github.com/getgauge
> focus(textBox({placeholder: 'Search'}))
 ✔ Focussed on the textBox[placeholder="Search"]
> write('Taiko')
 ✔ Wrote Taiko into the focused element.
> press('Enter')
 ✔ Pressed the Enter key
> click(link('getgauge/taiko'))
 ✔ Clicked link with text getgauge/taiko  1 times
> text('A Node.js library for testing modern web applications').exists()
 ✔ Exists
```

実際にブラウザで動いている様子をステップバイステップでみながら実行できて便利なので、まずはREPLでテストの挙動をためしてから実装に移る、という方法もいいかもしれません。REPLで`.code`を実行すると成功した全てのコマンドからテストコードが生成されるので、それを次のようにステップの実装に一部コピー・修正して利用できます。

```ts
step("Click link <target>", async (target) => {
  await click(link(target))
})
```

## TypeScriptで書いてみる

アプリケーションのコードをTypeScriptで書いている場合は、GaugeのテストコードもTypeScriptで書きたいのではないかと思います。[gauge-js](https://github.com/getgauge/gauge-js)にはTypeScriptの型定義はないのですが、[gauge-ts](https://github.com/bugdiver/gauge-ts)というライブラリを使うと手っ取り早くTypeScriptが使えます。

gauge-tsを使ったプロジェクトの雛形は以下のコマンドで作成できます。

```sh
$ gauge install ts
$ gauge init ts
```

gauge-tsでは次のように、クラスをつくりメソッドに`@Step`などのデコレーターを使うことでステップやフックを実装するAPIになっています。

```ts
export default class ExampleSpec {
  @BeforeSuite()
  public async beforeSuite() {
    await openBrowser()
  }

  @AfterSuite()
  public async afterSuite() {
    await closeBrowser()
  }

  @Step("Goto getgauge github page")
  public async goToGaugeGithubPage() {
    await goto("https://github.com/getgauge")
  }

  @Step("Search for <query>")
  public async searchFor(query: string) {
    await focus(textBox(toRightOf("Pricing")))
    await write(query)
    await press("Enter")
  }

  @Step("Page contains <content>")
  public async pageContains(content: string) {
    assert.ok(await text(content).exists())
  }
}
```

gauge-jsとはずいぶん書き味が違うので、すでにgauge-jsを使っているプロジェクトが移行しようとすると大変そうです。個人的にはステップに対応した関数を無名関数で書けるなど、gauge-jsのAPIの方が好みです。

ちなみにgauge-tsはデコレータを前提としたライブラリですが、[デコレータはTC 39でStage 2](https://github.com/tc39/proposal-decorators)の機能であり、今後仕様が大きく変化するなどの可能性がある点については留意が必要です（とはいえ広く使われているTypeScriptのプロジェクトでデコレーター全体のものも多くあるのが現状ですが）。


## Jestのようにアサーションを書けるようにしてみる

`gauge init ts`などのコマンドでプロジェクトの雛形をつくると、サンプルコードでは`assert.ok(...)`のようにNode.jsコアモジュールの`assert`が使われています。

これでも書けるのですが、ユニットテストで[Jest](https://jestjs.io/en/)を使っているのでJestと同じスタイルで読みやすいアサーションを書きたいです。

ただし、GaugeもJestもテストランナーなので、単純に一緒に使うことはできません。Jestの中でアサーションに使われている[expect](https://www.npmjs.com/package/expect)が個別のパッケージとしても使えるので、`$ npm i expect`でインストールして次のようにJestと同じ感覚で書けます。

```ts
@Step("Page contains <content>")
public async pageContains(content: string) {
  // assert.ok(await text(content).exists())
  expect(await text(content).exists()).toBeTruthy()
}
```

もちろん、expectではなく[Chai](https://www.chaijs.com/api/bdd/)などの別のアサーションライブラリを使うこともできます。

## おわり

GaugeとTaikoを使うといい感じにE2Eが書けて、TypeScriptを使ったりJestと同じようにアサーションを書くこともできました。CIでの実行など、もう少し実践的に使っての知見をまた別の記事に書こうと思います。

## 参考

- [Why we built Gauge](https://gauge.org/2018/05/15/why-we-built-gauge/)
- [Introducing Taiko - the last mile to reliable test automation](https://gauge.org/2018/10/23/taiko-beta-reliable-browser-automation/)
- [Gauge Test Automation Toolとアジャイル開発](https://tech.uzabase.com/entry/2017/09/26/191009)
- [gaugeとTypeScriptでテストをいい感じにする](https://yu-tarrrr.hatenablog.com/entry/2020/10/08/184156)

_Photo by Joanna Kosinska on [Unsplash](https://unsplash.com/photos/1_CMoFsPfso)_
