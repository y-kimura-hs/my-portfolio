'use client'

import { useEffect } from 'react'
// highlight.js本体をインポート
import hljs from 'highlight.js'
// KaTeXの自動レンダリング機能をインポート

// @ts-ignore
import renderMathInElement from 'katex/dist/contrib/auto-render'

// CSSの読み込み（ここで読み込んでおく）
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'

export default function ClientEffects() {
  useEffect(() => {
    // 1. コードのハイライトを実行
    hljs.highlightAll()

    // 2. 数式のレンダリングを実行
    // document.body全体を走査して、$または$$で囲まれた部分を数式に変換する
    const options = {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false
    }
    
    // MDXのレンダリングが終わった後に実行されるように少し遅延させるか、
    // ページ遷移のたびに実行されるように工夫が必要ですが、
    // まずは単純なuseEffectで実行します。
    renderMathInElement(document.body, options)
  })

  return null
}