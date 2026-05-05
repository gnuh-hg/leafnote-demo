import {
  TrendingUp,
  Brain,
  Activity,
  Calendar,
  Layers,
  Flame,
} from 'lucide-react'
import {
  cognitiveProfile,
  forgettingCurveData,
  topicHeatmap,
} from '../data/mockData'

export default function Insights() {
  return (
    <div className="px-8 py-8 max-w-[1500px] mx-auto">
      <div className="mb-8">
        <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5">
          <Brain className="w-3 h-3" />
          Cập nhật theo từng phiên ôn · {cognitiveProfile.totalReviews} review tính đến nay
        </div>
        <h1 className="font-serif text-[44px] leading-tight font-semibold tracking-tight text-zinc-50">
          Hồ sơ nhận thức của bạn
        </h1>
        <p className="text-zinc-400 mt-2 max-w-2xl">
          Leafnote xây dựng profile cá nhân từ hành vi ôn tập, mở lại, và viết note. Càng dùng lâu, các điều chỉnh càng chính xác.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <BigStat
          icon={Layers}
          label="Tổng số hạt"
          value={cognitiveProfile.totalAtoms}
          unit="hạt"
        />
        <BigStat
          icon={Activity}
          label="Retention TB"
          value={`${Math.round(cognitiveProfile.avgRetention * 100)}%`}
          accent="indigo"
        />
        <BigStat
          icon={Flame}
          label="Streak"
          value={cognitiveProfile.streak}
          unit="ngày"
          accent="amber"
        />
        <BigStat
          icon={Calendar}
          label="Tổng review"
          value={cognitiveProfile.totalReviews.toLocaleString('vi-VN')}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Forgetting curve */}
        <div className="col-span-12 lg:col-span-7 card-surface p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                  Forgetting curve cá nhân hoá
                </h3>
              </div>
              <p className="text-sm text-zinc-300">
                Bạn quên nhanh hơn FSRS mặc định khoảng{' '}
                <span className="text-rose-300 font-medium">22%</span>. Leafnote đã rút ngắn interval review.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <Legend color="#818cf8" label="Bạn" />
              <Legend color="#3d3d4f" label="FSRS mặc định" dashed />
            </div>
          </div>
          <ForgettingChart />
        </div>

        {/* Cognitive traits */}
        <div className="col-span-12 lg:col-span-5 card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-3.5 h-3.5 text-violet-400" />
            <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
              Đặc điểm nhận thức
            </h3>
          </div>
          <div className="space-y-4">
            {cognitiveProfile.traits.map((t, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[12px] text-zinc-500">{t.label}</span>
                  <span className="text-sm text-indigo-300 font-medium">
                    {t.value}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {t.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Topic heatmap */}
        <div className="col-span-12 card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                  Bản đồ nhiệt chủ đề · 12 tuần gần nhất
                </h3>
              </div>
              <p className="text-sm text-zinc-300">
                Cụm nào đang phát triển, cụm nào đang lạnh dần — Leafnote dùng dữ liệu này để chọn hạt cần surface.
              </p>
            </div>
          </div>
          <Heatmap />
        </div>

        {/* Behavioral signals */}
        <div className="col-span-12 lg:col-span-6 card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
              Tín hiệu Leafnote đang theo dõi
            </h3>
          </div>
          <div className="space-y-3">
            <Signal
              label="Lịch sử trả lời active recall"
              detail="Fit tham số FSRS per-user qua MLE"
              strength={0.92}
            />
            <Signal
              label="Tần suất mở lại / trích dẫn hạt"
              detail="Phản ánh relevance score real-time"
              strength={0.78}
            />
            <Signal
              label="Ngữ cảnh phiên làm việc"
              detail="Embedding tổng hợp 7 ngày gần nhất"
              strength={0.64}
            />
            <Signal
              label="Thời gian dừng ở mỗi câu hỏi"
              detail="Báo hiệu độ khó cảm nhận khác với điểm tự đánh giá"
              strength={0.41}
            />
            <Signal
              label="Format câu hỏi hiệu quả nhất"
              detail="Cloze > định nghĩa ngược cho profile của bạn"
              strength={0.55}
            />
          </div>
        </div>

        {/* Adaptations */}
        <div className="col-span-12 lg:col-span-6 card-surface p-6 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border-indigo-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="text-[11px] uppercase tracking-wider text-indigo-300 font-medium">
              Leafnote đã điều chỉnh cho bạn
            </h3>
          </div>
          <div className="space-y-3 text-[13px] leading-relaxed text-zinc-200">
            <Adapt>
              Rút ngắn interval review trung bình{' '}
              <span className="text-indigo-300 font-medium">×1.2</span> sau khi
              phát hiện forgetting curve dốc.
            </Adapt>
            <Adapt>
              Ưu tiên format <span className="text-indigo-300 font-medium">cloze + ứng dụng</span>{' '}
              cho hạt mới sinh, giảm sinh "định nghĩa ngược".
            </Adapt>
            <Adapt>
              Phân rã hạt mịn hơn (
              <span className="text-indigo-300 font-medium">~22 từ/hạt</span>) — bạn nhớ tốt hơn ở granularity này.
            </Adapt>
            <Adapt>
              Surfacing chủ động khi mở project Triết học khoa học, giảm khi mở Sinh học (cụm ngủ đông).
            </Adapt>
          </div>
        </div>
      </div>
    </div>
  )
}

function BigStat({ icon: Icon, label, value, unit, accent }) {
  const accentMap = {
    indigo: 'text-indigo-300',
    amber: 'text-amber-300',
  }
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-2">
        <Icon className="w-3 h-3" />
        <span className="uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-serif text-3xl font-semibold tabular-nums ${
            accentMap[accent] || 'text-zinc-100'
          }`}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-zinc-500">{unit}</span>}
      </div>
    </div>
  )
}

function Legend({ color, label, dashed }) {
  return (
    <span className="flex items-center gap-1.5 text-zinc-500">
      <svg width="20" height="2">
        <line
          x1="0"
          y1="1"
          x2="20"
          y2="1"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={dashed ? '3 2' : '0'}
        />
      </svg>
      {label}
    </span>
  )
}

function ForgettingChart() {
  const w = 700
  const h = 220
  const pad = { l: 40, r: 16, t: 12, b: 28 }
  const data = forgettingCurveData
  const xScale = (d) => pad.l + ((d - 1) / 29) * (w - pad.l - pad.r)
  const yScale = (v) => pad.t + (1 - v) * (h - pad.t - pad.b)

  const userPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.day)} ${yScale(d.user)}`)
    .join(' ')
  const fsrsPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.day)} ${yScale(d.fsrs)}`)
    .join(' ')
  const userArea = `${userPath} L ${xScale(30)} ${h - pad.b} L ${pad.l} ${h - pad.b} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
      <defs>
        <linearGradient id="userFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(129 140 248)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(129 140 248)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid Y */}
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line
            x1={pad.l}
            y1={yScale(v)}
            x2={w - pad.r}
            y2={yScale(v)}
            stroke="#252532"
            strokeWidth="0.5"
          />
          <text
            x={pad.l - 6}
            y={yScale(v) + 3}
            textAnchor="end"
            fontSize="9"
            fill="#60606a"
          >
            {Math.round(v * 100)}%
          </text>
        </g>
      ))}
      {/* X labels */}
      {[1, 7, 14, 21, 30].map((d) => (
        <text
          key={d}
          x={xScale(d)}
          y={h - 10}
          textAnchor="middle"
          fontSize="9"
          fill="#60606a"
        >
          {d === 1 ? 'hôm nay' : `${d}d`}
        </text>
      ))}
      {/* Threshold */}
      <line
        x1={pad.l}
        y1={yScale(0.7)}
        x2={w - pad.r}
        y2={yScale(0.7)}
        stroke="rgb(244 63 94)"
        strokeDasharray="2 4"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <text
        x={w - pad.r - 4}
        y={yScale(0.7) - 3}
        textAnchor="end"
        fontSize="9"
        fill="rgb(244 63 94)"
        opacity="0.8"
      >
        ngưỡng review 70%
      </text>
      {/* FSRS */}
      <path
        d={fsrsPath}
        fill="none"
        stroke="#3d3d4f"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      {/* User */}
      <path d={userArea} fill="url(#userFill)" />
      <path
        d={userPath}
        fill="none"
        stroke="rgb(129 140 248)"
        strokeWidth="2"
      />
    </svg>
  )
}

