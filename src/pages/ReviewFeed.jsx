import { useState } from 'react'
import {
  Brain,
  Eye,
  ChevronRight,
  ArrowLeft,
  Flame,
  CheckCircle2,
} from 'lucide-react'
import { atoms, reviewQueue } from '../data/mockData'
import { TYPE_STYLES } from '../components/AtomCard'

const DIFFICULTIES = [
  { id: 'forgot', label: 'Quên', detail: '< 1 ngày', color: 'bg-rose-500 hover:bg-rose-400', text: 'text-white' },
  { id: 'hard', label: 'Khó', detail: '2 ngày', color: 'bg-amber-500 hover:bg-amber-400', text: 'text-white' },
  { id: 'good', label: 'Vừa', detail: '6 ngày', color: 'bg-indigo-500 hover:bg-indigo-400', text: 'text-white' },
  { id: 'easy', label: 'Dễ', detail: '14 ngày', color: 'bg-emerald-500 hover:bg-emerald-400', text: 'text-white' },
]

export default function ReviewFeed() {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(0)

  const queue = reviewQueue
  const current = atoms.find((a) => a.id === queue[idx])
  if (!current) {
    return <Done count={done} />
  }
  const T = TYPE_STYLES[current.type] || TYPE_STYLES.definition
  const question = current.questions?.[0] || {
    type: 'recall',
    q: `Phát biểu lại: ${current.content.slice(0, 40)}...`,
    a: current.content,
  }

  const next = () => {
    setRevealed(false)
    setIdx(idx + 1)
    setDone(done + 1)
  }

  const progress = ((idx + (revealed ? 0.5 : 0)) / queue.length) * 100

  return (
    <div className="min-h-full flex flex-col items-center justify-start px-6 py-8">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <button className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Thoát phiên
          </button>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-zinc-500">
              <span className="text-zinc-200 font-medium">{idx + 1}</span>
              <span className="text-zinc-600"> / {queue.length}</span>
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-orange-300 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              47 ngày streak
            </span>
          </div>
        </div>
        <div className="h-1 rounded-full bg-ink-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl">
        <div className="card-surface p-8 bg-ink-900/60 animate-slide-up" key={idx}>
          {/* Type + meta */}
          <div className="flex items-center justify-between mb-6">
            <span className={`pill border ${T.color}`}>
              <T.icon className="w-3 h-3" />
              {T.label}
            </span>
            <span className="text-[11px] text-zinc-500">
              {question.type === 'cloze'
                ? 'Cloze'
                : question.type === 'definition-reverse'
                ? 'Định nghĩa ngược'
                : question.type === 'application'
                ? 'Ứng dụng'
                : 'Truy hồi'}
              <span className="mx-1.5 text-zinc-700">·</span>
              {current.sourceNoteTitle}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-3 font-medium flex items-center gap-1.5">
              <Brain className="w-3 h-3" />
              Câu hỏi
            </div>
            <p className="text-2xl leading-relaxed font-serif text-zinc-50">
              {question.q}
            </p>
          </div>

          {/* Answer */}
          {revealed ? (
            <div className="mb-8 animate-fade-in">
              <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-3 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                Đáp án
              </div>
              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-5">
                <p className="text-[15px] leading-relaxed text-zinc-100 font-serif">
                  {question.a}
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-ink-850/60 border border-ink-700/40 p-4">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 font-medium">
                  Hạt gốc
                </div>
                <p className="text-[13px] text-zinc-300 leading-relaxed">
                  {current.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-xl bg-ink-850/30 border border-dashed border-ink-700/60 p-8 text-center">
              <div className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-3">
                <Eye className="w-4 h-4 text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                Hãy thử nhớ trước khi xem đáp án
              </p>
              <button
                onClick={() => setRevealed(true)}
                className="px-4 py-2 rounded-lg bg-ink-800 hover:bg-ink-750 text-zinc-200 text-sm font-medium transition"
              >
                Hiện đáp án
              </button>
            </div>
          )}

          {/* Difficulty buttons */}
          {revealed && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-3 font-medium">
                Mức độ ghi nhớ — phản hồi sẽ cập nhật forgetting curve cá nhân
              </div>
              <div className="grid grid-cols-4 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={next}
                    className={`flex flex-col items-center gap-0.5 py-3 rounded-xl ${d.color} ${d.text} transition shadow-lg`}
                  >
                    <span className="text-sm font-semibold">{d.label}</span>
                    <span className="text-[10px] opacity-80">{d.detail}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Meta strip */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
          <MetaPill label="Retention" value={`${Math.round(current.retention * 100)}%`} />
          <MetaPill label="Liên quan" value={`${Math.round(current.relevance * 100)}%`} />
          <MetaPill label="Lần ôn thứ" value={`${current.reviewCount + 1}`} />
        </div>
      </div>
    </div>
  )
}

function MetaPill({ label, value }) {
  return (
    <div className="card-surface px-3 py-2 flex items-center justify-between bg-ink-900/40">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-200 font-medium">{value}</span>
    </div>
  )
}

function Done({ count }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-8">
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
      </div>
      <h2 className="font-serif text-3xl font-semibold text-zinc-50 mb-2">
        Xong phiên ôn hôm nay
      </h2>
      <p className="text-zinc-400 mb-8">
        Đã ôn {count} hạt · forgetting curve đã cập nhật
      </p>
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg bg-ink-850 hover:bg-ink-800 text-zinc-200 text-sm font-medium transition">
          Xem lại phiên
        </button>
        <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition">
          Quay về dashboard
          <ChevronRight className="w-4 h-4 inline ml-1" />
        </button>
      </div>
    </div>
  )
}
