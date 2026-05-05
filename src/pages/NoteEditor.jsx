import { useState, useMemo, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
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
  Eye,
  Pencil,
  Cpu,
  User,
  Edit2,
  Trash2,
  Split,
  Wand2,
  RefreshCw,
  X,
  Tag as TagIcon,
  Mic,
  Image as ImageIcon,
  Square,
  Check,
} from 'lucide-react'
import { decompositionDemo, notes as allNotes } from '../data/mockData'
import { TYPE_STYLES } from '../components/AtomCard'
import { useAppState } from '../context/AppState'

export default function NoteEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [searchParams, setSearchParams] = useSearchParams()
  const initialInput = searchParams.get('input') // 'voice' | 'image' | null
  const isFresh = searchParams.get('fresh') === '1'

  const { tags } = useAppState()

  // Demo source: nếu /note/new → empty; ngược lại dùng decompositionDemo (mock)
  const note = decompositionDemo
  const sourceNote = isNew
    ? null
    : allNotes.find((n) => n.id === id) ||
      allNotes.find((n) => n.id === note.noteId)

  const plainBody = note.body
    .map((b) => b.segments.map((s) => s.text).join(''))
    .join('\n\n')

  const [activeAtom, setActiveAtom] = useState(null)
  const [mode, setMode] = useState(isNew ? 'edit' : 'read')
  const [dirty, setDirty] = useState(false)
  const [draft, setDraft] = useState(isNew ? '' : plainBody)
  const [title, setTitle] = useState(isNew ? '' : note.title)
  const [showFreshBanner, setShowFreshBanner] = useState(isFresh)
  const [selectedTagIds, setSelectedTagIds] = useState(
    sourceNote?.tagIds ? [...sourceNote.tagIds] : [],
  )
  const [tagPickerOpen, setTagPickerOpen] = useState(false)
  const [voiceState, setVoiceState] = useState(
    initialInput === 'voice' ? 'recording' : 'idle',
  ) // idle | recording | done
  const [imagePanelOpen, setImagePanelOpen] = useState(initialInput === 'image')

  // Clear ?input= sau khi đã apply
  useEffect(() => {
    if (initialInput) {
      const next = new URLSearchParams(searchParams)
      next.delete('input')
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tagById = (tid) => tags.find((t) => t.id === tid)
  const selectedTags = useMemo(
    () => selectedTagIds.map(tagById).filter(Boolean),
    [selectedTagIds, tags],
  )

  const toggleTag = (tid) => {
    setSelectedTagIds((prev) =>
      prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid],
    )
    setDirty(true)
  }

  const handleSave = () => {
    setDirty(false)
    if (isNew) {
      // Demo: chuyển sang note đã có content + bật banner fresh
      navigate(`/note/${note.noteId}?fresh=1`)
    }
  }

  return (
    <div className="px-8 py-8 max-w-[1500px] mx-auto">
      {showFreshBanner && (
        <div className="mb-5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent p-3.5 flex items-start gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-indigo-300 animate-pulse-soft" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-indigo-100 mb-0.5">
              AI vừa phân rã {note.detectedAtoms.length} hạt từ note này
            </div>
            <div className="text-[11.5px] text-zinc-400">
              Bạn duyệt phía dưới — giữ, sửa, gộp, tách hoặc bỏ từng hạt. Quyết định cuối là của bạn.
            </div>
          </div>
          <button
            onClick={() => {
              setShowFreshBanner(false)
              const next = new URLSearchParams(searchParams)
              next.delete('fresh')
              setSearchParams(next, { replace: true })
            }}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-ink-800 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0 flex-1">
          {/* Meta row */}
          <div className="flex items-center gap-2 text-xs mb-2 flex-wrap">
            {!isNew && (
              <>
                <span className="text-zinc-500">Đã lưu lúc 14:32</span>
                <span className="text-zinc-700">·</span>
                <span className="text-zinc-500 flex items-center gap-1">
                  <Atom className="w-3 h-3" />
                  {note.detectedAtoms.length} hạt được tách
                </span>
              </>
            )}
            {isNew && (
              <span className="text-emerald-300 flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Note mới · auto-save 2s/lần
              </span>
            )}
            {dirty && !isNew && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-amber-300 flex items-center gap-1 animate-pulse-soft">
                  <RefreshCw className="w-3 h-3" />
                  Có thay đổi chưa lưu
                </span>
              </>
            )}
          </div>

          {/* Title */}
          {mode === 'read' ? (
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-50">
              {title || <span className="text-zinc-600">Chưa có tiêu đề</span>}
            </h1>
          ) : (
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setDirty(true)
              }}
              autoFocus={isNew && !initialInput}
              placeholder={
                isNew ? 'Tiêu đề (để trống → AI sinh sau khi lưu)' : 'Tiêu đề'
              }
              className="font-serif text-4xl font-semibold tracking-tight text-zinc-50 bg-transparent w-full focus:outline-none border-b border-dashed border-ink-700/60 focus:border-indigo-500/40 pb-1 placeholder:text-zinc-700"
            />
          )}

          {/* Tag chips row */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap relative">
            {selectedTags.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11.5px] bg-ink-850 border border-ink-700/40 text-zinc-200"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                <span className="text-zinc-500">#</span>
                {t.name}
                <button
                  onClick={() => toggleTag(t.id)}
                  className="ml-0.5 text-zinc-600 hover:text-rose-300"
                  title="Bỏ tag"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <button
              onClick={() => setTagPickerOpen((v) => !v)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11.5px] border border-dashed border-ink-700/60 text-zinc-500 hover:text-indigo-300 hover:border-indigo-500/40 transition"
            >
              <TagIcon className="w-2.5 h-2.5" />
              {selectedTags.length === 0 ? 'Thêm tag' : 'Sửa tag'}
            </button>

            {tagPickerOpen && (
              <div className="absolute left-0 top-full mt-1 z-30 card-surface bg-ink-900 shadow-2xl py-1 w-72 max-h-72 overflow-y-auto animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-zinc-500 font-medium border-b border-ink-700/60 flex items-center justify-between">
                  <span>Chọn tag (multi-select)</span>
                  <button
                    onClick={() => setTagPickerOpen(false)}
                    className="text-zinc-500 hover:text-zinc-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {tags.map((t) => {
                  const isSelected = selectedTagIds.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTag(t.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-[12.5px] transition ${
                        isSelected
                          ? 'bg-indigo-500/10 text-indigo-100'
                          : 'text-zinc-300 hover:bg-ink-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${t.dot} shrink-0`} />
                        <span className="truncate">
                          <span className="text-zinc-600">#</span>
                          {t.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-indigo-300" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Read / Edit toggle — chỉ hiện khi không phải note mới */}
          {!isNew && (
            <div className="flex p-0.5 rounded-lg bg-ink-850 border border-ink-700/60">
              <button
                onClick={() => setMode('read')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition ${
                  mode === 'read'
                    ? 'bg-ink-800 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Eye className="w-3 h-3" />
                Đọc
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition ${
                  mode === 'edit'
                    ? 'bg-ink-800 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Pencil className="w-3 h-3" />
                Sửa
              </button>
            </div>
          )}
          {!isNew && (
            <button className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-ink-850 transition">
              Xem graph
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg text-xs bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
          >
            <RefreshCw className="w-3 h-3" />
            {isNew ? 'Lưu & phân rã' : 'Lưu & phân rã lại'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Note body */}
        <div className="col-span-12 lg:col-span-7 card-surface p-8 bg-ink-900/40">
          {mode === 'edit' && (
            <InputToolbar
              onVoice={() => setVoiceState('recording')}
              onImage={() => setImagePanelOpen(true)}
            />
          )}

          {/* Voice quick-record panel */}
          {mode === 'edit' && voiceState !== 'idle' && (
            <VoicePanel
              state={voiceState}
              setState={setVoiceState}
              onTranscript={(text) => {
                setDraft((prev) => (prev ? prev + '\n\n' + text : text))
                setDirty(true)
                setVoiceState('idle')
              }}
            />
          )}

          {/* Image quick-upload panel */}
          {mode === 'edit' && imagePanelOpen && (
            <ImagePanel onClose={() => setImagePanelOpen(false)} />
          )}

          {mode === 'read' ? (
            <ReadBody note={note} activeAtom={activeAtom} setActiveAtom={setActiveAtom} />
          ) : (
            <EditBody
              draft={draft}
              setDraft={(v) => {
                setDraft(v)
                setDirty(true)
              }}
              isNew={isNew}
            />
          )}

          {/* Legend — chỉ hiện cho note đã có hạt */}
          {!isNew && (
            <div className="mt-8 pt-5 border-t border-ink-700/40 flex items-center gap-4 text-[10px] text-zinc-500 flex-wrap">
              <span className="uppercase tracking-wider font-medium">
                {mode === 'read' ? 'Highlight' : 'Bạn sửa, AI sẽ tách lại'}
              </span>
              <Legend color="rgba(129, 140, 248, 0.4)" label="Định nghĩa" />
              <Legend color="rgba(251, 191, 36, 0.4)" label="Mệnh đề" />
              <Legend color="rgba(52, 211, 153, 0.4)" label="Quan hệ" />
              <Legend color="rgba(56, 189, 248, 0.4)" label="Dữ kiện" />
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          {/* Engine status */}
          <div className="card-surface p-4 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-zinc-100 flex items-center gap-2">
                  Atomic Knowledge Engine
                  {isNew ? (
                    <span className="text-[10px] text-zinc-500 font-normal">
                      · chờ note có nội dung
                    </span>
                  ) : dirty ? (
                    <span className="text-[10px] text-amber-300 font-normal">
                      · sẽ chạy lại khi lưu
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-normal">
                      · đồng bộ
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {isNew
                    ? 'Sau khi bạn lưu, AI sẽ phân rã, sinh tiêu đề, gắn embedding'
                    : 'Phân rã xong · 2 hạt mới · 2 hạt khớp · 1 hạt liên kết'}
                </div>
              </div>
            </div>
          </div>

          {/* Detected atoms — chỉ cho note đã có nội dung */}
          {!isNew && (
            <div className="card-surface p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Atom className="w-3.5 h-3.5 text-indigo-400" />
                  <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                    Hạt được tách ({note.detectedAtoms.length})
                  </h3>
                  <AiTag>AI tách · bạn duyệt</AiTag>
                </div>
                <button className="text-[11px] text-zinc-500 hover:text-zinc-300">
                  Tất cả ↓
                </button>
              </div>
              <div className="space-y-2">
                {note.detectedAtoms.map((atom) => (
                  <AtomRow
                    key={atom.id}
                    atom={atom}
                    isActive={activeAtom === atom.id}
                    onHover={setActiveAtom}
                  />
                ))}
              </div>
              <button className="w-full mt-3 py-2 rounded-lg border border-dashed border-ink-700 text-[12px] text-zinc-500 hover:text-zinc-300 hover:border-ink-600 transition flex items-center justify-center gap-1.5">
                <Plus className="w-3 h-3" />
                Thêm hạt thủ công
                <ManualTag />
              </button>
            </div>
          )}

          {/* Empty state cho note mới */}
          {isNew && (
            <div className="card-surface p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-ink-850 flex items-center justify-center mx-auto mb-2">
                <Atom className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="text-[13px] text-zinc-300 mb-1">
                Chưa có hạt nào
              </div>
              <div className="text-[11px] text-zinc-500 leading-relaxed">
                Cứ gõ tự nhiên — sau khi bạn bấm <b className="text-zinc-300">Lưu & phân rã</b>,
                <br />AI sẽ tách hạt và hiện tại đây để bạn duyệt.
              </div>
            </div>
          )}

          {/* Insights — chỉ cho note đã có */}
          {!isNew && (
            <div className="card-surface p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                  AI phát hiện
                </h3>
                <AiTag />
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
          )}
        </div>
      </div>
    </div>
  )
}

/* --------- Input toolbar (edit mode) --------- */

function InputToolbar({ onVoice, onImage }) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink-700/40">
      <div className="flex items-center gap-1">
        <ToolbarBtn icon={Mic} label="Ghi âm" onClick={onVoice} />
        <ToolbarBtn icon={ImageIcon} label="Ảnh / OCR" onClick={onImage} />
        <ToolbarBtn icon={Wand2} label="AI sinh tiêu đề" />
      </div>
      <div className="text-[10.5px] text-zinc-500 flex items-center gap-1.5">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        Auto-save 2s · offline → đồng bộ khi online
      </div>
    </div>
  )
}

function ToolbarBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11.5px] text-zinc-400 hover:text-indigo-300 hover:bg-ink-850 transition"
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  )
}

/* --------- Voice quick panel --------- */

function VoicePanel({ state, setState, onTranscript }) {
  return (
    <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
      <div className="flex items-center gap-3">
        {state === 'recording' ? (
          <button
            onClick={() => setState('done')}
            className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse-soft hover:scale-105 transition shrink-0"
          >
            <Square className="w-4 h-4 text-white fill-white" />
          </button>
        ) : (
          <div className="w-12 h-12 rounded-full bg-ink-800 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {state === 'recording' && (
            <>
              <div className="flex items-center gap-1 h-5 mb-1">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-rose-400 rounded-full animate-pulse-soft"
                    style={{
                      height: `${8 + Math.sin(i * 0.7) * 7 + Math.random() * 5}px`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
              <div className="text-[12px] text-rose-300 font-medium tabular-nums">
                00:42 · đang thu — chạm để dừng
              </div>
            </>
          )}
          {state === 'done' && (
            <>
              <div className="text-[12.5px] text-zinc-200 font-medium mb-0.5">
                Đã thu xong · transcript sẵn sàng
              </div>
              <div className="text-[10.5px] text-zinc-500">
                Bấm "Chèn vào note" để dán transcript vào vị trí con trỏ
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {state === 'done' && (
            <button
              onClick={() =>
                onTranscript(
                  '[Voice transcript] — Trong tác phẩm The Structure of Scientific Revolutions, Kuhn lập luận rằng khoa học không tiến hoá tuyến tính...',
                )
              }
              className="px-2.5 py-1 rounded-md text-[11px] bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition"
            >
              Chèn vào note
            </button>
          )}
          <button
            onClick={() => setState('idle')}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-ink-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* --------- Image quick panel --------- */

function ImagePanel({ onClose }) {
  return (
    <div className="mb-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[12px] font-medium text-zinc-200 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-300" />
          Chèn ảnh — OCR sẽ chạy ngầm sau khi lưu
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-ink-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="rounded-lg border-2 border-dashed border-ink-700 hover:border-indigo-500/40 transition p-4 text-center cursor-pointer bg-ink-850/40">
        <Plus className="w-4 h-4 text-zinc-400 mx-auto mb-1.5" />
        <p className="text-[12px] text-zinc-300">Kéo thả ảnh hoặc bấm để chọn</p>
        <p className="text-[10.5px] text-zinc-500 mt-0.5">Whiteboard · slide · trang sách</p>
      </div>
    </div>
  )
}

/* --------- Body modes --------- */

function ReadBody({ note, activeAtom, setActiveAtom }) {
  return (
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
  )
}

function EditBody({ draft, setDraft, isNew }) {
  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoFocus={!isNew}
        rows={isNew ? 14 : 18}
        placeholder={
          isNew
            ? 'Bắt đầu gõ ở đây — không cần đặt tiêu đề trước, không cần chọn thư mục...'
            : ''
        }
        className="w-full bg-transparent text-[16px] leading-[1.85] font-serif text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-none"
      />
      {!isNew && (
        <div className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 flex items-start gap-2.5">
          <Wand2 className="w-3.5 h-3.5 text-indigo-300 mt-0.5 shrink-0" />
          <div className="text-[11.5px] text-zinc-300 leading-relaxed">
            <span className="text-indigo-200 font-medium">Sau khi lưu</span>, AI sẽ phân rã lại: hạt cũ giữ nguyên ID nếu nội dung không đổi, hạt mới được tạo, hạt biến mất sẽ chuyển sang trạng thái{' '}
            <span className="text-zinc-100">"đề xuất xoá"</span> để bạn xác nhận.
          </div>
        </div>
      )}
    </div>
  )
}

/* --------- Atom row with manual actions --------- */

function AtomRow({ atom, isActive, onHover }) {
  const T = TYPE_STYLES[atom.type] || TYPE_STYLES.definition
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(atom.content)

  return (
    <div
      onMouseEnter={() => onHover(atom.id)}
      onMouseLeave={() => onHover(null)}
      className={`group rounded-lg border transition ${
        isActive
          ? 'bg-ink-800 border-indigo-500/40'
          : 'bg-ink-850/50 border-ink-700/40 hover:bg-ink-800'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className={`pill border ${T.color}`}>
              <T.icon className="w-2.5 h-2.5" />
              {T.label}
            </span>
            <StatusBadge status={atom.status} />
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            AI tin {Math.round(atom.confidence * 100)}%
          </span>
        </div>

        {editing ? (
          <textarea
            value={content}
            autoFocus
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full bg-ink-900 border border-indigo-500/40 rounded p-2 text-[13px] text-zinc-100 font-serif leading-relaxed focus:outline-none resize-none"
          />
        ) : (
          <p className="text-[13px] text-zinc-200 leading-relaxed font-serif">
            {content}
          </p>
        )}

        <div className="mt-2 pt-2 border-t border-ink-700/30 flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition">
          {editing ? (
            <>
              <RowAction
                icon={CheckCircle2}
                label="Lưu"
                tone="emerald"
                onClick={() => setEditing(false)}
              />
              <RowAction
                icon={Trash2}
                label="Huỷ"
                onClick={() => {
                  setContent(atom.content)
                  setEditing(false)
                }}
              />
            </>
          ) : (
            <>
              <RowAction
                icon={Edit2}
                label="Sửa"
                onClick={() => setEditing(true)}
              />
              <RowAction icon={Split} label="Tách" />
              <RowAction icon={GitMerge} label="Gộp" />
              <RowAction icon={Trash2} label="Bỏ" tone="rose" />
              <div className="flex-1" />
              <ManualTag />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function RowAction({ icon: Icon, label, tone, onClick }) {
  const tones = {
    emerald: 'text-emerald-400 hover:bg-emerald-500/10',
    rose: 'text-zinc-500 hover:text-rose-300 hover:bg-rose-500/10',
  }
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10.5px] transition ${
        tones[tone] || 'text-zinc-500 hover:text-zinc-200 hover:bg-ink-800'
      }`}
    >
      <Icon className="w-2.5 h-2.5" />
      {label}
    </button>
  )
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-2 rounded-sm" style={{ background: color }} />
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

function AiTag({ children = 'AI' }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
      <Cpu className="w-2.5 h-2.5" />
      {children}
    </span>
  )
}
function ManualTag({ children = 'Bạn' }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
      <User className="w-2.5 h-2.5" />
      {children}
    </span>
  )
}
