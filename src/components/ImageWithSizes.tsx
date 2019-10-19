import * as React from "react"
import Img, { FluidObject } from "gatsby-image"

type Props = {
  sizes: FluidObject
  alt?: string
  className?: string
}

export const ImageWithSizes: React.FC<Props> = props => {
  return <Img alt={props.alt} sizes={props.sizes} className={props.className} />
}
