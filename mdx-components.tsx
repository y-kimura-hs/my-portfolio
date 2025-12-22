import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h1: 記事タイトル（変更なし）
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-8 text-txt-main pb-4 border-b border-border">
        {children}
      </h1>
    ),
    
    // h2: 【新規】下線 + アクセントバーのデザイン
    h2: ({ children }) => (
      <h2 
        className="relative text-2xl md:text-3xl font-bold mt-20 mb-8 pb-3 text-txt-main"
        style={{ borderBottom: '5px solid var(--card-bg)' }}
      >
        {children}
        {/* アクセントバー */}
        <span 
          className="absolute left-0 block"
          style={{ 
            bottom: '-5px', 
            width: '100px', 
            height: '5px',
            backgroundColor: 'var(--primary)' // CSS変数を直接使用
          }}
        ></span>
      </h2>
    ),
    
    // h3: 【旧h2】左縦バーのデザイン
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-bold mt-12 mb-6 text-txt-main flex items-center">
        <span className="w-2 h-8 bg-primary mr-4 rounded-sm flex-shrink-0"></span>
        {children}
      </h3>
    ),

    // h4: 【旧h3】シンプルのデザイン
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-bold mt-8 mb-4 text-txt-main">
        {children}
      </h4>
    ),
    
    // 本文テキスト
    p: ({ children }) => (
      <p className="leading-8 text-foreground mb-6 text-base md:text-lg">
        {children}
      </p>
    ),
    
    // リスト
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-foreground ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-foreground ml-4">
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
      <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-6 bg-card italic text-txt-muted rounded-r">
        {children}
      </blockquote>
    ),

    // コード (`code`)
    code: ({ children, className }) => {
      if (className) {
         return <code className={`${className} text-sm`}>{children}</code>
      }
      return (
        <code className="bg-card text-pink-400 rounded px-1.5 py-0.5 font-mono text-sm mx-1 border border-border">
          {children}
        </code>
      )
    },
    
    // コードブロック
    pre: ({ children }) => (
      <pre className="bg-[#1e1e1e] border border-border rounded-lg p-4 overflow-x-auto mb-8 font-mono text-sm leading-relaxed shadow-xl">
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