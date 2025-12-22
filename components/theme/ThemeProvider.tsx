'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    // attribute="class" が超重要です。これがないと tailwind.config.ts の設定と連動しません。
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      disableTransitionOnChange // 切り替え時のチラつき防止（お好みで）
    >
      {children}
    </NextThemesProvider>
  )
}