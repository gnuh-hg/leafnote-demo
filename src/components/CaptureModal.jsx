import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Type,
  Mic,
  Image as ImageIcon,
  ChevronDown,
  Square,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Wand2,
  User,
  Cpu,
  Layers,
  Edit2,
} from 'lucide-react'
import { projects, decompositionDemo } from '../data/mockData'
import { TYPE_STYLES } from './AtomCard'

const TABS = [
  { id: 'text', label: 'Gõ nhanh', icon: Type, hint: 'Mở app là gõ ngay — auto-save 2s/lần' },
  { id: 'voice', label: 'Ghi âm', icon: Mic, hint: 'Một chạm để thu, STT chạy nền' },
  { id: 'image', label: 'Chụp / OCR', icon: ImageIcon, hint: 'Tối đa 5 ảnh — whiteboard, slide, sách' },
]

const STEPS = [
  { id: 'compose', label: '1. Bạn nhập nội dung', who: 'manual' },
  { id: 'processing', label: '2. AI phân rã thành hạt', who: 'ai' },
  { id: 'done', label: '3. Bạn duyệt & chỉnh hạt', who: 'manual' },
]

export default function CaptureModal({ onClose, initialTab = 'text' }) {
  const [tab, setTab] = useState(initialTab)
  const [stage, setStage] = useState('compose') // compose | processing | done
  const active = projects.find((p) => p.active) || projects[0]

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-ink-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl my-4 card-surface bg-ink-900 animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-ink-700/60 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
              Ghi chú mới
            </div>
            <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-ink-850 hover:bg-ink-800 border border-ink-700/40 text-[11px] text-zinc-300 transition">
              <span className={`w-1.5 h-1.5 rounded-full ${active.dot}`} />
              {active.name}
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ink-800 text-zinc-400 hover:text-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper — luôn hiển thị để user biết đang ở bước nào, ai làm */}
        <Stepper stage={stage} />

        {stage === 'compose' && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-ink-700/60 px-2">
              {TABS.map((t) => {
                const Icon = t.icon
                const isActive = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium border-b-2 -mb-px transition ${
                      isActive
                        ? 'border-indigo-400 text-indigo-200'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                )
              })}
              <div className="flex-1" />
              <div className="self-center pr-2 text-[10px] text-zinc-600">
                {TABS.find((t) => t.id === tab).hint}
              </div>
            </div>

            <div className="p-5">
              {tab === 'text' && <TextCapture />}
              {tab === 'voice' && <VoiceCapture />}
              {tab === 'image' && <ImageCapture />}
            </div>

            <Footer
              left={
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  Bấm <b className="text-zinc-300 font-medium">"Lưu & phân rã"</b> để chuyển AI xử lý
                </span>
              }
              onClose={onClose}
              primary="Lưu & phân rã"
              onPrimary={() => setStage('processing')}
            />
          </>
        )}

        {stage === 'processing' && (
          <>
            <ProcessingView onDone={() => setStage('done')} />
            <Footer
              left={
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-soft" />
                  Hạt đầu tiên xong sau ~2s · phần còn lại stream tiếp
                </span>
              }
              onClose={onClose}
              cancelLabel="Đóng — chạy nền"
            />
          </>
        )}

        {stage === 'done' && (
          <>
            <ReviewView />
            <Footer
              left={
                <span className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-amber-400" />
                  Bạn duyệt: giữ / sửa / gộp / tách / bỏ — quyết định cuối là của bạn
                </span>
              }
              onClose={onClose}
              primary="Lưu & về dashboard"
              onPrimary={onClose}
            />
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

function Stepper({ stage }) {
  const idx = STEPS.findIndex((s) => s.id === stage)
  return (
    <div className="px-5 py-2.5 bg-ink-900/60 border-b border-ink-700/40 flex items-center gap-2">
      {STEPS.map((s, i) => {
        const isActive = i === idx
        const isDone = i < idx
        return (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10.5px] font-medium transition ${
                isActive
                  ? s.who === 'ai'
                    ? 'bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/30'
                    : 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30'
                  : isDone
                  ? 'text-zinc-500'
                  : 'text-zinc-600'
              }`}
            >
              {s.who === 'ai' ? (
                <Cpu className="w-2.5 h-2.5" />
              ) : (
                <User className="w-2.5 h-2.5" />
              )}
              {s.label}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${isDone ? 'bg-zinc-600' : 'bg-ink-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Footer({ left, onClose, primary, onPrimary, cancelLabel = 'Huỷ' }) {
  return (
    <div className="border-t border-ink-700/60 px-5 py-3 flex items-center justify-between bg-ink-900/60">
      <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
        {left}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-ink-800 transition"
        >
          {cancelLabel}
        </button>
        {primary && (
          <button
            onClick={onPrimary}
            className="px-3 py-1.5 rounded-lg text-xs bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition shadow-lg shadow-indigo-500/20"
          >
            {primary}
          </button>
        )}
      </div>
    </div>
  )
}

/* ---------- Stage 1: COMPOSE ---------- */

function ManualBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
      <User className="w-2.5 h-2.5" />
      Bạn nhập
    </span>
  )
}
function AiBadge({ children = 'AI sinh' }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
      <Cpu className="w-2.5 h-2.5" />
      {children}
    </span>
  )
}

function TextCapture() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
          Tiêu đề
        </span>
        <ManualBadge />
        <span className="text-zinc-700 text-[10px]">hoặc</span>
        <AiBadge>AI sinh nếu để trống</AiBadge>
      </div>
      <input
        type="text"
        placeholder="Để trống → AI tự sinh sau khi phân rã xong"
        className="w-full bg-transparent text-lg font-serif text-zinc-100 placeholder:text-zinc-600 focus:outline-none border-b border-ink-700/40 pb-2 mb-4"
      />

      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
          Nội dung
        </span>
        <ManualBadge />
      </div>
      <textarea
        autoFocus
        rows={7}
        placeholder="Bắt đầu gõ — không cần đặt tiêu đề, không cần chọn thư mục..."
        className="w-full bg-transparent text-[14px] leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-none"
      />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-ink-700/40 text-[11px] text-zinc-500">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Auto-save 2s · offline → đồng bộ khi online
        </div>
        <button className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
          <Wand2 className="w-3 h-3" />
          AI sinh tiêu đề ngay
        </button>
      </div>
    </div>
  )
}

function VoiceCapture() {
  const [state, setState] = useState('idle') // idle | recording | processing | done

  return (
    <div className="text-center py-3">
      <div className="flex items-center justify-center gap-2 mb-3">
        <ManualBadge />
        <span className="text-zinc-600 text-[10px]">→</span>
        <AiBadge>STT + sửa lỗi</AiBadge>
        <span className="text-zinc-600 text-[10px]">→</span>
        <ManualBadge />
        <span className="text-[10px] text-zinc-500">(sửa transcript trước phân rã)</span>
      </div>

      {state === 'idle' && (
        <>
          <button
            onClick={() => setState('recording')}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-rose-500/30 hover:scale-105 transition"
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
          <p className="text-[13px] text-zinc-400 mt-4">Một chạm để bắt đầu thu</p>
          <p className="text-[11px] text-zinc-600 mt-1">Hỗ trợ tiếng Việt + Anh</p>
        </>
      )}

      {state === 'recording' && (
        <>
          <button
            onClick={() => setState('processing')}
            className="w-20 h-20 mx-auto rounded-full bg-rose-500 flex items-center justify-center shadow-2xl shadow-rose-500/40 animate-pulse-soft hover:scale-105 transition"
          >
            <Square className="w-7 h-7 text-white fill-white" />
          </button>
          <div className="flex items-center justify-center gap-1 mt-4 h-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-rose-400 rounded-full animate-pulse-soft"
                style={{
                  height: `${10 + Math.sin(i * 0.7) * 8 + Math.random() * 6}px`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
          <p className="text-[13px] text-rose-300 mt-3 font-medium tabular-nums">00:42</p>
          <p className="text-[11px] text-zinc-500 mt-1">Đang thu · chạm để dừng</p>
        </>
      )}

      {state === 'processing' && (
        <>
          <div className="w-20 h-20 mx-auto rounded-full bg-ink-800 border border-indigo-500/30 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          </div>
          <p className="text-[13px] text-indigo-300 mt-4 font-medium">AI đang xử lý giọng nói…</p>
          <p className="text-[11px] text-zinc-500 mt-1">Note đã được tạo, transcript sẽ điền tự động</p>
          <button
            onClick={() => setState('done')}
            className="mt-3 text-[11px] text-zinc-500 hover:text-zinc-300 underline"
          >
            (demo) hoàn tất
          </button>
        </>
      )}

      {state === 'done' && (
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <AiBadge>AI transcript</AiBadge>
            <span className="text-zinc-600 text-[10px]">→ bạn có thể chỉnh trước khi phân rã</span>
          </div>
          <textarea
            rows={6}
            defaultValue="Trong tác phẩm The Structure of Scientific Revolutions, Kuhn lập luận rằng khoa học không tiến hoá tuyến tính, mà qua các paradigm shift xen kẽ giữa normal science và scientific revolution..."
            className="w-full bg-ink-850 border border-ink-700/40 rounded-lg p-3 text-[13px] leading-relaxed text-zinc-200 focus:outline-none focus:border-indigo-500/40 resize-none"
          />
          <button
            onClick={() => setState('idle')}
            className="mt-2 text-[11px] text-zinc-500 hover:text-zinc-300"
          >
            ↺ Thu lại
          </button>
        </div>
      )}
    </div>
  )
}

function ImageCapture() {
  const [files, setFiles] = useState([
    { id: 1, name: 'whiteboard-paradigm.jpg', size: '1.2 MB', status: 'done' },
    { id: 2, name: 'slide-3-kuhn.png', size: '480 KB', status: 'ocr' },
  ])

  const remove = (id) => setFiles(files.filter((f) => f.id !== id))

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <ManualBadge />
        <span className="text-zinc-600 text-[10px]">upload ảnh →</span>
        <AiBadge>OCR + sửa lỗi</AiBadge>
        <span className="text-zinc-600 text-[10px]">→ tạo note</span>
      </div>

      {/* Drop zone */}
      <div className="rounded-xl border-2 border-dashed border-ink-700 hover:border-indigo-500/40 transition p-6 text-center cursor-pointer bg-ink-850/40">
        <div className="w-10 h-10 mx-auto rounded-full bg-ink-800 flex items-center justify-center mb-2">
          <Plus className="w-4 h-4 text-zinc-400" />
        </div>
        <p className="text-[13px] text-zinc-300">Kéo thả ảnh hoặc bấm để chọn</p>
        <p className="text-[11px] text-zinc-500 mt-1">
          Whiteboard · slide · trang sách · ảnh chụp · tối đa 5 ảnh
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium flex items-center justify-between">
            <span>{files.length}/5 ảnh · OCR + sửa lỗi nhận dạng tự động</span>
          </div>
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-ink-850 border border-ink-700/40"
            >
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500/20 to-violet-500/10 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-indigo-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-zinc-200 truncate">{f.name}</div>
                <div className="text-[10px] text-zinc-500">{f.size}</div>
              </div>
              {f.status === 'ocr' ? (
                <span className="flex items-center gap-1.5 text-[10px] text-indigo-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-soft" />
                  AI đang OCR…
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Sẵn sàng
                </span>
              )}
              <button
                onClick={() => remove(f.id)}
                className="p-1 rounded text-zinc-500 hover:text-rose-300 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-zinc-500 mt-3 leading-relaxed">
        Hỗ trợ tiếng Việt và ký hiệu toán. Ảnh gốc được lưu lại để bạn đối chiếu hoặc sửa tay nếu cần.
      </p>
    </div>
  )
}

/* ---------- Stage 2: PROCESSING ---------- */

const PIPELINE = [
  { label: 'Sinh tiêu đề', detail: 'LLM tóm tắt nội dung' },
  { label: 'Tách hạt tri thức (atom)', detail: 'Phân rã thành định nghĩa / mệnh đề / quan hệ / dữ kiện' },
  { label: 'Embedding ngữ nghĩa', detail: 'Vector hoá để so sánh với hạt cũ' },
  { label: 'Phát hiện trùng / mâu thuẫn', detail: 'So sánh với toàn bộ kho hạt' },
  { label: 'Sinh câu hỏi truy hồi', detail: 'Cloze · định nghĩa ngược · ứng dụng' },
]

function ProcessingView({ onDone }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Layers className="w-3.5 h-3.5 text-indigo-300" />
        </div>
        <div>
          <div className="text-[13px] font-medium text-zinc-100">
            Atomic Knowledge Engine đang chạy
          </div>
          <div className="text-[11px] text-zinc-500">
            5 bước nền · bạn có thể đóng cửa sổ, AI vẫn chạy tiếp
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {PIPELINE.map((step, i) => {
          const isActive = i === 2
          const isDone = i < 2
          return (
            <div
              key={i}
              className={`flex items-center gap-3 p-2.5 rounded-lg border transition ${
                isActive
                  ? 'bg-indigo-500/5 border-indigo-500/30'
                  : isDone
                  ? 'bg-ink-850/40 border-ink-700/40'
                  : 'bg-ink-900/30 border-ink-800/40'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-indigo-500/20'
                    : isDone
                    ? 'bg-emerald-500/15'
                    : 'bg-ink-800'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : isActive ? (
                  <div className="w-2.5 h-2.5 rounded-full border border-indigo-400 border-t-transparent animate-spin" />
                ) : (
                  <span className="text-[10px] text-zinc-600 tabular-nums">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[12.5px] font-medium ${
                    isActive ? 'text-indigo-200' : isDone ? 'text-zinc-300' : 'text-zinc-500'
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[10.5px] text-zinc-500">{step.detail}</div>
              </div>
              {isActive && (
                <span className="text-[10px] text-indigo-300">đang chạy</span>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={onDone}
        className="mt-4 w-full text-[11px] text-zinc-500 hover:text-zinc-300 underline text-center"
      >
        (demo) tua nhanh tới khi xong
      </button>
    </div>
  )
}

/* ---------- Stage 3: REVIEW ---------- */

function ReviewView() {
  const detected = decompositionDemo.detectedAtoms

  return (
    <div className="p-5 max-h-[55vh] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <div>
          <div className="text-[13px] font-medium text-zinc-100">
            Phân rã xong — {detected.length} hạt được tách
          </div>
          <div className="text-[11px] text-zinc-500">
            Bạn quyết định: giữ, sửa, gộp, tách, hoặc bỏ qua từng hạt
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {detected.map((a) => {
          const T = TYPE_STYLES[a.type] || TYPE_STYLES.definition
          return (
            <div
              key={a.id}
              className="p-3 rounded-lg bg-ink-850/60 border border-ink-700/40 hover:bg-ink-850 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`pill border ${T.color}`}>
                    <T.icon className="w-2.5 h-2.5" />
                    {T.label}
                  </span>
                  {a.status === 'new' && (
                    <span className="pill text-emerald-300 bg-emerald-500/10">Mới</span>
                  )}
                  {a.status === 'existing' && (
                    <span className="pill text-zinc-400 bg-zinc-500/10">Trùng hạt cũ</span>
                  )}
                  {a.status === 'linked' && (
                    <span className="pill text-sky-300 bg-sky-500/10">Liên kết</span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  AI tin {Math.round(a.confidence * 100)}%
                </span>
              </div>
              <p className="text-[13px] text-zinc-200 leading-relaxed font-serif mb-2">
                {a.content}
              </p>
              <div className="flex items-center gap-1 text-[10px]">
                <ActionBtn icon={CheckCircle2} label="Giữ" tone="emerald" />
                <ActionBtn icon={Edit2} label="Sửa" />
                <ActionBtn icon={Layers} label="Tách" />
                <ActionBtn icon={Trash2} label="Bỏ" tone="rose" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, tone }) {
  const tones = {
    emerald: 'hover:text-emerald-300 hover:bg-emerald-500/10',
    rose: 'hover:text-rose-300 hover:bg-rose-500/10',
  }
  return (
    <button
      className={`flex items-center gap-1 px-1.5 py-1 rounded text-zinc-500 ${
        tones[tone] || 'hover:text-zinc-200 hover:bg-ink-800'
      } transition`}
    >
      <Icon className="w-2.5 h-2.5" />
      {label}
    </button>
  )
}
