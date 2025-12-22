'use client'

import Link from 'next/link'

type BlogSidebarProps = {
  categories: readonly string[]
  categoryCounts: { [key: string]: number }
  allTags: string[]
  selectedTag?: string
}

export default function BlogSidebar({ 
  categories, 
  categoryCounts, 
  allTags, 
  selectedTag 
}: BlogSidebarProps) {
  return (
    <div className="sticky top-24 space-y-8">
      
      {/* カテゴリ目次 */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-bold text-primary mb-4 flex items-center">
          <span className="w-1 h-4 bg-primary rounded-sm mr-2"></span>
          Categories
        </h3>
        <ul className="space-y-3 text-sm">
          {categories.map((cat) => (
            <li key={cat}>
              <Link 
                href={selectedTag ? '/blog' : `/blog#${cat.toLowerCase()}`}
                className="flex items-center justify-between text-txt-muted hover:text-primary transition-colors group"
                onClick={(e) => {
                  // ここがエラーの原因だった箇所です
                  // Client Componentにしたので安全に実行できます
                  if (selectedTag) {
                    // タグ選択中は通常遷移
                  } else {
                    const el = document.getElementById(cat.toLowerCase())
                    if (el) {
                      e.preventDefault()
                      el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }
                }}
              >
                <span>{cat}</span>
                <span className="bg-card px-2 py-0.5 rounded-full text-txt-muted group-hover:text-primary transition-colors">
                  {categoryCounts[cat]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* タグクラウド */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-bold text-primary mb-4 flex items-center">
          <span className="w-1 h-4 bg-primary rounded-sm mr-2"></span>
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => {
            const isActive = selectedTag === tag
            return (
              <Link 
                key={tag} 
                href={isActive ? '/blog' : `/blog?tag=${tag}`}
                className={`
                  text-xs px-2 py-1 border rounded transition-colors
                  ${isActive 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-card border-border text-txt-muted hover:bg-primary hover:text-white'
                  }
                `}
              >
                #{tag}
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}