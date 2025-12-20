import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 見出しのスタイル
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-white pb-2 border-b border-border">
        {children}
      </h1>
    ),
    // h2: ({ children }) => (
    //   <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-white flex items-center">
    //     <span className="w-1.5 h-6 bg-primary mr-3 rounded-sm"></span>
    //     {children}
    //   </h2>
    // ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-8 text-white flex items-center">
        {/* 縦バー: w-2 (8px), h-8 (32px) */}
        <span className="w-2 h-8 bg-white mr-4 rounded-sm flex-shrink-0"></span>
        {children}
      </h2>
    ),
    // h3: ({ children }) => (
    //   <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-200">
    //     {children}
    //   </h3>
    // ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-white">
        {children}
      </h3>
    ),

    // 本文テキスト
    p: ({ children }) => (
      <p className="leading-8 text-gray-300 mb-6 text-base md:text-lg">
        {children}
      </p>
    ),
    
    // リスト
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-300 ml-4">
        {children}
      </ol>
    ),
    
    // リンク
    a: ({ href, children }) => {
      const isInternal = href?.startsWith('/') || href?.startsWith('#')
      if (isInternal) {
        return (
          <Link href={href as string} className="text-primary hover:text-secondary underline decoration-primary/30 hover:decoration-secondary/50 underline-offset-4 transition-colors">
            {children}
          </Link>
        )
      }
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-secondary underline decoration-primary/30 hover:decoration-secondary/50 underline-offset-4 transition-colors"
        >
          {children} ↗
        </a>
      )
    },

    // 引用
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-6 bg-white/5 italic text-gray-400 rounded-r">
        {children}
      </blockquote>
    ),

    // コード (`code`)
    // インラインコードとコードブロックの二重適用を防ぐロジック
    code: ({ children, className }) => {
      // classNameがある（language-xxxなどが付いている）場合は、
      // preタグの中で使われているコードブロックなので、ここでの装飾は最小限にする
      if (className) {
         return <code className={`${className} text-sm`}>{children}</code>
      }
      // classNameがない場合は、文中のインラインコードなので装飾する
      return (
        <code className="bg-gray-800 text-pink-400 rounded px-1.5 py-0.5 font-mono text-sm mx-1 border border-gray-700">
          {children}
        </code>
      )
    },
    
    // コードブロック (```code```)
    // ここで大枠のデザインを定義
    pre: ({ children }) => (
      <pre className="bg-[#111] border border-gray-800 rounded-lg p-4 overflow-x-auto mb-8 font-mono text-sm leading-relaxed shadow-xl">
        {children}
      </pre>
    ),

    // 画像
    img: (props) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        {...props} 
        className="rounded-lg border border-border my-8 w-full h-auto shadow-lg"
        alt={props.alt || ''} 
      />
    ),

    ...components,
  }
}