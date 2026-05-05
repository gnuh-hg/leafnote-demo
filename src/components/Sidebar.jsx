import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  FileText,
  Network,
  Brain,
  BarChart3,
  Leaf,
  Plus,
  Tag as TagIcon,
} from 'lucide-react'
import TagCreateModal from './TagCreateModal'
import { useAppState } from '../context/AppState'

const navItems = [
  { to: '/', label: 'Đang nổi lên', icon: Sparkles, badge: '12' },
  { to: '/notes', label: 'Ghi chú', icon: FileText },
  { to: '/graph', label: 'Bản đồ tri thức', icon: Network },
  { to: '/review', label: 'Ôn tập', icon: Brain, badge: '7' },
  { to: '/insights', label: 'Hồ sơ nhận thức', icon: BarChart3 },
]

export default function Sidebar() {
  const { tags } = useAppState()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <aside className="w-64 shrink-0 bg-paper-100/80 dark:bg-ink-900/70 backdrop-blur-xl border-r border-paper-300/60 dark:border-ink-700/60 flex flex-col transition-colors duration-200">
      {/* Wordmark */}
      <div className="px-5 pt-5 pb-4 border-b border-paper-300/40 dark:border-ink-700/40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          </div>
          <div>
            <div className="font-serif text-2xl font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-100">
              Leafnote
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mt-1.5">
              ghi chú có vòng đời
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 ring-1 ring-emerald-500/20'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-paper-200 dark:hover:bg-ink-850'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <item.icon className="w-4 h-4" strokeWidth={2} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-paper-200 dark:bg-ink-800 text-zinc-500 dark:text-zinc-400">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Tags */}
        <div className="pt-4 pb-1">
          <div className="flex items-center justify-between px-3 mb-1.5">
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
              <TagIcon className="w-2.5 h-2.5" />
              Tag
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-300 flex items-center gap-0.5 transition"
              title="Tạo tag mới"
            >
              <Plus className="w-2.5 h-2.5" />
              Mới
            </button>
          </div>
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/notes?tag=${t.id}`)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-paper-200 dark:hover:bg-ink-850 transition group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full ${t.dot} shrink-0`} />
                <span className="truncate">
                  <span className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500">#</span>
                  {t.name}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-600 shrink-0 ml-2">
                {t.noteCount}
              </span>
            </button>
          ))}
          <button
            onClick={() => setShowCreate(true)}
            className="w-full mt-1 flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] text-zinc-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-paper-200 dark:hover:bg-ink-850 border border-dashed border-paper-300/60 dark:border-ink-700/60 hover:border-emerald-500/40 transition"
          >
            <Plus className="w-3 h-3" />
            <span>Tạo tag mới</span>
          </button>
        </div>
      </nav>

      {showCreate && <TagCreateModal onClose={() => setShowCreate(false)} />}

      {/* Cognitive snapshot */}
      <div className="p-4 border-t border-paper-300/40 dark:border-ink-700/40 bg-paper-100/40 dark:bg-ink-900/40">
        <div className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 font-medium">
          Hồ sơ nhận thức
        </div>
        <div className="space-y-1.5 text-[11px]">
          <Stat label="Cường độ ôn" value="trung bình" />
          <Stat label="Kiểu học" value="active recall" accent />
          <Stat label="Streak" value="47 ngày" />
        </div>
      </div>
    </aside>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-zinc-400 dark:text-zinc-500">{label}</span>
      <span
        className={`font-medium ${
          accent ? 'text-emerald-600 dark:text-emerald-300' : 'text-zinc-700 dark:text-zinc-200'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
