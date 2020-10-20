import * as React from "react"
import SEO from "../components/SEO"
import css from "@emotion/css"
import { Global } from "@emotion/core"
import { globalStyles } from "../styles/global"
import { ImageWithSizes } from "../components/ImageWithSizes"
import { graphql, Link } from "gatsby"
import { FluidObject } from "gatsby-image"
import { Image } from "../components/Image"

type Post = {
  path: string
  title: string
  date: Date
  img: {
    childImageSharp: {
      sizes: FluidObject
    }
  }
}

type Props = {
  data: {
    allMarkdownRemark: {
      edges: [
        {
          node: {
            id: string
            frontmatter: Post
          }
        }
      ]
    }
  }
}

export default ({
  data: {
    allMarkdownRemark: { edges },
  },
}: Props) => {
  const posts = edges.map((edge) => edge.node)

  return (
    <>
      <Global styles={globalStyles} />
      <SEO />
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
          >
            {posts.map((post) => (
              <div
                key={post.id}
                css={css`
                  @media (min-width: 640px) {
                    max-width: 50%;
                  }
                `}
              >
                <PostLink post={post.frontmatter} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const PostLink: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Link to={`${post.path}`}>
      <div
        css={css`
          padding: 1.5rem;
        `}
      >
        <ImageWithSizes
          sizes={post.img.childImageSharp.sizes}
          css={css`
            border-radius: 3px;
          `}
        />
        <div
          css={css`
            margin-top: 0.5rem;
          `}
        >
          <span
            css={css`
              font-size: 14px;
              color: #999;
            `}
          >
            {post.date}
          </span>
          <div
            css={css`
              margin-top: 0.2rem;
              font-size: 1.2rem;
              font-weight: 600;
              color: #1a1a1a;
            `}
          >
            {post.title}
          </div>
        </div>
      </div>
    </Link>
  )
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
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
    }
  }
`
