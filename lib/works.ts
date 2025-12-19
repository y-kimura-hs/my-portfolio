import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Works記事のルートディレクトリ
const WORKS_DIR = path.join(process.cwd(), 'app/works')

export type WorkMetadata = {
  slug: string
  title: string
  date: string
  year: string // Works特有: 制作年
  category: 'Simulation' | 'Rendering' | 'Animation' | 'Geometry'
  tags?: string[]
  description: string
  color: string // Works特有: 背景グラデーション色
  urlCategory: string
}

function getMdxFiles(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      getMdxFiles(filePath, fileList)
    } else if (file === 'page.mdx') {
      fileList.push(filePath)
    }
  })
  return fileList
}

export function getAllWorks(): WorkMetadata[] {
  const mdxFiles = getMdxFiles(WORKS_DIR)

  const works = mdxFiles.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const match = fileContent.match(/\{\/\*([\s\S]*?)\*\/\}/)
    const frontmatterBlock = match ? match[1].trim() : ''
    
    let data: { [key: string]: any } = {}
    try {
      const parsed = matter(frontmatterBlock)
      data = parsed.data
    } catch (e) {
      console.error(`[Error] Failed to parse frontmatter in: ${filePath}`)
      data = { title: `(Metadata Error)` }
    }

    const parentDir = path.basename(path.dirname(filePath))
    const grandParentDir = path.basename(path.dirname(path.dirname(filePath)))
    
    // カテゴリのフォールバック
    const folderCategory = grandParentDir.charAt(0).toUpperCase() + grandParentDir.slice(1)

    return {
      slug: parentDir,
      urlCategory: grandParentDir,
      title: data.title || `No Title`,
      date: data.date || '1970-01-01',
      year: data.year || '2024',
      category: (data.category || folderCategory || 'Simulation') as any,
      tags: data.tags || [],
      description: data.description || '',
      color: data.color || 'from-gray-700 to-gray-900', // デフォルト色
    } as WorkMetadata
  })

  // 日付順にソート
  return works.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}