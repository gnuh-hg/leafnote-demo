import { useNavigate } from 'react-router-dom'
import { FileText, Atom, Clock, Search } from 'lucide-react'
import { notes, projects } from '../data/mockData'

export default function NotesList() {
  const navigate = useNavigate()
  return (
    <div className="px-8 py-8 max-w-[1300px] mx-auto">
      <div className="mb-8">
        <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5">
          <FileText className="w-3 h-3" />
          {notes.length} ghi chú · 5 project
        </div>
        <h1 className="font-serif text-[44px] leading-tight font-semibold tracking-tight text-zinc-50">
          Ghi chú của bạn
        </h1>
        <p className="text-zinc-400 mt-2">
          Mỗi ghi chú đã được Atomic Engine phân rã. Click để xem hạt được tách.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {notes.map((note) => {
          const proj = projects.find((p) => p.id === note.projectId)
          return (
            <button
              key={note.id}
              onClick={() => navigate(`/note/${note.id}`)}
              className="card-surface text-left p-5 hover:border-indigo-500/40 transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 text-[11px] mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${proj.dot}`} />
                <span className="text-zinc-500">{proj.name}</span>
                <span className="text-zinc-700">·</span>
                <span className="text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {note.updatedAt}
                </span>
              </div>
              <h3 className="font-serif text-xl text-zinc-100 font-semibold leading-snug mb-2">
                {note.title}
              </h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                {note.excerpt}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-ink-700/40 text-[11px]">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Atom className="w-3 h-3" />
                  {note.atomCount} hạt
                </span>
                <span className="text-indigo-400 group-hover:text-indigo-300">
                  Mở →
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
