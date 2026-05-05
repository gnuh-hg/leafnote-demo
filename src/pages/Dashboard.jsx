import { useState } from 'react'
import {
  Filter,
  TrendingUp,
  Brain,
  AlertTriangle,
  Flame,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import AtomCard from '../components/AtomCard'
import AtomDetailModal from '../components/AtomDetailModal'
import { atoms, todayStats, conflicts } from '../data/mockData'

const FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'forgetting', label: 'Sắp quên' },
  { id: 'related', label: 'Liên quan ngay' },
  { id: 'conflict', label: 'Mâu thuẫn' },
  { id: 'new', label: 'Mới sinh' },
]

export default function Dashboard() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  // Chỉ lấy hạt thuộc surfacing feed (có surfacingType)
  const surfacing = atoms.filter((a) => a.surfacingType)
  const visible = surfacing.filter((a) =>
    filter === 'all' ? true : a.surfacingType === filter,
  )

  return (
    <div className="px-8 py-8 max-w-[1500px] mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft" />
          <span className="text-amber-400">Project: Triết học khoa học</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">Phiên làm việc 24 phút</span>
        </div>
        <h1 className="font-serif text-[44px] leading-tight font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Đang nổi lên cho bạn
        </h1>
        <p className="text-zinc-400 mt-2 max-w-2xl">
          {surfacing.length} hạt được surfacing dựa trên ngữ cảnh phiên làm việc, đường cong quên cá nhân và hành vi 7 ngày gần nhất.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main feed */}
        <div className="col-span-12 lg:col-span-9">
          {/* Filter pills */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
            <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`pill border whitespace-nowrap transition ${
                  filter === f.id
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border-emerald-500/40'
                    : 'border-paper-300 dark:border-ink-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-paper-400 dark:hover:border-ink-600'
                }`}
              >
                {f.label}
                {f.id !== 'all' && (
                  <span className="ml-1 text-[10px] text-zinc-500">
                    {surfacing.filter((a) => a.surfacingType === f.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Atoms grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map((atom) => (
              <AtomCard
                key={atom.id}
                atom={atom}
                onClick={() => setSelected(atom)}
              />
            ))}
          </div>

          {visible.length === 0 && (
            <div className="card-surface p-12 text-center text-zinc-500">
              Không có hạt nào trong filter này
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <SidePanel title="Hôm nay" icon={Brain}>
            <Stat label="Cần ôn" value={`${todayStats.needReview} hạt`} highlight />
            <Stat label="Đã ôn" value={`${todayStats.reviewed} hạt`} />
            <Stat label="Hạt mới sinh" value={`${todayStats.newAtoms} hạt`} />
            <Stat label="Thời gian học" value={`${todayStats.studyMinutes} phút`} />
            <div className="mt-3 pt-3 border-t border-paper-300/60 dark:border-ink-700/60 flex items-center gap-2 text-[11px]">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-zinc-400">Streak</span>
              <span className="ml-auto text-orange-300 font-medium">
                {todayStats.streakDays} ngày
              </span>
            </div>
          </SidePanel>

          <SidePanel title="Sức khỏe ghi nhớ" icon={TrendingUp}>
            <RetentionDist />
          </SidePanel>

          <SidePanel title="Cần xử lý" icon={AlertTriangle} accent="rose">
            {conflicts.map((c) => (
              <button
                key={c.id}
                className="w-full text-left p-2.5 rounded-lg hover:bg-paper-200 dark:hover:bg-ink-800 transition group"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      c.severity === 'medium' ? 'bg-rose-400' : 'bg-amber-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-zinc-700 dark:text-zinc-200 leading-snug">
                      {c.summary}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      {c.detail}
                    </p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 mt-1 shrink-0" />
                </div>
              </button>
            ))}
          </SidePanel>

          <SidePanel title="Gợi ý mở rộng" icon={Sparkles} accent="emerald">
            <div className="text-[12px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Bạn có 3 note về Kuhn nhưng chưa có hạt nào về{' '}
              <span className="text-emerald-600 dark:text-emerald-300 font-medium">incommensurability</span>
              . Khái niệm liền kề thường được Kuhn đề cập.
            </div>
            <button className="mt-2 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium">
              Xem ngữ cảnh →
            </button>
          </SidePanel>
        </div>
      </div>

      {selected && (
        <AtomDetailModal atom={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function SidePanel({ title, icon: Icon, accent, children }) {
  const accentColor = {
    rose: 'text-rose-500 dark:text-rose-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    indigo: 'text-emerald-600 dark:text-emerald-400',
  }[accent] || 'text-zinc-500 dark:text-zinc-400'
  return (
    <div className="card-surface p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-3.5 h-3.5 ${accentColor}`} />
        <h3 className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
          {title}
        </h3>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-baseline text-[12px]">
      <span className="text-zinc-500">{label}</span>
      <span
        className={`font-medium ${
          highlight ? 'text-emerald-600 dark:text-emerald-300' : 'text-zinc-700 dark:text-zinc-200'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function RetentionDist() {
  const buckets = [
    { label: '> 80%', value: 42, color: 'bg-emerald-400' },
    { label: '60—80%', value: 58, color: 'bg-teal-400' },
    { label: '40—60%', value: 28, color: 'bg-amber-400' },
    { label: '< 40%', value: 14, color: 'bg-rose-400' },
  ]
  const total = buckets.reduce((s, b) => s + b.value, 0)
  return (
    <div className="space-y-2">
      <div className="h-2 rounded-full overflow-hidden flex bg-paper-300 dark:bg-ink-700">
        {buckets.map((b) => (
          <div
            key={b.label}
            className={b.color}
            style={{ width: `${(b.value / total) * 100}%` }}
            title={`${b.label}: ${b.value} hạt`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        {buckets.map((b) => (
          <div key={b.label} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
            <span className="text-zinc-500">{b.label}</span>
            <span className="ml-auto text-zinc-600 dark:text-zinc-300 font-medium tabular-nums">
              {b.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
