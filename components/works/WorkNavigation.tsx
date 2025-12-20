import Link from 'next/link'
import { getAllWorks } from '@/lib/works'

export default function WorkNavigation({ currentSlug }: { currentSlug: string }) {
  const works = getAllWorks()
  const currentIndex = works.findIndex((work) => work.slug === currentSlug)
  
  if (currentIndex === -1) return null

  const nextWork = works[currentIndex - 1]
  const prevWork = works[currentIndex + 1]

  return (
    <>
      <hr className="border-border my-12" />
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* 古い作品 */}
        {prevWork ? (
          <Link 
            href={`/works/${prevWork.urlCategory}/${prevWork.slug}`}
            className="group flex items-center gap-4 text-left w-full md:w-auto p-4 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-border"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
              ←
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 mb-1">Previous Work</div>
              <div className="font-bold text-white group-hover:text-primary truncate max-w-[200px]">
                {prevWork.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="w-full md:w-auto flex-1" />
        )}

        {/* 一覧に戻る */}
        <Link 
          href="/works" 
          className="px-6 py-2 rounded-full border border-border text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
        >
          Back to Works
        </Link>

        {/* 新しい作品 */}
        {nextWork ? (
          <Link 
            href={`/works/${nextWork.urlCategory}/${nextWork.slug}`}
            className="group flex items-center gap-4 text-right w-full md:w-auto justify-end p-4 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-border"
          >
            <div className="min-w-0">
              <div className="text-xs text-gray-500 mb-1">Next Work</div>
              <div className="font-bold text-white group-hover:text-primary truncate max-w-[200px]">
                {nextWork.title}
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