---
date: "2019-10-21"
title: "ReactとEmotionでダークモードを実現する"
img: dark-mode.png
---

最近、[hackernote](https://app.hackernote.io)という Web で使えるマークダウンノートのアプリをつくっていて、ダークモードを実装しました。

![hackernote](https://i.gyazo.com/40ecb6b1d38edabc26069cce34009777.gif)

hackernote は React で開発している SPA なので、この記事では自分が React でダークモードを実装した方法を書き留めておきます。

## ダークモードのトレンド

最近は[Slack](https://slackhq.com/dark-mode-for-slack-desktop)など、有名なアプリが次々に実装してダークモードがトレンドになっている感があります。

その背景としては、2019年9月3日にリリースされた[Android10](https://www.android.com/android-10/)と9月19日にリリースされた[iOS13](https://www.apple.com/ios/ios-13/)でそれぞれダークモードが導入されたことが大きいでしょう。

2つのOSのリリースを見ると、ダークモードの特徴・よさとして「スクリーンが目に優しくなること」「バッテリー消費が抑えられること」などが挙げられています。

Webにおいても、[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)という media feature が
[Media Queries Level 5](https://drafts.csswg.org/mediaqueries-5/)で導入され(ステータスはEditor's Draftですが)、実装されているブラウザでは CSS や JavaScript でシステムのテーマ設定を確認した上でスタイルを変更することができるようになりました。

## ReactとEmotionで実装する

ダークモードの実装は基本的には単純で、複数のカラースキームを用意しておいて、それをシステムの設定やユーザーの入力で切り替えるというものです。

私の好みですがReactのアプリを書くとき、最近は[Emotion](https://emotion.sh/docs/introduction)というCSS-in-JSを使うことが多いので、この組み合わせでの実装について書いていきます。

成果物は以下の Gif のようになります。

![dark mode demo](https://i.gyazo.com/16e95f892c28b858019052eaf48fdab5.gif)

コードはこちらです: [yo7/react-emotion-dark-mode-demo](http://github.com/yo7/react-emotion-dark-mode-demo)

### セットアップ

ダークモードに切り替える対象として、背景色・テキスト色を設定したReactコンポーネントを用意します（`baseStyle`はテーマには関係ない細かなスタイル定義です）。スタイルはEmotionの[css prop](https://emotion.sh/docs/css-prop)で当てていきます。コードは生のJavaScriptと大きな差はないですがTypeScriptで書いています。

```tsx
import * as React from "react"
import css from "@emotion/css"

export const ThemeView: React.FC = () => {
  return (
    <div
      className={css`
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

### Emotinでのテーマ切り替え

Emotionでテーマの切り替えするには、[emotion-theming](https://emotion.sh/docs/theming)というライブラリが便利です。

アプリケーションのトップレベルに近いコンポーネントを`ThemeProvider`で囲み、`css`propにテーマをパラメータにとる関数渡すようにします。

サンプルなので1ファイルに全て詰め込んでしまっていますが、コードが大きくなってファイルが増えてくると`css`prop から簡単に`theme`にアクセスできるのは便利です。

```tsx
import { ThemeProvider } from "emotion-theming"

export const ThemeView: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <div
        className={theme => css`
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

### 2つのテーマを用意する

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

### システム設定をテーマに反映する

DOMの[`Window.matchMedia()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)というAPIでJavaScriptからmedia queryが有効かどうか確認できるので、これを利用してシステムでダークモードが有効になっているかどうか確認した上で、テーマを切り替えます。

```tsx
export const ThemeView: React.FC = () => {
  return (
    <ThemeProvider theme={isDarkMode() ? darkTheme : lightTheme}>
      <div
        className={theme => css`
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

### ユーザーがテーマを切り替えられるようにする

ダークモードを実装する際の注意点として、デフォルトではシステムの設定にしたがったテーマを有効にした上で、ユーザーが自由に変更できるようにするのがベストプラクティスです。OSの設定でダークモードを有効にしているユーザー全員が、Webサイトもダークモードで見たいとは限らないからです。

Reactではテーマのグローバルな状態を管理する方法として[Context](https://reactjs.org/docs/context.html) APIが提供されています。Contextで現在のテーマを`light` / `dark`で管理するようにします。

1ファイルに全て詰め込むのは厳しくなってきたので、テーマを管理するための責務をもつコンポーネントを`ThemeProvider`として切り出します。

ちょっと煩雑ですが、`ThemeContext.Provider`に現在のテーマと、テーマを変更する関数を渡すことで`Context.Consumer`からテーマを受け取る・変更できるようにしています。また、[`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) hookを利用してテーマの操作を扱うための`useTheme`も定義しています。

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

現在のテーマを受け取る・変更するコンポーネントはシンプルに`useTheme()` hookを使います（詳細なコードは割愛しますが気になる方は[Github リポジトリ](https://github.com/yo7/react-emotion-dark-mode-demo)を参照してください）。

```tsx
const { mode, toggleTheme } = useTheme()
```

実際はlocal storageなどにユーザーが設定したテーマを永続化すると思いますが、この記事での説明はここまでにします。

## おわり

日常的に使うようなアプリやサービスではダークモードを提供することでユーザー体験を高められるかもしれません。ダークモードについてより詳しく知りたい方は以下のリンクを参照してみてください。

### 参考

- [Building Dark Mode on Desktop - Several People Are Coding](https://slack.engineering/building-dark-mode-on-desktop-811508b5d15f)
- [Hello darkness, my old friend | web.dev](https://web.dev/prefers-color-scheme)

_Photo by Ezekiel Elin on [Unsplash](https://unsplash.com/photos/LNG1mPyJ8rg)_
