import { css } from "@emotion/core"
import Link from "next/link"
import { ArrowLeft } from "react-feather"
import { ShareLink } from "./ShareLink"

type Props = {
  shareData: ShareData
}

export const Header: React.FC<Props> = (props) => {
  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
      `}
    >
      <div
        css={css`
          padding: 1rem 0.8rem;
          display: flex;
          justify-content: space-between;
          max-width: 960px;
          margin: 0 auto;
        `}
      >
        <Link href="/">
          <ArrowLeft color="#fff" size={30} />
        </Link>
        <ShareLink {...props.shareData} />
      </div>
    </div>
  )
}
