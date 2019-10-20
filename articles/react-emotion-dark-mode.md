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

最近は[Slack](https://slackhq.com/dark-mode-for-slack-desktop)など、有名なアプリが次々に実装してダークモードがトレンドになっている感があります。

その背景には、2019 年 9 月 3 日にリリースされた[Android10](https://www.android.com/android-10/)、09 月 19 日にリリースされた[iOS13](https://www.apple.com/ios/ios-13/)で iPhone / iPad にそれぞれダークモードが導入されたことが大きいでしょう。

2 つの OS のリリースを見ると、ダークモードの特徴・よさとして「スクリーンが目に優しくなること」「バッテリー消費が抑えられること」などが挙げられています。

Web においても、[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)という media feature が
[Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/)で導入され、実装されているブラウザでは CSS や JavaScript でシステムのテーマ設定を確認した上でスタイルを変更することができるようになりました。

## React と Emotion で実装する

ダークモードの実装といっても基本的には単純で、複数のカラースキームを用意しておいて、それをシステムの設定やユーザーの入力で切り替えるというものです。

私は React のアプリを書くとき、最近は[Emotion](https://emotion.sh/docs/introduction)という CSS-in-JS を使うことが多いので、この組み合わせでの実装について書いていきます。

成果物は以下の Gif のようになります。

![Image from Gyazo](https://i.gyazo.com/16e95f892c28b858019052eaf48fdab5.gif)

コードはこちらです: [yo7/react-emotion-dark-mode-demo](http://github.com/yo7/react-emotion-dark-mode-demo)

### セットアップ

ダークモードに切り替える対象として、背景色・テキスト色を設定した React コンポーネントを用意します（`baseStyle`はテーマに関係ないスタイルです）。スタイルは Emotion の[css prop](https://emotion.sh/docs/css-prop)で当てていきます。コードは生の JavaScript と大差ないですが TypeScript で書いています。

```tsx
import * as React from "react"
import css from "@emotion/css"

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

### Emotin でのテーマ切り替え

Emotion でテーマの切り替えするには、[emotion-theming](https://emotion.sh/docs/theming)というライブラリが便利です。

アプリケーションのトップレベルの方を`ThemeProvider`コンポーネントで囲み、`css`prop のパラメータでテーマを渡すようにします。

サンプルなので 1 ファイルに全て詰め込んでしまっていますが、コードが大きくなってファイルが増えてくると`css`prop から簡単に`theme`にアクセスできるのは便利です。

```tsx
import { ThemeProvider } from "emotion-theming"

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
  bgColor: "#fefefe",
  textColor: "333",
}
```

### 2 つのテーマを用意する

上ではライトモードのテーマだけ定義していますが、追加でダークモードのテーマを用意します。

```tsx
const darkTheme = {
  bgColor: "#222",
  textColor: "#aaa",
}
```

TypeScript だと以下のようにテーマの型定義を用意しておくと、テーマで切り替える色が増えたときに漏れているとコンパイルエラーになるので便利です。

```tsx
type Theme = {
  bgColor: string
  textColor: string
}

const lightTheme: Theme = {
  bgColor: "#fefefe",
  textColor: "#333",
}

const darkTheme: Theme = {
  bgColor: "#222",
  textColor: "#aaa",
}
```

### システム設定で切り替える

DOM の[`Window.matchMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)で JavaScript から media query が有効かどうか確認できるので、これを利用してシステムでダークモードが有効になっているかどうか確認した上で、テーマを切り替えます。

```tsx
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
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}
```

### ユーザーが切り替えられるようにする

ダークモードを実装する際の注意点として、デフォルトではシステムの設定にしたがったテーマを有効にした上で、「OS の設定ではダークモードを有効にしているけど Web サイトはライトモードで見たい」というユーザーもいるので自由に変更できるようにするのがベストプラクティスです。

React ではテーマのグローバルな状態を管理する方法として[Context](https://reactjs.org/docs/context.html) API が提供されています。Context で現在のテーマを`light` / `dark`で管理するようにします。

1 ファイルに全て詰め込むのは厳しくなってきたので、テーマを管理するための責務をもつコンポーネントを`ThemeProvider`として切り出します。

ちょっと煩雑ですが、`ThemeContext.Provider`に現在のテーマと、テーマを変更する関数を渡すことで`Context.Consumer`からテーマを受け取る・変更できるようにしています。また、[`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) hook を利用してテーマの操作を扱うための`useTheme`も定義しています。

```tsx
import React, { useState, createContext, useContext } from "react"
import { ThemeProvider as EmotionProvider } from "emotion-theming"

export const ThemeProvider: React.FC = ({ children }) => {
  // モードの初期値はシステム設定から入力する
  const [mode, setMode] = useState<ThemeMode>(isDarkMode() ? "dark" : "light")

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light")

  return (
    <EmotionProvider theme={mode === "light" ? lightTheme : darkTheme}>
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

type ThemeMode = "light" | "dark"

type ThemeContextType = {
  mode: ThemeMode
  toggleTheme: () => void
}

const defaultContext: ThemeContextType = {
  mode: "light",
  toggleTheme: () => {},
}

export const ThemeContext = createContext<ThemeContextType>(defaultContext)
export const useTheme = () => useContext(ThemeContext)
```

現在のテーマを受け取る・変更するコンポーネントはシンプルに`useTheme()` hook を使います。

```tsx
const { mode, toggleTheme } = useTheme()
```

実際は local storage などにユーザーが設定したテーマを永続化すると思いますが、この記事での説明はここまでにします。

## おわり

日常的に使うようなアプリやサービスではダークモードを提供することでユーザー体験を高められるかもしれません。ダークモードについてより詳しく知りたい方は以下の関連リンクを参照してみてください。

### 参考

- [Building Dark Mode on Desktop - Several People Are Coding](https://slack.engineering/building-dark-mode-on-desktop-811508b5d15f)
- [Hello darkness, my old friend | web.dev](https://web.dev/prefers-color-scheme)
