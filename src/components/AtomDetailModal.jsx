import { X, Brain, Link2, Edit2, GitMerge, Calendar, Eye, Snowflake, Sun } from 'lucide-react'
import { TYPE_STYLES, RetentionRow } from './AtomCard'
import { atoms as allAtoms } from '../data/mockData'

export default function AtomDetailModal({ atom, onClose }) {
  const T = TYPE_STYLES[atom.type] || TYPE_STYLES.definition
  const linked = (atom.linkedAtoms || [])
    .map((id) => allAtoms.find((a) => a.id === id))
    .filter(Boolean)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto card-surface bg-ink-900 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-ink-900/95 backdrop-blur-xl border-b border-ink-700/60 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className={`pill border ${T.color}`}>
              <T.icon className="w-3 h-3" />
              {T.label}
            </span>
            {atom.dormant && (
              <span className="pill border text-sky-300 bg-sky-500/10 border-sky-500/20">
                <Snowflake className="w-2.5 h-2.5" />
                Ngủ đông
              </span>
            )}
            <span className="text-[11px] text-zinc-500">
              ID: <span className="font-mono">{atom.id}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ink-800 text-zinc-400 hover:text-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Atom content */}
          <div>
            <p className="text-2xl leading-snug font-serif text-zinc-50">
              {atom.content}
            </p>
          </div>

          {/* Why surfacing */}
          {atom.surfacingReason && (
            <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/20 p-4">
              <div className="text-[10px] uppercase tracking-wider text-indigo-300 mb-1 font-medium">
                Vì sao xuất hiện lúc này
              </div>
              <p className="text-sm text-zinc-200">{atom.surfacingReason}</p>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-surface p-4 bg-ink-850/60">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-3 font-medium">
                Vòng đời hạt
              </div>
              <div className="space-y-2.5">
                <RetentionRow label="Ghi nhớ" value={atom.retention} kind="retention" />
                <RetentionRow label="Liên quan" value={atom.relevance} kind="relevance" />
              </div>
              <div className="mt-4 pt-3 border-t border-ink-700/60 grid grid-cols-2 gap-2 text-[11px]">
                <Meta icon={Eye} label="Đã ôn" value={`${atom.reviewCount} lần`} />
                <Meta icon={Calendar} label="Lần cuối" value={atom.lastReviewedAt} />
              </div>
            </div>

            <div className="card-surface p-4 bg-ink-850/60">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-3 font-medium">
                Forgetting curve cá nhân
              </div>
              <MiniCurve retention={atom.retention} />
            </div>
          </div>

          {/* Active recall questions */}
          {atom.questions && atom.questions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-medium text-zinc-200">
                  Câu hỏi truy hồi (AI sinh)
                </h3>
                <span className="text-[10px] text-zinc-500">
                  {atom.questions.length} biến thể
                </span>
              </div>
              <div className="space-y-2">
                {atom.questions.map((q, i) => (
                  <div
                    key={i}
                    className="card-surface p-3.5 bg-ink-850/40 hover:bg-ink-850 transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium pt-0.5 shrink-0 w-20">
                        {q.type === 'cloze'
                          ? 'Cloze'
                          : q.type === 'definition-reverse'
                          ? 'Định nghĩa ngược'
                          : 'Ứng dụng'}
                      </span>
                      <p className="text-sm text-zinc-200 flex-1">{q.q}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked atoms */}
          {linked.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-medium text-zinc-200">
                  Hạt liên kết
                </h3>
                <span className="text-[10px] text-zinc-500">
                  {linked.length} hạt
                </span>
              </div>
              <div className="space-y-1.5">
                {linked.map((la) => (
                  <div
                    key={la.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-ink-850/60 hover:bg-ink-850 transition"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${TYPE_STYLES[la.type].dot} shrink-0`} />
                    <p className="text-[13px] text-zinc-300 flex-1 truncate">
                      {la.content}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {Math.round(la.retention * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-ink-900/95 backdrop-blur-xl border-t border-ink-700/60 px-6 py-3 flex items-center justify-between">
          <div className="text-[11px] text-zinc-500">
            Từ ghi chú <span className="text-zinc-300">{atom.sourceNoteTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-ink-800 transition flex items-center gap-1.5">
              <Edit2 className="w-3 h-3" />
              Sửa
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-ink-800 transition flex items-center gap-1.5">
              <GitMerge className="w-3 h-3" />
              Merge
            </button>
            {atom.dormant ? (
              <button className="px-3 py-1.5 rounded-lg text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition flex items-center gap-1.5">
                <Sun className="w-3 h-3" />
                Hồi sinh
              </button>
            ) : (
              <button className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-sky-300 hover:bg-sky-500/10 transition flex items-center gap-1.5">
                <Snowflake className="w-3 h-3" />
                Ngủ đông
              </button>
            )}
            <button className="px-3 py-1.5 rounded-lg text-xs bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition flex items-center gap-1.5">
              <Brain className="w-3 h-3" />
              Ôn ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5 text-zinc-500">
      <Icon className="w-3 h-3" />
      <span>{label}:</span>
      <span className="text-zinc-300 font-medium">{value}</span>
    </div>
  )
}

function MiniCurve({ retention }) {
  // Mock curve: bắt đầu ở 1.0, hiện tại ở giá trị retention, tương lai dự đoán giảm
  const points = []
  for (let day = 0; day <= 30; day++) {
    const k = -Math.log(retention) / 14 // fit để day 14 ≈ retention hiện tại
    const v = Math.exp(-k * day)
    points.push({ x: day, y: v })
  }
  const w = 240
  const h = 80
  const path = points
    .map(
      (p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x / 30) * w} ${h - p.y * h}`,
    )
    .join(' ')
  const targetX = (14 / 30) * w
  const targetY = h - retention * h

  return (
    <svg viewBox={`0 0 ${w} ${h + 16}`} className="w-full h-20">
      <defs>
        <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(129 140 248)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(129 140 248)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#curveFill)" />
      <path
        d={path}
        fill="none"
        stroke="rgb(129 140 248)"
        strokeWidth="1.5"
      />
      {/* Target review line */}
      <line
        x1={targetX}
        y1={0}
        x2={targetX}
        y2={h}
        stroke="rgb(251 191 36)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <circle cx={targetX} cy={targetY} r="3" fill="rgb(251 191 36)" />
      <text x={targetX + 4} y={targetY - 4} fontSize="9" fill="rgb(251 191 36)">
        hôm nay
      </text>
      {/* Retention threshold */}
      <line
        x1={0}
        y1={h - 0.7 * h}
        x2={w}
        y2={h - 0.7 * h}
        stroke="rgb(244 63 94)"
        strokeWidth="0.5"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      <text x={w - 30} y={h - 0.7 * h - 2} fontSize="8" fill="rgb(244 63 94)" opacity="0.7">
        70%
      </text>
    </svg>
  )
}
