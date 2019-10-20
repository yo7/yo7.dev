---
path: "/articles/react-emotion-darkmode"
date: "2019-10-21"
title: "ReactとEmotionでダークモードを実現する"
img: "./images/dark-mode.png"
---

最近、[hackernote](https://app.hackernote.io)という Web で使えるマークダウンノートのアプリをつくっていて、ダークモードを実装しました。

![Image from Gyazo](https://i.gyazo.com/40ecb6b1d38edabc26069cce34009777.gif)

hackernote は React で開発している SPA なので、この記事では自分が React でダークモードを実装した方法を書き留めておます。

## ダークモードのトレンド

最近は[Slack](https://slackhq.com/dark-mode-for-slack-desktop)など、有名なアプリが次々に実装してダークモードがトレンドになっている感があります。その背景には、2019 年 9 月 3 日にリリースされた[Android10](https://www.android.com/android-10/)、09 月 19 日にリリースされた[iOS13](https://www.apple.com/ios/ios-13/)で iPhone / iPad にそれぞれダークモードが導入されたことが大きいでしょう。

2 つの OS のリリースを見ると、ダークモードの特徴・よさとして「スクリーンが目に優しくなること」「バッテリー消費が抑えられること」などが挙げられています。

Web においても、[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)という media feature が
[Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/)で導入され、実装されているブラウザでは CSS や JavaScript でシステムのテーマ設定を確認した上でスタイルを変更することができるようになりました。

## おおまかな方針

ダークモードの実装は基本的には単純で、複数のカラースキームを用意しておいて、それをユーザーの入力やシステムの設定で切り替えるというものです。

たとえば[Slack のブログ](https://slack.engineering/building-dark-mode-on-desktop-811508b5d15f)を見ると、CSS variables で色定義を管理しておいて、ダークモードが有効な場合は色定義を切り替えるための CSS クラスを body タグに付与する、という方法で実装しているようです。

私は React のアプリを書くとき、最近は[Emotion](https://emotion.sh/docs/introduction)という CSS-in-JS を使うことが多いので、この組み合わせでの実装について書いていきます。

## React と Emotion で実装する

### Emotion でのテーマ

### prefers-color-scheme で OS の設定を利用する

### ユーザーが変更できるようにする

## おわり

ユーザーが日常的に利用するようなアプリ・サービスはダークモードを提供することでユーザー体験を高めることができるでしょう。ダークモードについてより深く知りたい人は以下の関連リンクを参照してみてください。

## 参考

- [Hello darkness, my old friend | web.dev](https://web.dev/prefers-color-scheme)
- [Building Dark Mode on Desktop - Several People Are Coding](https://slack.engineering/building-dark-mode-on-desktop-811508b5d15f)
