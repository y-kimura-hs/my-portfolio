import PageLayout from '@/components/layout/PageLayout'
import Link from 'next/link'
import BlogSidebar from '@/components/blog/BlogSidebar'
import { getAllPosts, PostMetadata } from '@/lib/posts'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams
  const selectedTag = typeof resolvedSearchParams?.tag === 'string' ? resolvedSearchParams.tag : undefined

  // 自動取得
  const allPosts = getAllPosts()
  
  // 表示用記事リスト
  const displayPosts = selectedTag 
    ? allPosts.filter(post => post.tags?.includes(selectedTag))
    : allPosts

  // カテゴリ定義
  const categories = ['Graphics', 'Tech', 'Journal'] as const
  
  // サイドバー用データ生成
  const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags || []))).sort()

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = allPosts.filter(p => p.category === cat).length
    return acc
  }, {} as { [key: string]: number })

  return (
    <PageLayout 
      title="Blog" 
      description="技術的な実験、エンジニアリングの記録、日々の生活。"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* メインコンテンツ */}
        <div className="flex-1 space-y-16">
          
          {selectedTag && (
             <div className="mb-8">
               <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                 <h2 className="text-2xl font-bold text-txt-main flex items-center">
                   <span className="text-primary mr-2">#</span>
                   {selectedTag}
                   <span className="ml-4 text-sm font-normal text-txt-muted">
                     ({displayPosts.length} posts)
                   </span>
                 </h2>
                 <Link href="/blog" className="text-sm text-txt-muted hover:text-primary transition-colors flex items-center gap-1">
                   <span className="text-lg">×</span> Clear filter
                 </Link>
               </div>

               <div className="grid gap-6 md:grid-cols-2">
                 {displayPosts.length > 0 ? (
                   displayPosts.map((post) => (
                     <PostCard key={post.slug} post={post} />
                   ))
                 ) : (
                   <div className="col-span-2 text-center py-12 text-txt-muted">
                     No posts found with tag &quot;{selectedTag}&quot;.
                   </div>
                 )}
               </div>
             </div>
          )}

          {!selectedTag && (
            <>
              {displayPosts[0] && (
                <section>
                  <h2 className="text-xl font-bold mb-6 text-primary flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
                    Recent Update
                  </h2>
                  <PostCard post={displayPosts[0]} isFeatured />
                </section>
              )}

              <section>
                 <h2 className="text-xl font-bold mb-8 text-txt-main border-b border-border pb-2">
                   Category Archives
                 </h2>
                 
                 <div className="space-y-12">
                   {categories.map((category) => {
                     const categoryPosts = displayPosts.filter(p => p.category === category)
                     if (categoryPosts.length === 0) return null

                     return (
                       <div key={category} id={category.toLowerCase()}>
                         <h3 className="text-lg font-bold mb-4 text-txt-muted flex items-center">
                           <span className="text-primary mr-2">/</span> {category}
                         </h3>
                         <div className="grid gap-4 md:grid-cols-2">
                           {categoryPosts.map((post) => (
                             <PostCard key={post.slug} post={post} />
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

        <aside className="w-full lg:w-64 flex-shrink-0">
          <BlogSidebar 
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

function PostCard({ post, isFeatured = false }: { post: PostMetadata, isFeatured?: boolean }) {
  const postPath = `/blog/${post.urlCategory}/${post.slug}`

  return (
    <Link href={postPath} className="group block h-full">
      <article 
        className={`
          h-full p-6 rounded-lg border border-border transition-all duration-300 relative overflow-hidden
          ${isFeatured 
            ? 'bg-card hover:bg-white border-primary/30 hover:border-primary/50' 
            : 'bg-card hover:bg-white hover:border-primary/50 hover:translate-y-[-2px]'
          }
        `}
      >
        <div className="flex items-center gap-3 text-sm text-txt-muted mb-3 relative z-10">
          <time dateTime={post.date}>{post.date.replace(/-/g, '.')}</time>
          <span className={`
            px-2 py-0.5 rounded text-xs border
            ${isFeatured ? 'bg-primary/20 text-primary border-primary/20' : 'bg-card text-txt-muted border-border'}
          `}>
            {post.category}
          </span>
        </div>
        
        <h2 className={`font-bold mb-3 group-hover:text-primary transition-colors relative z-10 ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
          {post.title}
        </h2>
        
        <p className="text-txt-muted text-sm line-clamp-2 leading-relaxed mb-3 relative z-10">
          {post.description}
        </p>

        {post.tags && (
          <div className="flex flex-wrap gap-2 mt-auto relative z-10">
            {post.tags.map(tag => (
              <object key={tag} type="invalid/type">
                <Link 
                  href={`/blog?tag=${tag}`}
                  className="text-xs text-txt-muted hover:text-primary hover:underline transition-colors mr-2"
                >
                  #{tag}
                </Link>
              </object>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}