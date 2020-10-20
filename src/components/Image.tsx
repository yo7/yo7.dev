import * as React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

type Props = {
  file: string
  alt?: string
  className?: string
}

export const Image: React.FC<Props> = (props) => {
  return (
    <StaticQuery
      query={graphql`
        query {
          images: allFile {
            edges {
              node {
                relativePath
                name
                childImageSharp {
                  fluid(maxWidth: 1280) {
                    ...GatsbyImageSharpSizes
                  }
                }
              }
            }
          }
        }
      `}
      render={(data) => {
        const image = data.images.edges.find((edge: any) => {
          return edge.node.relativePath.includes(props.file)
        })
        if (!image) {
          console.error(`img not found: ${props.file}`)
          return null
        }

        return (
          <Img
            fluid={image.node.childImageSharp.fluid}
            alt={props.alt}
            className={props.className}
          />
        )
      }}
    />
  )
}
