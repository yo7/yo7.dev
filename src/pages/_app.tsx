import React from "react"
import { AppProps } from "next/app"
import Head from "next/head"
import { css } from "linaria"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>yo7.dev</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export const globalCSS = css`
  :global() {
    html {
      box-sizing: border-box;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    body {
      margin: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol", Yu Gothic, YuGothic, Hiragino Sans, Noto Sans CJK JP;
    }

    ol,
    ul {
      padding: 0;
      margin-left: 2rem;
      > li:first-of-type {
        margin-top: 0.5rem;
      }
    }
    li {
      margin-bottom: 0.5rem;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.2;
    }
    a {
      text-decoration: none;
    }
    button {
      cursor: pointer;
      &:focus {
        outline: none;
      }
    }
    button,
    a,
    div {
      -webkit-tap-highlight-color: transparent;
    }

    img {
      margin-bottom: 0;
    }

    .unselectable {
      user-select: none;
    }
  }
`

export default App
