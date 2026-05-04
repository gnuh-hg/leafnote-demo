import { NavLink } from 'react-router-dom'
import {
  Sparkles,
  FileText,
  Network,
  Brain,
  BarChart3,
  Atom,
  ChevronDown,
} from 'lucide-react'
import { projects } from '../data/mockData'

const navItems = [
  { to: '/', label: 'Đang nổi lên', icon: Sparkles, badge: '12' },
  { to: '/notes', label: 'Ghi chú', icon: FileText },
  { to: '/graph', label: 'Bản đồ tri thức', icon: Network },
  { to: '/review', label: 'Ôn tập', icon: Brain, badge: '7' },
  { to: '/insights', label: 'Hồ sơ nhận thức', icon: BarChart3 },
]

export default function Sidebar() {
  const active = projects.find((p) => p.active)
  return (
    <aside className="w-64 shrink-0 bg-ink-900/70 backdrop-blur-xl border-r border-ink-700/60 flex flex-col">
      {/* Wordmark */}
      <div className="px-5 pt-5 pb-4 border-b border-ink-700/40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Atom className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          </div>
          <div>
            <div className="font-serif text-2xl font-semibold leading-none tracking-tight">
              Mnema
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mt-1.5">
              tri thức nguyên tử
            </div>
          </div>
        </div>
      </div>

      {/* Active project */}
      <div className="px-4 py-4 border-b border-ink-700/40">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-medium">
          Project đang mở
        </div>
        <button className="w-full flex items-center justify-between p-2.5 rounded-lg bg-ink-850 hover:bg-ink-800 border border-ink-700/40 transition group">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${active.dot} animate-pulse-soft`}
            />
            <span className="text-sm font-medium text-zinc-100">
              {active.name}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
        </button>
        <div className="mt-2 px-1 flex items-center gap-3 text-[11px] text-zinc-500">
          <span>
            <span className="text-zinc-300 font-medium">{active.atomCount}</span> hạt
          </span>
          <span>·</span>
          <span>
            <span className="text-zinc-300 font-medium">{active.noteCount}</span> ghi chú
          </span>
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
                  ? 'bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-ink-850'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <item.icon className="w-4 h-4" strokeWidth={2} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-ink-800 text-zinc-400">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-4 pb-1">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 px-3 mb-1.5 font-medium">
            Tất cả project
          </div>
          {projects.map((p) => (
            <button
              key={p.id}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] transition ${
                p.active
                  ? 'text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-ink-850'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full ${p.dot} shrink-0`} />
                <span className="truncate">{p.name}</span>
              </div>
              <span className="text-[10px] text-zinc-600 shrink-0 ml-2">
                {p.atomCount}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Cognitive snapshot */}
      <div className="p-4 border-t border-ink-700/40 bg-ink-900/40">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-medium">
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
      <span className="text-zinc-500">{label}</span>
      <span
        className={`font-medium ${
          accent ? 'text-indigo-300' : 'text-zinc-200'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
