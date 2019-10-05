import * as React from "react"

import SEO from "../components/seo"
import { Image } from "../components/Image"
import { globalStyles } from "../styles/global"
import { Global } from "@emotion/core"

const SecondPage = () => (
  <>
    <Global styles={globalStyles} />
    <SEO title="Page two" />
    <Image file="dark-mode.png" />
  </>
)

export default SecondPage