function Heatmap() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center text-[10px] text-zinc-500 ml-32">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 text-center">
            T{i + 1}
          </div>
        ))}
      </div>
      {topicHeatmap.map((row) => (
        <div key={row.project} className="flex items-center gap-2">
          <div className="w-32 text-[12px] text-zinc-300 truncate">
            {row.project}
          </div>
          <div className="flex-1 flex gap-1">
            {row.weeks.map((v, i) => (
              <div
                key={i}
                className="flex-1 h-6 rounded-sm transition hover:scale-110"
                style={{
                  background: heatColor(v),
                }}
                title={`Tuần ${i + 1}: hoạt động ${Math.round(v * 100)}%`}
              />
            ))}
          </div>
          <div className="w-12 text-right text-[10px] text-zinc-500 tabular-nums">
            {Math.round(row.weeks[row.weeks.length - 1] * 100)}%
          </div>
        </div>
      ))}
    </div>
  )
}

function heatColor(v) {
  if (v < 0.1) return '#1c1c28'
  if (v < 0.3) return 'rgba(129, 140, 248, 0.15)'
  if (v < 0.5) return 'rgba(129, 140, 248, 0.35)'
  if (v < 0.7) return 'rgba(168, 85, 247, 0.5)'
  if (v < 0.85) return 'rgba(217, 70, 239, 0.65)'
  return 'rgba(251, 113, 133, 0.85)'
}

function Signal({ label, detail, strength }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] text-zinc-200">{label}</span>
        <span className="text-[10px] text-zinc-500 tabular-nums">
          {Math.round(strength * 100)}%
        </span>
      </div>
      <div className="h-1 rounded-full bg-ink-700 overflow-hidden mb-1">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
          style={{ width: `${strength * 100}%` }}
        />
      </div>
      <p className="text-[11px] text-zinc-500">{detail}</p>
    </div>
  )
}

function Adapt({ children }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
      <p>{children}</p>
    </div>
  )
}
