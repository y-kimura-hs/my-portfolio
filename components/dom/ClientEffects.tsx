'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation' // URLの変更を検知するフック
import hljs from 'highlight.js'
// @ts-ignore
import renderMathInElement from 'katex/dist/contrib/auto-render'

import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'

export default function ClientEffects() {
  // 現在のURLパスを取得
  const pathname = usePathname()

  useEffect(() => {
    // 1. ページ遷移時にスクロールを一番上に戻す
    window.scrollTo(0, 0)

    // 2. 少しだけタイミングを遅らせてハイライトと数式変換を実行
    // (ReactがDOMを書き換え終わるのを待つため)
    const timer = setTimeout(() => {
      // コードハイライト
      hljs.highlightAll()

      // 数式レンダリング
      const options = {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false
      }
      renderMathInElement(document.body, options)
    }, 100) // 0.1秒待機

    return () => clearTimeout(timer)

  }, [pathname]) // pathnameが変わるたびにこの処理を実行する

  return null
}