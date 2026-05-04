import { useState } from 'react'
import {
  Atom,
  Sparkles,
  Plus,
  AlertTriangle,
  GitMerge,
  Link2,
  CheckCircle2,
  CircleDashed,
  Layers,
} from 'lucide-react'
import { decompositionDemo } from '../data/mockData'
import { TYPE_STYLES } from '../components/AtomCard'

export default function NoteEditor() {
  const [activeAtom, setActiveAtom] = useState(null)
  const note = decompositionDemo

  return (
    <div className="px-8 py-8 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-400">Triết học khoa học</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500">Đã lưu lúc 14:32</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500 flex items-center gap-1">
              <Atom className="w-3 h-3" />
              5 hạt được tách
            </span>
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-50">
            {note.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-ink-850 transition">
            Xem graph
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition">
            Lưu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Note body */}
        <div className="col-span-12 lg:col-span-7 card-surface p-8 bg-ink-900/40">
          <div className="prose prose-invert max-w-none">
            {note.body.map((block, i) => (
              <p
                key={i}
                className="text-[16px] leading-[1.85] text-zinc-200 font-serif mb-5 last:mb-0"
              >
                {block.segments.map((seg, j) => {
                  if (seg.atomId) {
                    const isActive = activeAtom === seg.atomId
                    return (
                      <span
                        key={j}
                        className={`atom-highlight type-${seg.atomType} ${
                          isActive ? 'active' : ''
                        }`}
                        onMouseEnter={() => setActiveAtom(seg.atomId)}
                        onMouseLeave={() => setActiveAtom(null)}
                      >
                        {seg.text}
                      </span>
                    )
                  }
                  if (seg.italic) {
                    return (
                      <em key={j} className="text-zinc-300">
                        {seg.text}
                      </em>
                    )
                  }
                  return <span key={j}>{seg.text}</span>
                })}
              </p>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-5 border-t border-ink-700/40 flex items-center gap-4 text-[10px] text-zinc-500">
            <span className="uppercase tracking-wider font-medium">Highlight</span>
            <Legend color="rgba(129, 140, 248, 0.4)" label="Định nghĩa" />
            <Legend color="rgba(251, 191, 36, 0.4)" label="Mệnh đề" />
            <Legend color="rgba(52, 211, 153, 0.4)" label="Quan hệ" />
            <Legend color="rgba(56, 189, 248, 0.4)" label="Dữ kiện" />
          </div>
        </div>

        {/* Right panel: detected atoms */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          {/* Engine status */}
          <div className="card-surface p-4 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
              </div>
              <div>
                <div className="text-[13px] font-medium text-zinc-100">
                  Atomic Knowledge Engine
                </div>
                <div className="text-[11px] text-zinc-500">
                  Phân rã xong · 2 hạt mới · 2 hạt khớp · 1 hạt liên kết
                </div>
              </div>
            </div>
          </div>

          {/* Detected atoms */}
          <div className="card-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Atom className="w-3.5 h-3.5 text-indigo-400" />
                <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                  Hạt được tách ({note.detectedAtoms.length})
                </h3>
              </div>
              <button className="text-[11px] text-zinc-500 hover:text-zinc-300">
                Tất cả ↓
              </button>
            </div>
            <div className="space-y-2">
              {note.detectedAtoms.map((atom) => {
                const T = TYPE_STYLES[atom.type] || TYPE_STYLES.definition
                const isActive = activeAtom === atom.id
                return (
                  <button
                    key={atom.id}
                    onMouseEnter={() => setActiveAtom(atom.id)}
                    onMouseLeave={() => setActiveAtom(null)}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      isActive
                        ? 'bg-ink-800 border-indigo-500/40'
                        : 'bg-ink-850/50 border-ink-700/40 hover:bg-ink-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`pill border ${T.color}`}>
                          <T.icon className="w-2.5 h-2.5" />
                          {T.label}
                        </span>
                        <StatusBadge status={atom.status} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {Math.round(atom.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-[13px] text-zinc-200 leading-relaxed font-serif">
                      {atom.content}
                    </p>
                  </button>
                )
              })}
            </div>
            <button className="w-full mt-3 py-2 rounded-lg border border-dashed border-ink-700 text-[12px] text-zinc-500 hover:text-zinc-300 hover:border-ink-600 transition flex items-center justify-center gap-1.5">
              <Plus className="w-3 h-3" />
              Thêm hạt thủ công
            </button>
          </div>

          {/* Insights */}
          <div className="card-surface p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                AI phát hiện
              </h3>
            </div>
            <div className="space-y-2.5">
              {note.insights.map((ins, i) => {
                const cfg = {
                  related: { Icon: Link2, color: 'text-sky-300' },
                  gap: { Icon: CircleDashed, color: 'text-emerald-300' },
                  conflict: { Icon: AlertTriangle, color: 'text-rose-300' },
                  merge: { Icon: GitMerge, color: 'text-amber-300' },
                }[ins.kind]
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <cfg.Icon className={`w-3.5 h-3.5 ${cfg.color} mt-0.5 shrink-0`} />
                    <p className="text-[12px] text-zinc-300 leading-relaxed">
                      {ins.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="w-3 h-2 rounded-sm"
        style={{ background: color }}
      />
      <span className="text-zinc-400">{label}</span>
    </span>
  )
}

function StatusBadge({ status }) {
  const cfg = {
    new: { label: 'Mới', color: 'text-emerald-300 bg-emerald-500/10', Icon: Plus },
    existing: { label: 'Khớp', color: 'text-zinc-400 bg-zinc-500/10', Icon: CheckCircle2 },
    linked: { label: 'Liên kết', color: 'text-sky-300 bg-sky-500/10', Icon: Link2 },
  }[status]
  if (!cfg) return null
  return (
    <span className={`pill ${cfg.color}`}>
      <cfg.Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  )
}
