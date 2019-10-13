import * as React from "react"
import SEO from "../components/SEO"
import css from "@emotion/css"
import { Global } from "@emotion/core"
import { globalStyles } from "../styles/global"
import { Image } from "../components/Image"

export default () => {
  return (
    <>
      <Global styles={globalStyles} />
      <SEO />
      <div
        css={css`
          max-width: 640px;
          margin: 0 auto;
          padding: 0.5rem 1.5rem;
        `}
      >
        <div
          css={css`
            margin-top: 3rem;
          `}
        >
          <div>
            <div
              css={css`
                height: 90px;
                width: 90px;

                @media (min-width: 640px) {
                  height: 100px;
                  width: 100px;
                }
                float: right;
                shape-outside: circle(80%);

                img {
                  border-radius: 50%;
                }
              `}
            >
              <Image file="profile.png" />
            </div>
            <h1
              css={css`
                font-family: Roboto;
                font-size: 2.2rem;
                margin: 0;
                letter-spacing: 0.5px;
              `}
            >
              Seiya Yoshitaka
            </h1>
            <p
              css={css`
                line-height: 1.7;
                color: #555;
                margin-top: 1.2rem;
              `}
            >
              Web開発者です。ツール系のアプリをつくるのが好きです。
              主にモダンなWebアプリの開発について書いています。
            </p>
          </div>
        </div>
        <div
          css={css`
            margin-top: 4rem;
          `}
        >
          <h2
            css={css`
              font-size: 1.8rem;
            `}
          >
            Articles
          </h2>
        </div>
      </div>
    </>
  )
}
