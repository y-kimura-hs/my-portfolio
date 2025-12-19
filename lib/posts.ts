import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ブログ記事のルートディレクトリ
const BLOG_DIR = path.join(process.cwd(), 'app/blog')

export type PostMetadata = {
  slug: string
  title: string
  date: string
  category: 'Graphics' | 'Tech' | 'Journal'
  tags?: string[]
  description: string
  urlCategory: string
}

// 再帰的にディレクトリを探索してMDXファイルを探す関数
function getMdxFiles(dir: string, fileList: string[] = []) {
  // ディレクトリが存在しない場合は空配列を返す
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

export function getAllPosts(): PostMetadata[] {
  const mdxFiles = getMdxFiles(BLOG_DIR)

  const posts = mdxFiles.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8')

    // 正規表現: {/* ... */} の中身を取り出す
    const match = fileContent.match(/\{\/\*([\s\S]*?)\*\/\}/)
    
    // 【重要】抽出した文字列の前後の空白・改行を削除する
    // これをしないと、--- の前に改行が入って認識されないことがある
    const frontmatterBlock = match ? match[1].trim() : ''
    
    // gray-matterで解析
    let data: { [key: string]: any } = {}
    try {
      // 解析エラーで落ちないようにtry-catchを追加
      const parsed = matter(frontmatterBlock)
      data = parsed.data
    } catch (e) {
      console.error(`\n[Error] Failed to parse frontmatter in: ${filePath}`)
      console.error(`Reason: YAML syntax error. Please remove trailing commas (,) or check indentation.\n`)
      // エラー時はデフォルト値を設定して処理を続行させる
      data = { title: `(Metadata Error) ${path.basename(path.dirname(filePath))}` }
    }

    // パスからスラッグとカテゴリを取得
    const parentDir = path.basename(path.dirname(filePath))
    const grandParentDir = path.basename(path.dirname(path.dirname(filePath)))

    // カテゴリのフォールバック (フォルダ名から推測: tech -> Tech)
    const folderCategory = grandParentDir.charAt(0).toUpperCase() + grandParentDir.slice(1)

    return {
      slug: parentDir,
      urlCategory: grandParentDir,
      // タイトルが取れない場合はファイル名などを表示してデバッグしやすくする
      title: data.title || `No Title (${parentDir})`, 
      date: data.date || '1970-01-01',
      // メタデータにカテゴリがなければフォルダ名を使う
      category: (data.category || folderCategory || 'Tech') as any,
      tags: data.tags || [],
      description: data.description || '',
    } as PostMetadata
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}