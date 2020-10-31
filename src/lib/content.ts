export type Article = {
  slug: string
  date: string
  title: string
  content: string
  img: string
}

export const readArticleFile = (slug: string): Article => {
  return {
    slug,
    date,
    title,
    content,
    img,
  }
}
