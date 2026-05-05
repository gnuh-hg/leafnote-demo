import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FolderPlus, User, Cpu, Wand2, CheckCircle2 } from 'lucide-react'

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

export default function ProjectCreateModal({ onClose }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('indigo')
  const [autoClassify, setAutoClassify] = useState(true)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md card-surface bg-ink-900 animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-ink-700/60 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-indigo-400" />
            <div className="text-[13px] font-medium text-zinc-100">Project mới</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ink-800 text-zinc-400 hover:text-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Name — manual */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                Tên project
              </span>
              <Tag tone="amber" icon={User}>
                Bạn nhập
              </Tag>
            </div>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Ví dụ: "Đồ án tốt nghiệp", "Tiếng Anh B2"'
              className="w-full bg-ink-850 border border-ink-700/40 rounded-lg px-3 py-2 text-[14px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 transition"
            />
            <p className="text-[10.5px] text-zinc-500 mt-1.5">
              Project là cách <b>bạn</b> phân nhóm note theo ngữ cảnh học / dự án.
            </p>
          </div>

          {/* Color — manual */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                Màu nhận diện
              </span>
              <Tag tone="amber" icon={User}>
                Bạn chọn
              </Tag>
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

          {/* Auto-classify — AI helper */}
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
            <div className="flex items-start gap-2.5">
              <button
                onClick={() => setAutoClassify(!autoClassify)}
                className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition ${
                  autoClassify
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'border-ink-600 hover:border-indigo-500/50'
                }`}
              >
                {autoClassify && <CheckCircle2 className="w-3 h-3 text-white" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[12.5px] font-medium text-zinc-100">
                    AI tự gợi ý gán note vào project
                  </span>
                  <Tag tone="indigo" icon={Cpu}>
                    AI
                  </Tag>
                </div>
                <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                  Khi bạn lưu note mới, AI dùng embedding so sánh với hạt cũ trong project. Bạn vẫn xác nhận trước khi gán.
                </p>
              </div>
            </div>
          </div>

          {/* AI suggestion (if name is set) */}
          {name.length >= 4 && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <Wand2 className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] font-medium text-emerald-300">
                  AI gợi ý hạt khởi tạo
                </span>
                <Tag tone="indigo" icon={Cpu}>
                  AI
                </Tag>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Nếu muốn, AI có thể đề xuất 5–8 hạt nền cho "{name}" dựa trên kho tri thức công khai. Bạn duyệt trước khi thêm.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-ink-700/60 px-5 py-3 flex items-center justify-between bg-ink-900/60">
          <div className="text-[10.5px] text-zinc-500 flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                COLORS.find((c) => c.name === color)?.dot
              }`}
            />
            <span>Xem trước:</span>
            <span className="text-zinc-300 font-medium">
              {name || 'Project chưa đặt tên'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-ink-800 transition"
            >
              Huỷ
            </button>
            <button
              disabled={!name.trim()}
              className="px-3 py-1.5 rounded-lg text-xs bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition shadow-lg shadow-indigo-500/20"
            >
              Tạo project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Tag({ tone, icon: Icon, children }) {
  const map = {
    amber: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    indigo: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-medium border ${map[tone]}`}
    >
      <Icon className="w-2.5 h-2.5" />
      {children}
    </span>
  )
}
