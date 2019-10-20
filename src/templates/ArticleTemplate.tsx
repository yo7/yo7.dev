import { css, Global } from "@emotion/core"
import { graphql, Link } from "gatsby"
import { FluidObject } from "gatsby-image"
import * as React from "react"
import { ArrowLeft, Edit, Share2 } from "react-feather"
import { ImageWithSizes } from "../components/ImageWithSizes"
import SEO from "../components/SEO"
import { ShareData, ShareLink } from "../components/ShareLink"
import { globalStyles } from "../styles/global"

type Props = {
  data: {
    site: {
      siteMetadata: {
        siteUrl: string
      }
    }
    markdownRemark: {
      html: any
      excerpt: string
      frontmatter: {
        title: string
        date: string
        path: string
        img: {
          childImageSharp: {
            sizes: FluidObject
          }
        }
      }
    }
  }
}

export default ({ data }: Props) => {
  const { markdownRemark, site } = data
  const { frontmatter, html, excerpt } = markdownRemark

  return (
    <>
      <Global styles={globalStyles} />
      <SEO
        title={frontmatter.title}
        description={excerpt}
        image={frontmatter.img.childImageSharp.sizes.src}
      />
      <div>
        <Header
          shareData={{
            url: `${site.siteMetadata.siteUrl}${frontmatter.path}`,
            text: frontmatter.title,
          }}
        />
        <Eyecatch title={frontmatter.title}>
          <ImageWithSizes sizes={frontmatter.img.childImageSharp.sizes} />
        </Eyecatch>
        <div
          css={css`
            max-width: 680px;
            margin: 0 auto;
            padding: 0.5rem 1rem;
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
            {frontmatter.date}
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            css={css`
              a {
                color: #411bd6;
              }

              p {
                line-height: 1.55;
              }

              p > code,
              li > code {
                padding: 0.25rem 0.4rem 0.15rem;
                border-radius: 3px;
              }

              img {
                max-width: 100%;
                margin: 20px auto;
                display: block;
              }
            `}
          />
        </div>
      </div>
    </>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 120)
      frontmatter {
        date(formatString: "YYYY-MM-DD")
        path
        title
        img {
          childImageSharp {
            sizes(maxWidth: 1280) {
              ...GatsbyImageSharpSizes
            }
          }
        }
      }
    }
  }
`

const Header: React.FC<{ shareData: ShareData }> = ({ shareData }) => {
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
        <Link to="/">
          <ArrowLeft color="#fff" size={30} />
        </Link>
        <ShareLink url={shareData.url} text={shareData.text}>
          <Share2 color="#fff" size={28} />
        </ShareLink>
      </div>
    </div>
  )
}

export const Eyecatch: React.FC<{ title: string }> = props => {
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
      {props.children}
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
