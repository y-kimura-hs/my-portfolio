import Link from 'next/link'

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  // タグ機能用に追加
  tags?: string[]
  // タグをクリックした時のベースパス ('/blog' または '/works')
  tagBasePath?: '/blog' | '/works'
}

export default function PageLayout({ 
  children, 
  title, 
  description,
  tags,
  tagBasePath
}: PageLayoutProps) {
  return (
    <div className="min-h-screen w-full pt-24 pb-20">
      
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* ページタイトルエリア */}
        {(title || description) && (
          <div className="mb-12 border-b border-border pb-8">
            {/* タイトル */}
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-txt-main">
                {title}
              </h1>
            )}
            
            {/* タグ表示エリア (クリック可能に修正) */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  tagBasePath ? (
                    // リンク先がある場合 (一覧ページへのフィルタ用リンク)
                    <Link
                      key={tag}
                      href={`${tagBasePath}?tag=${tag}`}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-card border border-border text-txt-muted hover:bg-primary hover:text-white transition-all"
                    >
                      #{tag}
                    </Link>
                  ) : (
                    // リンク先がない場合 (単なる表示)
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-card border border-border text-txt-muted"
                    >
                      #{tag}
                    </span>
                  )
                ))}
              </div>
            )}

            {/* 説明文 */}
            {description && (
              <p className="text-lg text-txt-muted leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* ページの中身 */}
        <div className="text-txt-foreground leading-relaxed">
          {children}
        </div>
        
      </div>
    </div>
  )
}