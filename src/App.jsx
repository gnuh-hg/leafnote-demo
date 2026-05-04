import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import NoteEditor from './pages/NoteEditor'
import KnowledgeGraph from './pages/KnowledgeGraph'
import ReviewFeed from './pages/ReviewFeed'
import Insights from './pages/Insights'
import NotesList from './pages/NotesList'

export default function App() {
  return (
    <div className="flex h-screen bg-ink-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/note/:id" element={<NoteEditor />} />
            <Route path="/graph" element={<KnowledgeGraph />} />
            <Route path="/review" element={<ReviewFeed />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
