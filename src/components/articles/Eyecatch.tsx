import Image from "next/image"
import { css } from "@emotion/core"

type Props = {
  title: string
  src: string
}

export const Eyecatch: React.FC<Props> = (props) => {
  return (
    <div
      css={css`
        position: relative;
        background-color: #999;
      `}
    >
      <div
        css={css`
          max-height: 250px;
        `}
      >
        <div
          css={css`
            padding-bottom: 52.5%;
          `}
        >
          <Image
            src={props.src}
            alt={props.title}
            height={670}
            width={1280}
            css={css`
              position: absolute;
              width: 100%;

              max-height: 250px;
              object-fit: cover;
              object-position: center center;
              opacity: 1;
              transition: none 0s ease 0s;
              mix-blend-mode: multiply;
            `}
          />
        </div>
      </div>
      <div
        css={css`
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          max-width: 680px;
        `}
      >
        <h1
          css={css`
            color: #fff;
            margin: 1rem;
            line-height: 1.25;
            font-weight: 700;
          `}
        >
          {props.title}
        </h1>
      </div>
    </div>
  )
}
