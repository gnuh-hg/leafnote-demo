import {
  AlertTriangle,
  Zap,
  Clock,
  Sparkles,
  GitMerge,
  BookOpen,
  Link2,
  Snowflake,
} from 'lucide-react'

export const TYPE_STYLES = {
  definition: {
    label: 'Định nghĩa',
    icon: BookOpen,
    color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  proposition: {
    label: 'Mệnh đề',
    icon: Sparkles,
    color: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-400',
  },
  relation: {
    label: 'Quan hệ',
    icon: GitMerge,
    color: 'text-teal-700 dark:text-teal-300 bg-teal-500/10 border-teal-500/20',
    dot: 'bg-teal-400',
  },
  fact: {
    label: 'Dữ kiện',
    icon: Link2,
    color: 'text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/20',
    dot: 'bg-sky-400',
  },
}

export const SURFACE_STYLES = {
  forgetting: { label: 'Sắp quên', icon: Clock, color: 'text-rose-600 dark:text-rose-300' },
  related: { label: 'Liên quan ngay', icon: Zap, color: 'text-amber-600 dark:text-amber-300' },
  conflict: { label: 'Mâu thuẫn', icon: AlertTriangle, color: 'text-red-600 dark:text-red-300' },
  new: { label: 'Mới sinh', icon: Sparkles, color: 'text-emerald-600 dark:text-emerald-300' },
}

export default function AtomCard({ atom, onClick, compact = false }) {
  const T = TYPE_STYLES[atom.type] || TYPE_STYLES.definition
  const S = atom.surfacingType ? SURFACE_STYLES[atom.surfacingType] : null

  return (
    <button
      onClick={onClick}
      className="group text-left card-surface p-5 hover:border-emerald-500/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/5 animate-fade-in w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className={`pill border ${T.color}`}>
            <T.icon className="w-3 h-3" />
            {T.label}
          </span>
          {atom.dormant && (
            <span className="pill border text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/20" title="Hạt ngủ đông — không xuất hiện trong recall">
              <Snowflake className="w-2.5 h-2.5" />
              Ngủ đông
            </span>
          )}
        </div>
        {S && (
          <span className={`flex items-center gap-1 text-[11px] font-medium ${S.color}`}>
            <S.icon className="w-3 h-3" />
            {S.label}
          </span>
        )}
      </div>

      <p className="text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-100 mb-3 font-serif">
        {atom.content}
      </p>

      {atom.surfacingReason && !compact && (
        <div className="text-[11px] text-zinc-500 mb-4 italic border-l-2 border-paper-300 dark:border-ink-700 pl-2.5">
          {atom.surfacingReason}
        </div>
      )}

      <div className="space-y-1.5 mb-4">
        <RetentionRow label="Ghi nhớ" value={atom.retention} kind="retention" />
        <RetentionRow label="Liên quan" value={atom.relevance} kind="relevance" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-paper-300/60 dark:border-ink-700/60 text-[11px] text-zinc-500">
        <span className="truncate flex items-center gap-1.5">
          <BookOpen className="w-3 h-3 shrink-0" />
          {atom.sourceNoteTitle}
        </span>
        <span className="shrink-0 ml-2">{atom.lastReviewedAt}</span>
      </div>
    </button>
  )
}

export function RetentionRow({ label, value, kind = 'retention' }) {
  const pct = Math.round(value * 100)
  const isLow = pct < 50
  const colorMap = {
    retention: isLow
      ? 'from-rose-500 to-orange-500'
      : 'from-emerald-500 to-teal-500',
    relevance: 'from-amber-400 to-orange-500',
  }
  const labelColor = {
    retention: isLow ? 'text-rose-500 dark:text-rose-400' : 'text-zinc-500',
    relevance: 'text-zinc-500',
  }
  return (
    <div className="flex items-center gap-2.5 text-[11px]">
      <span className={`w-16 ${labelColor[kind]}`}>{label}</span>
      <div className="flex-1 h-1 rounded-full bg-paper-300 dark:bg-ink-700 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorMap[kind]} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`w-8 text-right tabular-nums font-medium ${
          kind === 'retention' && isLow ? 'text-rose-500 dark:text-rose-300' : 'text-zinc-600 dark:text-zinc-300'
        }`}
      >
        {pct}%
      </span>
    </div>
  )
}
