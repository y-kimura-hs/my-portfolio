'use client'

import Link from 'next/link'

type WorksSidebarProps = {
  categories: readonly string[]
  categoryCounts: { [key: string]: number }
  allTags: string[]
  selectedTag?: string
}

export default function WorksSidebar({ 
  categories, 
  categoryCounts, 
  allTags, 
  selectedTag 
}: WorksSidebarProps) {
  return (
    <div className="sticky top-32 space-y-8">
      
      {/* カテゴリ目次 */}
      <div className="bg-white/5 rounded-xl border border-border p-6">
        <h3 className="font-bold text-white mb-4 flex items-center">
          <span className="w-1 h-4 bg-primary rounded-sm mr-2"></span>
          Categories
        </h3>
        <ul className="space-y-3 text-sm">
          {categories.map((cat) => (
            <li key={cat}>
              <Link 
                href={selectedTag ? '/works' : `/works#${cat.toLowerCase()}`}
                className="flex items-center justify-between text-gray-400 hover:text-primary transition-colors group"
                onClick={(e) => {
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
                <span className="bg-white/5 px-2 py-0.5 rounded-full text-xs group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  {categoryCounts[cat]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* タグクラウド */}
      <div className="bg-white/5 rounded-xl border border-border p-6">
        <h3 className="font-bold text-white mb-4 text-sm">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => {
            const isActive = selectedTag === tag
            return (
              <Link 
                key={tag} 
                href={isActive ? '/works' : `/works?tag=${tag}`}
                className={`
                  text-xs px-2 py-1 border rounded transition-colors
                  ${isActive 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-black/40 border-border text-gray-400 hover:border-primary/50 hover:text-primary'
                  }
                `}
              >
                #{tag}
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Aboutショートカット */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-6">
        <h3 className="font-bold text-white mb-2">My Lab</h3>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          WebGLとWebGPUを用いたレンダリング技術の研究開発を行っています。
        </p>
        <Link href="/about" className="text-xs font-bold text-primary hover:underline">
          More about me →
        </Link>
      </div>

    </div>
  )
}