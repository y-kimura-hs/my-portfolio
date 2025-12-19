import PageLayout from '@/components/layout/PageLayout'
import Link from 'next/link'
import WorksSidebar from '@/components/works/WorksSidebar'
import { getAllWorks, WorkMetadata } from '@/lib/works'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function WorksPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const selectedTag = typeof resolvedSearchParams?.tag === 'string' ? resolvedSearchParams.tag : undefined

  // 自動取得
  const allWorks = getAllWorks()
  
  // 表示用リスト
  const displayWorks = selectedTag 
    ? allWorks.filter(work => work.tags?.includes(selectedTag))
    : allWorks

  // カテゴリ定義
  const categories = ['Simulation', 'Rendering', 'Animation', 'Geometry'] as const
  
  // サイドバー用データ
  const allTags = Array.from(new Set(allWorks.flatMap(work => work.tags || []))).sort()
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = allWorks.filter(p => p.category === cat).length
    return acc
  }, {} as { [key: string]: number })

  return (
    <PageLayout 
      title="Works" 
      description="これまでに制作したCG作品や、実験的なデモのコレクション。"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* メインコンテンツエリア */}
        <div className="flex-1 space-y-16">
          
          {/* タグ絞り込み中のヘッダー */}
          {selectedTag && (
             <div className="mb-8 border-b border-border pb-4">
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-white flex items-center">
                   <span className="text-primary mr-2">#</span>
                   {selectedTag}
                   <span className="ml-4 text-sm font-normal text-txt-muted">
                     ({displayWorks.length} works)
                   </span>
                 </h2>
                 <Link href="/works" className="text-sm text-txt-muted hover:text-white transition-colors flex items-center gap-1">
                   <span className="text-lg">×</span> Clear filter
                 </Link>
               </div>
             </div>
          )}
          
          {selectedTag ? (
            // タグ絞り込み時の表示
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayWorks.length > 0 ? (
                displayWorks.map((work) => (
                  <WorkCard key={work.slug} work={work} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  No works found with tag &quot;{selectedTag}&quot;.
                </div>
              )}
            </div>
          ) : (
            // 通常時の表示
            <>
              {/* 最新の作品 */}
              {displayWorks[0] && (
                <section>
                  <h2 className="text-xl font-bold mb-6 text-primary flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
                    Latest Work
                  </h2>
                  <WorkCard work={displayWorks[0]} isFeatured />
                </section>
              )}

              {/* カテゴリ別アーカイブ */}
              <section>
                <h2 className="text-xl font-bold mb-8 text-white border-b border-border pb-2">
                  Archives by Category
                </h2>
                
                <div className="space-y-12">
                  {categories.map((category) => {
                    const categoryWorks = displayWorks.filter(w => w.category === category)
                    if (categoryWorks.length === 0) return null

                    return (
                      <div key={category} id={category.toLowerCase()}>
                        <h3 className="text-lg font-bold mb-4 text-txt-muted flex items-center">
                          <span className="text-primary mr-2">/</span> {category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {categoryWorks.map((work) => (
                            <WorkCard key={work.slug} work={work} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </>
          )}

        </div>

        {/* サイドバー */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <WorksSidebar 
            categories={categories}
            categoryCounts={categoryCounts}
            allTags={allTags}
            selectedTag={selectedTag}
          />
        </aside>

      </div>
    </PageLayout>
  )
}

function WorkCard({ work, isFeatured = false }: { work: WorkMetadata, isFeatured?: boolean }) {
  const workPath = `/works/${work.urlCategory}/${work.slug}`

  return (
    <Link href={workPath} className="group block h-full">
      <article 
        className={`
          h-full rounded-xl border border-border overflow-hidden transition-all duration-300 relative
          ${isFeatured 
            ? 'bg-white/10 shadow-2xl border-primary/30' 
            : 'bg-white/5 hover:translate-y-[-4px] hover:shadow-xl hover:bg-white/10 hover:border-primary/50'
          }
        `}
      >
        <div className={`
          w-full bg-gradient-to-br ${work.color} relative overflow-hidden
          ${isFeatured ? 'h-64 md:h-80' : 'h-48'}
        `}>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-bold text-white rounded-full border border-white/10 shadow-lg">
              {work.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-baseline mb-2">
            <h2 className={`font-bold text-white group-hover:text-primary transition-colors ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
              {work.title}
            </h2>
            <span className="text-sm text-txt-muted font-mono">{work.year}</span>
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-3">
            {work.description}
          </p>

          {/* タグ表示 */}
          {work.tags && (
            <div className="flex flex-wrap gap-2 mt-4 relative z-10">
              {work.tags.map(tag => (
                <object key={tag} type="invalid/type">
                  <Link 
                    href={`/works?tag=${tag}`}
                    className="text-xs text-gray-500 hover:text-primary hover:underline transition-colors mr-2"
                  >
                    #{tag}
                  </Link>
                </object>
              ))}
            </div>
          )}
        </div>

      </article>
    </Link>
  )
}