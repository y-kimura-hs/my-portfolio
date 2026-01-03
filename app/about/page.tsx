import PageLayout from '@/components/layout/PageLayout'
import Logo from '@/components/dom/Logo'

export default function AboutPage() {
  return (
    <PageLayout 
      title="About Me" 
      description="プロフィール"
    >
      {/* 1. Profile Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
        {/* アイコンプレースホルダー (画像があれば img タグに変更してください) */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-400 border-4 border-card shadow-xl flex-shrink-0 relative">
          <div className="absolute inset-0 flex items-center justify-center text-4xl select-none">
            <Logo />
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-txt-main mb-2">
            rinko
          </h2>
          <p className="text-primary font-medium mb-4">
            学生
          </p>
          <p className="text-txt-muted leading-relaxed max-w-lg">
            CGを勉強している学生です．
            大学院で流体シミュレーションの研究をしています．
            このサイトでは，CGアプリケーションの実装物や技術ブログなどを公開する予定です．
          </p>
        </div>
      </section>

      {/* 2. Biography (タイムライン形式) */}
      <section className="mb-16">
        <SectionTitle>Biography</SectionTitle>
        <div className="space-y-10 border-l-2 border-border ml-3 pl-8 py-2 relative">
          <BioItem 
            year="2024-現在" 
            title="大学院（情報科学）" 
            desc="修士課程に進学．今は修論を書いています．"
          />
          <BioItem 
            year="2020 - 2024" 
            title="大学（工学）" 
            desc="学部生のころは活力がありました．"
          />
          <BioItem 
            year="????" 
            title="Hello, world!" 
            desc="初めてプレイしたゲームはスターフォックス64．"
          />
        </div>
      </section>

      {/* 3. Research & Achievements */}
      <section className="mb-16">
        <SectionTitle>Research</SectionTitle>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold text-txt-main mb-4 flex items-center">
            <span className="w-1.5 h-6 bg-primary mr-3 rounded-sm"></span>
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Physics Simulation', 'Fluid Simulation', 'Fluid Control', 'Differentiable Simulation'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-card border border-border rounded-full text-sm text-txt-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="font-bold text-txt-main mb-4">Publications</h3>
            <ul className="space-y-4 text-sm text-txt-muted">
              <li>
                <span className="block text-primary text-xs font-mono mb-1">2025.7</span>
                Authoring Steady Fluid Flow with Terrain-based Repulsive Forces, Lecture Notes in Computer Science, Springer (Proc. CGI 2025).
              </li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="font-bold text-txt-main mb-4">Awards</h3>
            <ul className="space-y-4 text-sm text-txt-muted">
              <li>
                <span className="block text-primary text-xs font-mono mb-1">2024</span>
                2024 IEEE Sapporo Section Student Paper Contest Encouraging Prize
              </li>
              <li>
                <span className="block text-primary text-xs font-mono mb-1">2024</span>
                Visual Computing 2024 学生発表賞
              </li>
              <li>
                <span className="block text-primary text-xs font-mono mb-1">2024</span>
                Visual Computing 2024 企業賞
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Skills & Environment */}
      <section className="mb-16">
        <SectionTitle>Technical Skills</SectionTitle>
          <ul className="list-disc list-inside space-y-2 text-foreground">
            <li>C++：メインで使っています．</li>
            <li>CUDA：たまに使っています．</li>
            <li>Python：インターンで使っています．特に勉強した記憶はない．</li>
            <li>Visual Studio：普段はWindows環境で開発しています．</li>
            <li>VSCode：UbuntuやWeb実装で使用しています．</li>
            <li>OpenGL：研究室で使用しています．</li>
            <li>VulkanL：勉強中！</li>
            <li>WebGL：勉強中！</li>
          </ul>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <SkillCard title="Languages">
            C++, Python, TypeScript, GLSL, WGSL, Rust (Learning)
          </SkillCard>
          <SkillCard title="Frameworks & Libraries">
            Next.js, React, Three.js (R3F), PyTorch, Taichi, Unity, UE5
          </SkillCard>
          <SkillCard title="Tools">
            VSCode, Git, Docker, Blender, Houdini, Figma
          </SkillCard>
          <SkillCard title="Environment">
            MacBook Pro M2 Max / Desktop (RTX 4090, Ubuntu/Windows Dual Boot)
          </SkillCard> */}
        </div>
      </section>

      {/* 5. Personal / Favorites */}
      <section className="mb-16">
        <SectionTitle>Favorites</SectionTitle>
        <div className="text-txt-muted leading-relaxed mb-10">
          <h3 className="text-xl font-bold mb-4 text-txt-main">音楽</h3>
          <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>なんだかんだでBUMP OF CHICENが一番好き</li>
              {/* <li>最近ライブに行ったバンド：BUMP OF CHICKEN, OASIS，星野源，SEKAI NO OWARI</li>
              <li>よく聴く：Foo Fighters, Toto, フジファブリック，andymori, リーガルリリー...</li> */}
              <li>一番好きなギタリスト：ラリー・カールトン（ギターの神様）</li>
            </ul>
        </div>

        <div className="text-txt-muted leading-relaxed mb-10">
          <h3 className="text-xl font-bold mb-4 text-txt-main">ゲーム</h3>
          <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>スターフォックス64：私のオリジン．シリーズ続編を熱望しています．できるなら私が作りたい...！</li>
            </ul>
        </div>

        <div className="text-txt-muted leading-relaxed mb-10">
          <h3 className="text-xl font-bold mb-4 text-txt-main">映画</h3>
          <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Harry Potter：小説の方が読んでいる．映画も好き．</li>
            </ul>
        </div>

        <div className="text-txt-muted leading-relaxed mb-10">
          <h3 className="text-xl font-bold mb-4 text-txt-main">漫画</h3>
          <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>One Piece：バイブル</li>
            </ul>
        </div>


      </section>

      {/* 6. Connect */}
      <section>
        <SectionTitle>Connect</SectionTitle>
        <p className="mb-6 text-txt-muted">
        </p>
        <div className="flex flex-wrap gap-4">
          <SocialLink href="https://twitter.com" label="X (Twitter)" />
          <SocialLink href="https://github.com" label="GitHub" />
        </div>
      </section>

    </PageLayout>
  )
}

