---
path: "/articles/web-share"
date: "2020-03-08"
title: "Web Share APIでシェア体験を向上する"
img: "./images/share.png"
---

もっと使われてもいいAPIだと思うのですが、意外と知られていない気がするWeb Share APIについて書きます。

### Web Share APIとは

WIP

### ブラウザサポート

[caniuse](https://caniuse.com/#feat=web-share)を見るとブラウザサポートは以下のような状況です。

![caiuse](https://i.gyazo.com/0fb5cc0c38216c87ef11a99bb9ba477e.png)

モバイルの主要ブラウザであるiOSのSafari / AndroidのChromeと、macのSafariだけでサポートされています。
基本的にモバイルでネイティブアプリのようにシェアするためのAPIなので仕方ないですね。

デスクトップでは唯一、macのSafariだけでWeb Share APIが使えるようになっています。
実際に使ってみると、以下のようにmacOSのアプリの一部、ノートやメールでシェアできるメニューが表示されます。

![web share api in macOS](https://i.gyazo.com/8929e1e8ccd0c6a8064dbe60a206ae73.gif)

### フォールバック

Web Share APIのサポートは一部に限られており、ほとんどのデスクトップの環境など利用できないため、サポートされていない環境でのフォールバックを考える必要があります。

WIP

### おわり



### 参考
- [Web Share API - W3C](https://www.w3.org/TR/web-share/)
- [Navigator.share() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [Share like a native app with the Web Share API](https://web.dev/web-share/)
- [The Web Share API <- Alligator.io]

*Photo by Daria Nepriakhina on [Unsplash](https://unsplash.com/photos/guiQYiRxkZY)*