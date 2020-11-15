import { css } from "linaria"
import { GetStaticProps, NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { Article, readArticleFiles } from "../lib/content-loader"

type Props = {
  articles: Article[]
}

const IndexPage: NextPage<Props> = (props) => {
  return (
    <div
      className={css`
        max-width: 640px;
        margin: 0 auto;
      `}
    >
      <div
        className={css`
          margin-top: 2rem;
          padding: 0.5rem 1.5rem;
        `}
      >
        <div>
          <h1
            className={css`
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
        className={css`
          margin-top: 3rem;
        `}
      >
        <h2
          className={css`
            font-size: 1.8rem;
            padding: 0 1.5rem;
            margin: 1rem 0 0.5rem;
          `}
        >
          Articles
        </h2>
        <div
          className={css`
            display: flex;
            flex-direction: column;

            @media (min-width: 640px) {
              flex-direction: row;
              flex-wrap: wrap;
            }
          `}
        >
          {props.articles.map((article, i) => (
            <div
              key={i}
              className={css`
                @media (min-width: 640px) {
                  max-width: 50%;
                }
              `}
            >
              <ArticleLink article={article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ArticleLink: React.FC<{ article: Article }> = (props) => {
  return (
    <Link href={`/articles/${props.article.slug}`} passHref>
      <a>
        <div
          className={css`
            padding: 1rem 1.5rem;
          `}
        >
          <Image
            src={`/images/articles/${props.article.img}`}
            width={640}
            height={335}
            className={css`
              border-radius: 3px;
            `}
          />
          <div
            className={css`
              margin-top: 0.5rem;
            `}
          >
            <span
              className={css`
                font-size: 14px;
                color: #999;
              `}
            >
              {props.article.date}
            </span>
            <div
              className={css`
                margin-top: 0.2rem;
                font-size: 1.2rem;
                font-weight: 600;
                color: #1a1a1a;
              `}
            >
              {props.article.title}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const articles = await readArticleFiles()
  return { props: { articles } }
}

export default IndexPage
