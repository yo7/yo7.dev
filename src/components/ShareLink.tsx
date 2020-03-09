import * as React from "react"
import { Share2, Twitter } from "react-feather"

export type ShareData = {
  url: string
  text?: string | null
}

type Navigator = {
  share?: (data?: ShareData) => Promise<void>
}

type Props = ShareData

export const ShareLink: React.FC<Props> = props => {
  if ((navigator as Navigator).share) {
    return <WebShareLink {...props} />
  } else {
    return <TwitterShareLink {...props} />
  }
}

const WebShareLink: React.FC<Props> = props => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    return (navigator as Navigator).share!({
      text: props.text,
      url: props.url,
    }).catch(e => console.error(e))
  }

  return (
    <a onClick={handleClick}>
      <Share2 color="#fff" size={28} />
    </a>
  )
}

const TwitterShareLink: React.FC<Props> = props => {
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
