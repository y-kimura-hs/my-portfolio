interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    // 上にヘッダー分の余白(pt-24)を取り、下にも余白(pb-20)を取る
    <div className="min-h-screen w-full pt-24 pb-20">
      
      {/* コンテンツの幅を制限し、中央寄せするコンテナ */}
      {/* max-w-4xl: 記事などが読みやすい幅 (約900px) */}
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* ページタイトルエリア */}
        {(title || description) && (
          <div className="mb-12 border-b border-border pb-8">
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-txt-main">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-txt-muted">
                {description}
              </p>
            )}
          </div>
        )}

        {/* ページの中身 */}
        <div className="text-txt-main leading-relaxed">
          {children}
        </div>
        
      </div>
    </div>
  )
}