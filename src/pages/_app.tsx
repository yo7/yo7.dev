import React from "react"
import { Global } from "@emotion/core"
import { AppProps } from "next/app"
import Head from "next/head"
import { globalStyles } from "../styles/global"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>yo7.dev</title>
      </Head>
      <Global styles={globalStyles} />
      <Component {...pageProps} />
    </>
  )
}

export default App
