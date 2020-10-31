import path from "path"
import fs from "fs"
import pkgDir from "pkg-dir"

export type Article = {
  slug: string
  date: string
  title: string
  content: string
  img: string
}

export const getArticleFiles = () => {
  const dir = pkgDir.sync() ?? process.cwd()
  const articlesDir = path.join(dir, "articles")
  const fileNames = fs
    .readdirSync(articlesDir)
    .filter((file) => path.parse(file).ext === ".md")
  return fileNames
}

// export const readArticleFile = (slug: string): Article => {
//   return {
//     slug,
//     date,
//     title,
//     content,
//     img,
//   }
// }
