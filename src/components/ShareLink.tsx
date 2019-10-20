export type ShareData = {
  url: string
  text?: string | null
}

type Navigator = {
  share?: (data?: ShareData) => Promise<void>
}

type Props = ShareData

export const ShareLink: React.FC<Props> = props => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if ((navigator as Navigator).share) {
      e.preventDefault()

      return (navigator as Navigator).share!({
        text: props.text,
        url: props.url,
      })
    } else {
      return
    }
  }

  return (
    <a onClick={handleClick} href={twitterShareUrl(props.url, props.text)}>
      {props.children}
    </a>
  )
}

const twitterShareUrl = (url: string, text?: string | null) =>
  `http://twitter.com/share?url=${url}&text=${text}`
