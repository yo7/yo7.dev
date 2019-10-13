import * as React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

type Props = {
  file: string
  alt?: string
}

export const Image: React.FC<Props> = props => {
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
                  sizes(maxWidth: 1280) {
                    ...GatsbyImageSharpSizes
                  }
                }
              }
            }
          }
        }
      `}
      render={data => {
        const image = data.images.edges.find((edge: any) => {
          return edge.node.relativePath.includes(props.file)
        })
        if (!image) {
          console.error(`img not found: ${props.file}`)
          return null
        }

        const imageSizes = image.node.childImageSharp.sizes
        return <Img alt={props.alt} sizes={imageSizes} />
      }}
    />
  )
}
