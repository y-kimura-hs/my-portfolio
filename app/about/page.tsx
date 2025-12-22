import PageLayout from '@/components/layout/PageLayout'

export default function AboutPage() {
  return (
    <PageLayout 
      title="About Me" 
      description="私について / 研究と開発のバックグラウンド"
    >
      {/* セクション 1: プロフィール */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <span className="w-2 h-8 bg-primary mr-4 rounded-sm"></span>
          Profile
        </h2>
        
        <div className="space-y-4 text-foreground">
          <p>
            はじめまして。CG技術とレンダリングアルゴリズムに興味を持つエンジニア/リサーチャーです。
            現在は大学院にて、WebGPUを用いたリアルタイムレンダリングの研究を行っています。
          </p>
          <p>
            このサイトは、自身のアウトプットの実験場として開設しました。
            理論の実装だけでなく、アートとしてのCG表現も追求していきたいと考えています。
          </p>
        </div>
      </section>

      {/* セクション 2: スキルスタック */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <span className="w-2 h-8 bg-primary mr-4 rounded-sm"></span>
          Technical Skills
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* グループ1 */}
          <div className="bg-card/5 p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-bold mb-4 text-txt-main">Languages</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>C++ / CUDA</li>
              <li>Python (PyTorch, Taichi)</li>
              <li>TypeScript / JavaScript</li>
              <li>GLSL / WGSL</li>
            </ul>
          </div>
          
          {/* グループ2 */}
          <div className="bg-card/5 p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-bold mb-4 text-txt-main">Frameworks & Tools</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>React / Next.js</li>
              <li>Three.js / React Three Fiber</li>
              <li>Unity / Unreal Engine 5</li>
              <li>Blender / Houdini</li>
            </ul>
          </div>
        </div>
      </section>

      {/* セクション 3: 連絡先 */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <span className="w-2 h-8 bg-primary mr-4 rounded-sm"></span>
          Connect
        </h2>
        <p className="mb-4 text-txt-main">
          共同研究や開発のご依頼、技術的なディスカッション等は以下よりご連絡ください。
        </p>
        <div className="flex gap-4">
          <a href="https://twitter.com" className="px-6 py-2 rounded-full border border-border bg-card hover:bg-primary hover:text-white transition-colors">
            X (Twitter)
          </a>
          <a href="https://github.com" className="px-6 py-2 rounded-full border border-border bg-card hover:bg-primary hover:text-white transition-colors">
            GitHub
          </a>
        </div>
      </section>

    </PageLayout>
  )
}