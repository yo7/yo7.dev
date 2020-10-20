import * as React from "react"
import Img, { FluidObject } from "gatsby-image"

type Props = {
  fluid: FluidObject
  alt?: string
  className?: string
}

export const ImageWithSizes: React.FC<Props> = (props) => {
  return <Img alt={props.alt} fluid={props.fluid} className={props.className} />
}
