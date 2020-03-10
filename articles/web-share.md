---
path: "/articles/web-share"
date: "2020-03-10"
title: "Web Share APIでシェア体験を向上する"
img: "./images/share.png"
---

もっと使われてもいいAPIだと思うのですが、意外と知られていない気がするWeb Share APIについて書きます。

## Web Share APIとは

Web Share APIは、ネイティブアプリと同じようにOSの機能を使ってシェアするためのAPIです。

実際にこのウェブサイトでも、記事のページで右上のシェアボタンにWeb Share APIを使っています。

シェアボタンを押すと、次のようにOSのシェアメニューが表示されます。

<img src="https://i.gyazo.com/2d96f9f174183fdb95b877c1998012bb.png" alt="Image from Gyazo" width="300" />

ユーザーは自分がインストールしているアプリをターゲットとしてシェアできるので、このAPIを使うことで利便性が高まるケースが少なくないと思います。

## Web Share APIの使い方

Web Share APIは[W3Cの仕様](https://www.w3.org/TR/web-share/)もごく短く、とてもシンプルなAPIです。

`navigator.share()`を使います。`share()`の引数にはシェアする対象のURL、タイトル、テキストを含むオブジェクトを指定します。この内どれか一つが含まれている必要があります。

```js
navigator.share({
  url: 'https://yo7.dev/web-share',
  title: 'Web Share APIでシェア体験を向上する',
  text: 'もっと使われてもいいAPIだと思うのですが、意外と知られていない気がするWeb Share APIについて書きます。',
}).then(() => {
  console.log('succes')
}).catch(e => {
  console.error(e)
})
```

Web Share APIの制約としては、HTTPSのサイトでしか使えない・ユーザーアクション（クリックなど）への反応としてしか使えない、というものがあります。

## ブラウザサポート

[caniuse](https://caniuse.com/#feat=web-share)を見るとブラウザサポートは以下のような状況です。

![caiuse](https://i.gyazo.com/0fb5cc0c38216c87ef11a99bb9ba477e.png)

モバイルの主要ブラウザであるiOSのSafari / AndroidのChromeと、macのSafariだけでサポートされています。
基本的にモバイルでネイティブアプリのようにシェアするためのAPIなので仕方ないですね。

デスクトップでは唯一、macのSafariだけでWeb Share APIが使えるようになっています。
実際に使ってみると、以下のようにmacOSのアプリの一部、ノートやメールでシェアできるメニューが表示されます。

![web share api in macOS](https://i.gyazo.com/8929e1e8ccd0c6a8064dbe60a206ae73.gif)

### フォールバック

Web Share APIのサポートは一部に限られており、ほとんどのデスクトップの環境など利用できないため、サポートされていない環境でのフォールバックを考える必要があります。

Web Share APIがサポートされていない場合は`navigator.share`が`undefined`を返すので、これを使ってシェアしている場合とそうでない場合のロジックを分けることができます。

このブログの実装では以下のように、APIがサポートされていない場合はTwitterでシェアするためのリンクを表示するようにしてみました。

```jsx
export const ShareLink = props => {
  if (navigator.share) {
    return <WebShareLink {...props} />
  }

  return <TwitterShareLink {...props} />
}
```

## おわり

仕様が小さくてシンプルなAPIですが、かんたんに導入できて活用しやすいWeb Share APIについて書きました。
[Web Share Target API](https://wicg.github.io/web-share-target/)という、ネイティブシェアのターゲットとしてウェブサイト（PWA）を利用するためのAPIもあるので、使ってみて何か発見などがあればそれについても書いてみたいと思います。

## 参考
- [Web Share API - W3C](https://www.w3.org/TR/web-share/)
- [Navigator.share() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [Share like a native app with the Web Share API](https://web.dev/web-share/)
- [The Web Share API <- Alligator.io](https://alligator.io/js/web-share-api/)

*Photo by Daria Nepriakhina on [Unsplash](https://unsplash.com/photos/guiQYiRxkZY)*