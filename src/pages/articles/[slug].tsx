import path from "path"
import { css } from "@emotion/core"
import { GetStaticProps, NextPage } from "next"
import { Edit } from "react-feather"
import { Eyecatch } from "../../components/articles/Eyecatch"
import {
  Article,
  getArticleFiles,
  readArticleFile,
} from "../../lib/content-loader"
import "prismjs/themes/prism.css"
import { Header } from "../../components/articles/Header"

type Props = {
  slug: string
  article: Article
}

const ArticlePage: NextPage<Props> = (props) => {
  return (
    <div>
      <Header
        shareData={{
          text: props.article.title,
          url: `https://yo7.dev/articles/${props.slug}`,
        }}
      />
      <Eyecatch
        title={props.article.title}
        src={`/images/articles/${props.article.img}`}
      />
      <div
        css={css`
          max-width: 680px;
          margin: 0 auto;
          padding: 0.5rem 1.5rem;
        `}
      >
        <div
          css={css`
            color: #999;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 7px;
          `}
        >
          <Edit
            color="#999"
            size={20}
            css={css`
              margin-right: 5px;
            `}
          />
          {props.article.date}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: props.article.content }}
          css={css`
            a {
              color: #411bd6;
            }

            p {
              line-height: 1.55;
            }

            pre > code,
            li > code {
              padding: 0.25rem 0.4rem 0.15rem;
              border-radius: 3px;
            }

            img {
              max-width: 100%;
              margin: 35px auto;
              display: block;
            }

            hr {
              background-color: #ddd;
              border-color: transparent;
              margin: 30px auto;
            }
          `}
        />
      </div>
    </div>
  )
}

export const getStaticPaths = () => {
  const files = getArticleFiles()
  const paths = files.map((fileName) => ({
    params: { slug: path.parse(fileName).name },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string
  const article = await readArticleFile(slug)
  return { props: { slug, article } }
}

export default ArticlePage
