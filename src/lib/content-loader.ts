import path from "path"
import fs from "fs"
import pkgDir from "pkg-dir"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"
// @ts-ignore
import prism from "remark-prism"

export type Article = {
  date: string
  title: string
  content: string
  img: string
}

const EXT = ".md"

const articlesDir = () => {
  const dir = pkgDir.sync() ?? process.cwd()
  return path.join(dir, "articles")
}

export const getArticleFiles = () => {
  const fileNames = fs
    .readdirSync(articlesDir())
    .filter((file) => path.parse(file).ext === EXT)
  return fileNames
}

export const readArticleFile = async (slug: string): Promise<Article> => {
  const fileContent = fs.readFileSync(path.join(articlesDir(), `${slug}${EXT}`))
  const matterParsed = matter(fileContent)
  const { date, title, img } = matterParsed.data
  const content = await markdownToHtml(matterParsed.content)

  return {
    date,
    title,
    content,
    img,
  }
}

const markdownToHtml = async (markdown: string) => {
  const result = await remark()
    .use(html as any)
    .use(prism)
    .process(markdown)
  return result.toString()
}
