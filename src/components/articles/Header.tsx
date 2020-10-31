import { css } from "@emotion/core"
import Link from "next/link"
import { ArrowLeft } from "react-feather"
import { ShareLink } from "./ShareLink"

type Props = {
  shareData: {
    text: string
    url: string
  }
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
        <Link href="/" passHref>
          <a>
            <ArrowLeft color="#fff" size={30} />
          </a>
        </Link>
        <ShareLink {...props.shareData} />
      </div>
    </div>
  )
}
