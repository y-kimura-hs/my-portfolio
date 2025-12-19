import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // globals.cssで定義した変数を割り当てる
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        // テキスト用
        txt: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
        },
        
        // アクセント
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        
        // UI用
        header: 'var(--header-bg)',
        footer: 'var(--footer-bg)',
        border: 'var(--border-color)',
      },
    },
  },
  plugins: [],
};
export default config;