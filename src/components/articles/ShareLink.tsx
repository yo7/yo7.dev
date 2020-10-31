import * as React from "react"
import { Share2, Twitter } from "react-feather"
import { css } from "@emotion/core"

type Navigator = {
  share?: (data?: ShareData) => Promise<void>
}

type Props = {
  url: string
  text: string
}

export const ShareLink: React.FC<Props> = (props) => {
  if (typeof navigator === "undefined") {
    return null
  }

  if ((navigator as Navigator).share) {
    return <WebShareLink {...props} />
  }

  return <TwitterShareLink {...props} />
}

const WebShareLink: React.FC<Props> = (props) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    return (navigator as Navigator).share!({
      text: props.text,
      url: props.url,
    }).catch((e) => console.error(e))
  }

  return (
    <div
      onClick={handleClick}
      css={css`
        &:hover {
          cursor: pointer;
        }
      `}
    >
      <Share2 color="#fff" size={28} />
    </div>
  )
}

const TwitterShareLink: React.FC<Props> = (props) => {
  return (
    <a
      href={twitterShareUrl(props.url, props.text)}
      target="_blank"
      rel="noopener"
    >
      <Twitter color="#fff" size={28} />
    </a>
  )
}

const twitterShareUrl = (url: string, text?: string | null) =>
  `http://twitter.com/share?url=${url}&text=${text}`
