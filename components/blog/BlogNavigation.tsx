import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function BlogNavigation({ currentSlug }: { currentSlug: string }) {
  // 全記事を取得 (日付順にソート済み)
  const posts = getAllPosts()
  
  // 現在の記事のインデックスを探す
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)
  
  // 記事が見つからない場合のガード
  if (currentIndex === -1) return null

  // 最新(index 0) ← 現在(index i) → 過去(index last)
  // Next Post (新しい記事): index - 1
  // Prev Post (古い記事): index + 1
  const nextPost = posts[currentIndex - 1]
  const prevPost = posts[currentIndex + 1]

  return (
    <>
      <hr className="border-border my-12" />
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* 古い記事へ (Left) */}
        {prevPost ? (
          <Link 
            href={`/blog/${prevPost.urlCategory}/${prevPost.slug}`}
            className="group flex items-center gap-4 text-left w-full md:w-auto p-4 rounded-lg bg-card hover:bg-primary transition-colors border border-transparent"
          >
            <div className="w-10 h-10 rounded-full bg-card/10 flex-shrink-0 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors">
              ←
            </div>
            <div className="min-w-0">
              <div className="text-xs text-txt-muted group-hover:text-white mb-1">Previous Post</div>
              <div className="font-bold text-txt-muted group-hover:text-white truncate max-w-[200px] md:max-w-[250px]">
                {prevPost.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="w-full md:w-auto flex-1" /> /* スペース埋め */
        )}

        {/* 一覧に戻る */}
        <Link 
          href="/blog" 
          className="px-6 py-2 rounded-full border border-border text-sm text-txt-muted hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
        >
          Back to Blog
        </Link>

        {/* 新しい記事へ (Right) */}
        {nextPost ? (
          <Link 
            href={`/blog/${nextPost.urlCategory}/${nextPost.slug}`}
            className="group flex items-center gap-4 text-right w-full md:w-auto justify-end p-4 rounded-lg bg-card hover:bg-primary transition-colors border border-transparent hover:border-border"
          >
            <div className="min-w-0">
              <div className="text-xs text-txt-muted group-hover:text-white mb-1">Next Post</div>
              <div className="font-bold text-txt-muted group-hover:text-white truncate max-w-[200px] md:max-w-[250px]">
                {nextPost.title}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              →
            </div>
          </Link>
        ) : (
          <div className="w-full md:w-auto flex-1" />
        )}

      </div>
    </>
  )
}