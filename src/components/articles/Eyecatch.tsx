import Image from "next/image"
import { css } from "linaria"

type Props = {
  title: string
  src: string
}

export const Eyecatch: React.FC<Props> = (props) => {
  return (
    <div
      className={css`
        position: relative;
        background-color: #999;
      `}
    >
      <div
        className={css`
          max-height: 250px;
        `}
      >
        <div
          className={css`
            padding-bottom: 52.5%;
          `}
        >
          <Image
            src={props.src}
            alt={props.title}
            unsized
            className={css`
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
        className={css`
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          max-width: 680px;
        `}
      >
        <h1
          className={css`
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
