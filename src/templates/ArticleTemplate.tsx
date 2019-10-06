import * as React from "react"
import { graphql } from "gatsby"
import { Global, css } from "@emotion/core"
import SEO from "../components/seo"
import { globalStyles } from "../styles/global"
import { ArrowLeft, Share2 } from "react-feather"
import { Image } from "../components/Image"
import { checkPropTypes } from "prop-types"

type Props = {
  data: {
    markdownRemark: {
      html: any
      frontmatter: {
        title: string
        date: string
        img: string
      }
    }
  }
}

export default ({ data }: Props) => {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark

  return (
    <>
      <Global styles={globalStyles} />
      <SEO title="Page two" />
      <div>
        <Header />
        <Eyecatch title={frontmatter.title} img={frontmatter.img} />
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          css={css`
            max-width: 680px;
            margin: 0 auto;
            padding: 0.5rem 1rem;

            p {
              line-height: 1.5;
            }

            p > code,
            li > code {
              padding: 0.25rem 0.4rem 0.15rem;
              border-radius: 3px;
            }
          `}
        />
      </div>
    </>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        img
      }
    }
  }
`

const Header: React.FC = () => {
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
          padding: 0.6rem 0.8rem;
          display: flex;
          justify-content: space-between;
          max-width: 960px;
          margin: 0 auto;
        `}
      >
        <ArrowLeft color="#fff" size={30} />
        <Share2 color="#fff" size={28} />
      </div>
    </div>
  )
}

export const Eyecatch: React.FC<{ title: string; img: string }> = props => {
  return (
    <div
      css={css`
        position: relative;
        background-color: #999;
        > div {
          max-height: 250px;
        }

        img {
          mix-blend-mode: multiply;
        }
      `}
    >
      <Image file={props.img} />
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
          `}
        >
          {props.title}
        </h1>
      </div>
    </div>
  )
}
