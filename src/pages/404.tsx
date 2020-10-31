import * as React from "react"

import Link from "next/link"
import { css } from "@emotion/core"
import { ArrowLeft } from "react-feather"

const NotFoundPage = () => (
  <div
    css={css`
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `}
  >
    <div
      css={css`
        font-size: 7rem;
        font-family: Roboto;
      `}
    >
      404
    </div>
    <Link href="/" passHref>
      <a
        css={css`
          font-size: 1.6rem;
          color: #999;
          display: flex;
          align-items: center;
          margin-top: 1rem;
          margin-right: 0.8rem;
        `}
      >
        <ArrowLeft
          color="#999"
          size={25}
          css={css`
            margin-right: 0.5rem;
          `}
        />
        <span>Back</span>
      </a>
    </Link>
  </div>
)

export default NotFoundPage
