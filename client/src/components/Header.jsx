export default function Header() {
  return (
    <header className="sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="glass px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">💬</div>
            <h1 className="text-lg md:text-2xl font-bold tracking-tight">Quotes Generator</h1>
          </div>
          <a className="btn text-sm" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </header>
  )
}
