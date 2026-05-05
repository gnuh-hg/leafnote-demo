import { useNavigate } from 'react-router-dom'
import { Search, Plus, Mic, Command } from 'lucide-react'

export default function TopBar() {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return (
    <header className="h-14 shrink-0 border-b border-ink-700/60 bg-ink-900/40 backdrop-blur-xl px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <div className="text-xs text-zinc-500 capitalize">{today}</div>
        <div className="text-xs text-zinc-700">·</div>
        <div className="text-xs text-zinc-500">
          <span className="text-emerald-400">●</span> Engine đang chạy
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Tìm trong hạt, ghi chú, hoặc khái niệm..."
            className="w-full bg-ink-850 border border-ink-700/60 rounded-lg pl-9 pr-16 py-1.5 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:bg-ink-900 transition"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-zinc-500">
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-ink-800 border border-ink-700">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/note/new?input=voice')}
          className="p-2 rounded-lg hover:bg-ink-850 text-zinc-400 hover:text-zinc-100 transition"
          title="Ghi chú mới bằng giọng nói"
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('/note/new')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Ghi chú mới
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 ml-2 ring-2 ring-ink-900" />
      </div>
    </header>
  )
}
