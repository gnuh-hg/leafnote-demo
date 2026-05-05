import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Tag as TagIcon, CheckCircle2 } from 'lucide-react'
import { useAppState } from '../context/AppState'

const COLORS = [
  { name: 'amber', dot: 'bg-amber-400' },
  { name: 'indigo', dot: 'bg-indigo-400' },
  { name: 'sky', dot: 'bg-sky-400' },
  { name: 'emerald', dot: 'bg-emerald-400' },
  { name: 'rose', dot: 'bg-rose-400' },
  { name: 'violet', dot: 'bg-violet-400' },
  { name: 'orange', dot: 'bg-orange-400' },
  { name: 'teal', dot: 'bg-teal-400' },
]

export default function TagCreateModal({ onClose, onCreated }) {
  const { addTag } = useAppState()
  const [name, setName] = useState('')
  const [color, setColor] = useState('indigo')

  const submit = () => {
    if (!name.trim()) return
    const id = addTag({ name, color })
    onCreated?.(id)
    onClose()
  }

  const slug = name.trim().toLowerCase().replace(/\s+/g, '-')

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md card-surface bg-ink-900 animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-ink-700/60 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-indigo-400" />
            <div className="text-[13px] font-medium text-zinc-100">Tag mới</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ink-800 text-zinc-400 hover:text-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1.5">
              Tên tag
            </div>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder='Ví dụ: "kuhn", "đồ-án", "reading"'
              className="w-full bg-ink-850 border border-ink-700/40 rounded-lg px-3 py-2 text-[14px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 transition"
            />
            <p className="text-[10.5px] text-zinc-500 mt-1.5">
              Tag là nhãn nhẹ — 1 note có thể gắn nhiều tag, dùng để filter trong danh sách ghi chú.
            </p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1.5">
              Màu nhận diện
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={`w-7 h-7 rounded-full ${c.dot} flex items-center justify-center transition ${
                    color === c.name
                      ? 'ring-2 ring-offset-2 ring-offset-ink-900 ring-zinc-300 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {color === c.name && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-ink-900" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-ink-700/60 px-5 py-3 flex items-center justify-between bg-ink-900/60">
          <div className="text-[10.5px] text-zinc-500 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${COLORS.find((c) => c.name === color)?.dot}`} />
            <span>Xem trước:</span>
            <span className="text-zinc-300 font-medium">#{slug || 'tag-mới'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-ink-800 transition"
            >
              Huỷ
            </button>
            <button
              onClick={submit}
              disabled={!name.trim()}
              className="px-3 py-1.5 rounded-lg text-xs bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition shadow-lg shadow-indigo-500/20"
            >
              Tạo tag
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
