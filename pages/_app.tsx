import {Global} from "@emotion/core"
import {AppProps} from "next/app"
import {globalStyles} from "../src/styles/global"

const App = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <Global styles={globalStyles} />
      <Component {...pageProps} />
    </>
  )

}

export default App
