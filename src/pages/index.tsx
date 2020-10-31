import css from "@emotion/css"

const IndexPage = () => {
  return (
    <div
      css={css`
        max-width: 640px;
        margin: 0 auto;
      `}
    >
      <div
        css={css`
          margin-top: 2rem;
          padding: 0.5rem 1.5rem;
        `}
      >
        <div>
          <h1
            css={css`
              font-family: Roboto;
              font-size: 1.3rem;
              margin: 0;
              display: inline-block;
              color: #111;
            `}
          >
            yo7.dev
          </h1>
        </div>
      </div>
      <div
        css={css`
          margin-top: 3rem;
        `}
      >
        <h2
          css={css`
            font-size: 1.8rem;
            padding: 0 1.5rem;
            margin: 1rem 0 0.5rem;
          `}
        >
          Articles
        </h2>
        <div
          css={css`
            display: flex;
            flex-direction: column;

            @media (min-width: 640px) {
              flex-direction: row;
              flex-wrap: wrap;
            }
          `}
        ></div>
      </div>
    </div>
  )
}

export default IndexPage
