import createMDX from '@next/mdx'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 拡張子 .mdx をページとして認識させる
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // MDXのオプション設定
  options: {
  },
})

// MDX設定を適用してエクスポート
export default withMDX(nextConfig)