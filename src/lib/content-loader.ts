import path from "path"
import fs from "fs"
import pkgDir from "pkg-dir"
import matter from "gray-matter"
import remark from "remark"
import html from "remark-html"

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
  const parsedContent = await remark()
    .use(html as any)
    .process(matterParsed.content)

  return {
    date,
    title,
    content: parsedContent.toString(),
    img,
  }
}
