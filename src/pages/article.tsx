import * as React from "react"

import SEO from "../components/seo"
import { Image } from "../components/Image"
import { globalStyles } from "../styles/global"
import { Global, css } from "@emotion/core"
import { ArrowLeft, Share2 } from "react-feather"
const SecondPage = () => (
  <>
    <Global styles={globalStyles} />
    <SEO title="Page two" />
    <div>
      <div
        css={css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1;
        `}
      >
        <div
          css={css`
            padding: 0.6rem 0.8rem;
            display: flex;
            justify-content: space-between;
            max-width: 1120px;
            margin: 0 auto;
          `}
        >
          <ArrowLeft color="#fff" size={30} />
          <Share2 color="#fff" size={28} />
        </div>
      </div>
      <div
        css={css`
          position: relative;
          background-color: #999;
          > div {
            max-height: 215px;
          }

          img {
            mix-blend-mode: multiply;
          }
        `}
      >
        <Image file="dark-mode.png" />
        <div
          css={css`
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            max-width: 880px;
          `}
        >
          <h1
            css={css`
              color: #fff;
              margin: 1rem;
              line-height: 1.25;
            `}
          >
            Reactとemotionでダークモードを実現する
          </h1>
        </div>
      </div>
    </div>
  </>
)

export default SecondPage
