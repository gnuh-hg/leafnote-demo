import { useState, useMemo } from 'react'
import { Network, Layers, Eye, Filter, Flame, Snowflake } from 'lucide-react'
import { graphNodes, graphEdges, projects, atoms } from '../data/mockData'
import { TYPE_STYLES } from '../components/AtomCard'

const PROJECT_COLOR = {
  p1: '#fbbf24', // amber
  p2: '#818cf8', // indigo
  p3: '#38bdf8', // sky
  p4: '#34d399', // emerald
  p5: '#fb7185', // rose
}

export default function KnowledgeGraph() {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [colorMode, setColorMode] = useState('cluster') // cluster | retention

  const selectedAtom = selected ? atoms.find((a) => a.id === selected) : null

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 max-w-[1500px] mx-auto w-full">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
              <Network className="w-3 h-3" />
              <span>20 hạt · 23 liên kết · 5 cụm</span>
            </div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-50">
              Bản đồ tri thức
            </h1>
            <p className="text-zinc-400 mt-1.5 text-sm">
              Cập nhật theo hành vi · cụm nóng nổi rõ, hạt ngủ đông mờ dần
            </p>
          </div>

          {/* Toggle color mode */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-lg bg-ink-850 border border-ink-700/60">
              <button
                onClick={() => setColorMode('cluster')}
                className={`px-3 py-1.5 rounded text-[11px] font-medium transition ${
                  colorMode === 'cluster'
                    ? 'bg-ink-800 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Theo cụm
              </button>
              <button
                onClick={() => setColorMode('retention')}
                className={`px-3 py-1.5 rounded text-[11px] font-medium transition ${
                  colorMode === 'retention'
                    ? 'bg-ink-800 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Theo retention
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 max-w-[1500px] mx-auto w-full grid grid-cols-12 gap-4 min-h-0">
        {/* Graph canvas */}
        <div className="col-span-12 lg:col-span-9 relative card-surface bg-ink-900/40 overflow-hidden">
          <svg
            viewBox="0 0 1400 700"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Subtle grid */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="0.5" cy="0.5" r="0.5" fill="#2e2e3d" />
              </pattern>
              <radialGradient id="haloIndigo">
                <stop offset="0%" stopColor="rgb(129 140 248)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgb(129 140 248)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.4" />

            {/* Cluster halos */}
            {projects.map((p) => {
              const nodes = graphNodes.filter((n) => n.cluster === p.id)
              if (nodes.length < 2) return null
              const cx = nodes.reduce((s, n) => s + n.x, 0) / nodes.length
              const cy = nodes.reduce((s, n) => s + n.y, 0) / nodes.length
              const maxDist = Math.max(
                ...nodes.map((n) => Math.hypot(n.x - cx, n.y - cy)),
              )
              return (
                <circle
                  key={p.id}
                  cx={cx}
                  cy={cy}
                  r={maxDist + 60}
                  fill={PROJECT_COLOR[p.id]}
                  opacity={0.04 + p.heat * 0.05}
                />
              )
            })}

            {/* Edges */}
            {graphEdges.map((e, i) => {
              const a = graphNodes.find((n) => n.id === e.from)
              const b = graphNodes.find((n) => n.id === e.to)
              if (!a || !b) return null
              const isActive =
                hovered === e.from ||
                hovered === e.to ||
                selected === e.from ||
                selected === e.to
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={
                    e.crossCluster
                      ? 'rgb(244 114 182)'
                      : isActive
                      ? 'rgb(129 140 248)'
                      : '#3d3d4f'
                  }
                  strokeWidth={isActive ? 1.5 : 0.8}
                  strokeDasharray={e.crossCluster ? '4 4' : '0'}
                  opacity={isActive ? 0.9 : 0.3 + e.strength * 0.4}
                />
              )
            })}

            {/* Nodes */}
            {graphNodes.map((n) => {
              const isActive = hovered === n.id || selected === n.id
              const isFaded =
                (hovered || selected) &&
                !isActive &&
                !graphEdges.some(
                  (e) =>
                    (e.from === (hovered || selected) && e.to === n.id) ||
                    (e.to === (hovered || selected) && e.from === n.id),
                )
              const fill =
                colorMode === 'cluster'
                  ? PROJECT_COLOR[n.cluster]
                  : retentionColor(n.retention)
              return (
                <g
                  key={n.id}
                  className="cursor-pointer"
                  opacity={isFaded ? 0.25 : 1}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(n.id === selected ? null : n.id)}
                >
                  {isActive && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.r + 12}
                      fill="url(#haloIndigo)"
                    />
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r}
                    fill={fill}
                    fillOpacity={0.18 + n.retention * 0.5}
                    stroke={fill}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <text
                    x={n.x}
                    y={n.y + n.r + 14}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isActive ? '#e8e8f0' : '#a0a0b0'}
                    className="font-medium"
                    style={{ pointerEvents: 'none' }}
                  >
                    {n.content}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Floating legend */}
          <div className="absolute bottom-4 left-4 glass-panel rounded-xl p-3 space-y-2 text-[10px]">
            {colorMode === 'cluster' ? (
              <>
                <div className="text-zinc-500 uppercase tracking-wider font-medium mb-1">
                  Cụm
                </div>
                {projects.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: PROJECT_COLOR[p.id] }}
                    />
                    <span className="text-zinc-300">{p.name}</span>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="text-zinc-500 uppercase tracking-wider font-medium mb-1">
                  Retention
                </div>
                {[
                  { l: '> 80%', c: '#34d399' },
                  { l: '60—80%', c: '#818cf8' },
                  { l: '40—60%', c: '#fbbf24' },
                  { l: '< 40%', c: '#fb7185' },
                ].map((b) => (
                  <div key={b.l} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: b.c }}
                    />
                    <span className="text-zinc-300">{b.l}</span>
                  </div>
                ))}
              </>
            )}
            <div className="border-t border-ink-700/60 pt-1.5 mt-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-px"
                  style={{ background: 'rgb(244 114 182)' }}
                />
                <span className="text-zinc-400">Liên kết liên cụm</span>
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="absolute top-4 right-4 glass-panel rounded-xl px-3 py-2 text-[10px] text-zinc-400">
            Hover để xem liên kết · click để pin chi tiết
          </div>
        </div>

        {/* Side panel: selected node details */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {selectedAtom ? (
            <NodeDetail atom={selectedAtom} onClear={() => setSelected(null)} />
          ) : (
            <EmptyDetail />
          )}

          <div className="card-surface p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                Cụm đang nóng
              </h3>
            </div>
            <div className="space-y-2">
              {projects
                .slice()
                .sort((a, b) => b.heat - a.heat)
                .slice(0, 3)
                .map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: PROJECT_COLOR[p.id] }}
                    />
                    <span className="text-[12px] text-zinc-300 flex-1 truncate">
                      {p.name}
                    </span>
                    <div className="w-12 h-1 bg-ink-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-rose-400"
                        style={{ width: `${p.heat * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card-surface p-4">
            <div className="flex items-center gap-2 mb-3">
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
              <h3 className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                Cụm ngủ đông
              </h3>
            </div>
            <div className="space-y-2">
              {projects
                .slice()
                .sort((a, b) => a.heat - b.heat)
                .slice(0, 2)
                .map((p) => (
                  <div key={p.id} className="text-[12px]">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full opacity-50"
                        style={{ background: PROJECT_COLOR[p.id] }}
                      />
                      <span className="text-zinc-400 flex-1 truncate">
                        {p.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-600 ml-3.5">
                      {Math.round((1 - p.heat) * 100)}% atom mờ dần
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function retentionColor(r) {
  if (r >= 0.8) return '#34d399'
  if (r >= 0.6) return '#818cf8'
  if (r >= 0.4) return '#fbbf24'
  return '#fb7185'
}

function NodeDetail({ atom, onClear }) {
  const T = TYPE_STYLES[atom.type] || TYPE_STYLES.definition
  return (
    <div className="card-surface p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className={`pill border ${T.color}`}>
          <T.icon className="w-3 h-3" />
          {T.label}
        </span>
        <button
          onClick={onClear}
          className="text-[11px] text-zinc-500 hover:text-zinc-300"
        >
          Bỏ chọn
        </button>
      </div>
      <p className="text-[14px] text-zinc-100 font-serif leading-relaxed mb-4">
        {atom.content}
      </p>
      <div className="space-y-2 text-[11px]">
        <Row label="Retention" value={`${Math.round(atom.retention * 100)}%`} />
        <Row label="Liên quan" value={`${Math.round(atom.relevance * 100)}%`} />
        <Row label="Liên kết" value={`${atom.linkedAtoms?.length || 0} hạt`} />
        <Row label="Đã ôn" value={`${atom.reviewCount} lần`} />
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-200 font-medium">{value}</span>
    </div>
  )
}

function EmptyDetail() {
  return (
    <div className="card-surface p-6 text-center">
      <div className="w-10 h-10 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-3">
        <Eye className="w-4 h-4 text-zinc-500" />
      </div>
      <p className="text-[12px] text-zinc-400 leading-relaxed">
        Chọn một hạt trên bản đồ để xem chi tiết
      </p>
    </div>
  )
}
