---
path: "/articles/react-emotion-darkmode"
date: "2019-10-21"
title: "ReactとEmotionでダークモードを実現する"
img: "./images/dark-mode.png"
---

最近、[hackernote](https://app.hackernote.io)というWebで使えるマークダウンノートのアプリをつくっていて、ダークモードを実装しました。

![Image from Gyazo](https://i.gyazo.com/40ecb6b1d38edabc26069cce34009777.gif)

hackernoteはReactで開発しているSPAなので、この記事では自分がReactでダークモードを実装した方法を書き留めておます。

## ダークモードのトレンド

最近は[Slack](https://slackhq.com/dark-mode-for-slack-desktop)など、有名なアプリが次々に実装してダークモードがトレンドになっている感があります。

その背景には、2019年9月3日にリリースされた[Android10](https://www.android.com/android-10/)、09月19日にリリースされた[iOS13](https://www.apple.com/ios/ios-13/)でiPhone / iPadにそれぞれダークモードが導入されたことが大きいでしょう。

2つのOSのリリースを見ると、ダークモードの特徴・よさとして「スクリーンが目に優しくなること」「バッテリー消費が抑えられること」などが挙げられています。

Webにおいても、[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)というmedia featureが
[Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/)で導入され、実装されているブラウザではCSSやJavaScriptでシステムのテーマ設定を確認した上でスタイルを変更することができるようになりました。

## ReactとEmotionで実装する

ダークモードの実装といっても基本的には単純で、複数のカラースキームを用意しておいて、それをシステムの設定やユーザーの入力で切り替えるというものです。

私はReactのアプリを書くとき、最近は[Emotion](https://emotion.sh/docs/introduction)というCSS-in-JSを使うことが多いので、この組み合わせでの実装について書いていきます。

成果物は以下のGifのようになります。

![Image from Gyazo](https://i.gyazo.com/16e95f892c28b858019052eaf48fdab5.gif)

コードはこちらです: [yo7/react-emotion-dark-mode-demo](http://github.com/yo7/react-emotion-dark-mode-demo)

### セットアップ

ダークモードに切り替える対象として、背景色・テキスト色を設定したReactコンポーネントを用意します（`baseStyle`はテーマに関係ないスタイルです）。スタイルはEmotionの[css prop](https://emotion.sh/docs/css-prop)で当てていきます。コードは生のJavaScriptと大差ないですがTypeScriptで書いています。

```js
import * as React from 'react'
import css from '@emotion/css'

export const ThemeView: React.FC = () => {
  return (
    <div
      css={css`
        ${baseStyle};

        background-color: #fefefe;
        color: #333;
      `}
    >
      Light Theme
    </div>
  )
}
```

# Emotinでのテーマ切り替え

Emotionでテーマの切り替えするには、[emotion-theming](https://emotion.sh/docs/theming)というライブラリが便利です。

アプリケーションのトップレベルの方を`ThemeProvider`コンポーネントで囲み、`css`propのパラメータでテーマを渡すようにします。

サンプルなので1ファイルに全て詰め込んでしまっていますが、コードが大きくなってファイルが増えてくると`css`propから簡単に`theme`にアクセスできるのは便利です。

```js
import { ThemeProvider } from 'emotion-theming'

export const ThemeView: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <div
        css={theme => css`
          ${baseStyle};

          background-color: ${theme.bgColor};
          color: ${theme.textColor};
        `}
      >
        Light Theme
      </div>
    </ThemeProvider>
  )
}

const lightTheme = {
  bgColor: '#fefefe',
  textColor: '333',
}
```

### 2つのテーマを用意する

上ではライトモードのテーマだけ定義していますが、追加でダークモードのテーマを用意します。

```js
const darkTheme = {
  bgColor: '#222',
  textColor: '#aaa'
}
```

TypeScriptだと以下のようにテーマの型定義を用意しておくと、テーマで切り替える色が増えたときに漏れているとコンパイルエラーになるので便利です。

```ts
type Theme = {
  bgColor: string
  textColor: string
}

const lightTheme: Theme = {
  bgColor: '#fefefe',
  textColor: '#333',
}

const darkTheme: Theme = {
  bgColor: '#222',
  textColor: '#aaa'
}
```

### システム設定で切り替える

DOMの[`Window.matchMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)でJavaScriptからmedia queryが有効かどうか確認できるので、これを利用してシステムでダークモードが有効になっているかどうか確認した上で、テーマを切り替えます。

```js
export const ThemeView: React.FC = () => {
  return (
    <ThemeProvider theme={isDarkMode() ? darkTheme : lightTheme}>
      <div
        css={theme => css`
          ${baseStyle};

          background-color: ${theme.bgColor};
          color: ${theme.textColor};
        `}
      >
        Light Theme
      </div>
    </ThemeProvider>
  )
}

const isDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
```

### ユーザーが切り替えられるようにする

ダークモードを実装する際の注意点として、デフォルトではシステムの設定にしたがったテーマを有効にした上で、「OSの設定ではダークモードを有効にしているけどWebサイトはライトモードで見たい」というユーザーもいるので自由に変更できるようにするのがベストプラクティスです。

Reactではテーマのグローバルな状態を管理する方法として[Context](https://reactjs.org/docs/context.html) APIが提供されています。Contextで現在のテーマを`light` / `dark`で管理するようにします。

1ファイルに全て詰め込むのは厳しくなってきたので、テーマを管理するための責務をもつコンポーネントを`ThemeProvider`として切り出します。

ちょっと煩雑ですが、`ThemeContext.Provider`に現在のテーマと、テーマを変更する関数を渡すことで`Context.Consumer`からテーマを受け取る・変更できるようにしています。また、[`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) hookを利用してテーマの操作を扱うための`useTheme`も定義しています。

```
import React, { useState, createContext, useContext } from 'react'
import { ThemeProvider as EmotionProvider } from 'emotion-theming'

export const ThemeProvider: React.FC = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(isDarkMode() ? 'dark' : 'light')

  const toggleTheme = () => setMode(mode === 'light' ? 'dark' : 'light')

  return (
    <EmotionProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <ThemeContext.Provider
        value={{
          mode,
          toggleTheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </EmotionProvider>
  )
}

type ThemeMode = 'light' | 'dark'

type ThemeContextType = {
  mode: ThemeMode
  toggleTheme: () => void
}

const defaultContext: ThemeContextType = {
  mode: 'light',
  toggleTheme: () => {},
}

export const ThemeContext = createContext<ThemeContextType>(defaultContext)
export const useTheme = () => useContext(ThemeContext)
```

現在のテーマを受け取る・変更するコンポーネントはシンプルに`useTheme()` hookを使います。

```
const { mode, toggleTheme } = useTheme()
```

実際はlocal storageなどにユーザーが設定したテーマを永続化すると思いますが、この記事での説明はここまでにします。

## おわり

日常的に使うようなアプリやサービスではダークモードを提供することでユーザー体験を高められるかもしれません。ダークモードについてより詳しく知りたい方は以下の関連リンクを参照してみてください。

### 参考

- [Building Dark Mode on Desktop - Several People Are Coding](https://slack.engineering/building-dark-mode-on-desktop-811508b5d15f)
- [Hello darkness, my old friend | web.dev](https://web.dev/prefers-color-scheme)