// --- 以下、Aboutページ専用の部品コンポーネント ---

// 見出し（MDXのデザインを模倣）
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 
      className="relative text-2xl md:text-3xl font-bold mb-10 pb-3 text-txt-main"
      style={{ borderBottom: '5px solid var(--border-color)' }}
    >
      {children}
      <span 
        className="absolute left-0 block"
        style={{ 
          bottom: '-5px', 
          width: '100px', 
          height: '5px',
          backgroundColor: 'var(--primary)'
        }}
      ></span>
    </h2>
  )
}

// タイムラインの項目
function BioItem({ year, title, desc }: { year: string, title: string, desc: string }) {
  return (
    <div className="relative">
      {/* 左側のドット */}
      <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-card border-4 border-primary shadow-sm" />
      <span className="text-primary text-sm font-bold font-mono mb-1 block">{year}</span>
      <h3 className="text-lg font-bold text-txt-main mb-1">{title}</h3>
      <p className="text-sm text-txt-muted leading-relaxed">{desc}</p>
    </div>
  )
}

// スキルカード
function SkillCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-card p-5 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <h3 className="text-xs font-bold text-txt-muted uppercase tracking-wider mb-3 flex items-center">
        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
        {title}
      </h3>
      <p className="text-txt-main font-medium leading-relaxed">{children}</p>
    </div>
  )
}

// SNSリンク
function SocialLink({ href, label }: { href: string, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="px-8 py-3 rounded-full bg-card border border-border text-txt-main font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
    >
      {label}
    </a>
  )
}

// export default function AboutPage() {
//   return (
//     <PageLayout 
//       title="About Me" 
//       description="私について / 研究と開発のバックグラウンド"
//     >
//       {/* セクション 1: プロフィール */}
//       <section className="mb-16">
//         <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
//           <span className="w-2 h-8 bg-primary mr-4 rounded-sm"></span>
//           Profile
//         </h2>
        
//         <div className="space-y-4 text-foreground">
//           <p>
//             はじめまして。CG技術とレンダリングアルゴリズムに興味を持つエンジニア/リサーチャーです。
//             現在は大学院にて、WebGPUを用いたリアルタイムレンダリングの研究を行っています。
//           </p>
//           <p>
//             このサイトは、自身のアウトプットの実験場として開設しました。
//             理論の実装だけでなく、アートとしてのCG表現も追求していきたいと考えています。
//           </p>
//         </div>
//       </section>

//       {/* セクション 2: スキルスタック */}
//       <section className="mb-16">
//         <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
//           <span className="w-2 h-8 bg-primary mr-4 rounded-sm"></span>
//           Technical Skills
//         </h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* グループ1 */}
//           <div className="bg-card/5 p-6 rounded-lg border border-border bg-card">
//             <h3 className="text-xl font-bold mb-4 text-txt-main">Languages</h3>
//             <ul className="list-disc list-inside space-y-2 text-foreground">
//               <li>C++ / CUDA</li>
//               <li>Python (PyTorch, Taichi)</li>
//               <li>TypeScript / JavaScript</li>
//               <li>GLSL / WGSL</li>
//             </ul>
//           </div>
          
//           {/* グループ2 */}
//           <div className="bg-card/5 p-6 rounded-lg border border-border bg-card">
//             <h3 className="text-xl font-bold mb-4 text-txt-main">Frameworks & Tools</h3>
//             <ul className="list-disc list-inside space-y-2 text-foreground">
//               <li>React / Next.js</li>
//               <li>Three.js / React Three Fiber</li>
//               <li>Unity / Unreal Engine 5</li>
//               <li>Blender / Houdini</li>
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* セクション 3: 連絡先 */}
//       <section>
//         <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
//           <span className="w-2 h-8 bg-primary mr-4 rounded-sm"></span>
//           Connect
//         </h2>
//         <p className="mb-4 text-txt-main">
//           共同研究や開発のご依頼、技術的なディスカッション等は以下よりご連絡ください。
//         </p>
//         <div className="flex gap-4">
//           <a href="https://twitter.com" className="px-6 py-2 rounded-full border border-border bg-card hover:bg-primary hover:text-white transition-colors">
//             X (Twitter)
//           </a>
//           <a href="https://github.com" className="px-6 py-2 rounded-full border border-border bg-card hover:bg-primary hover:text-white transition-colors">
//             GitHub
//           </a>
//         </div>
//       </section>

//     </PageLayout>
//   )
// }