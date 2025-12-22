export default function Footer() {
  return (
    // bg-gray-900: 背景色, py-8: 上下の余白
    <footer className="w-full bg-footer text-white py-8 mt-auto z-10 relative">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 mb-4 text-sm text-txt-muted">
          <a href="#" className="hover:text-white">GitHub</a>
          <a href="#" className="hover:text-white">Twitter</a>
        </div>
        <p className="text-xs text-txt-muted">
          &copy; {new Date().getFullYear()} SnowCG Lab.
        </p>
      </div>
    </footer>
  )
}