import { createContext, useContext, useState, useCallback } from 'react'
import { tags as seedTags } from '../data/mockData'

const AppStateContext = createContext(null)

const COLOR_DOT = {
  amber: 'bg-amber-400',
  indigo: 'bg-indigo-400',
  sky: 'bg-sky-400',
  emerald: 'bg-emerald-400',
  rose: 'bg-rose-400',
  violet: 'bg-violet-400',
  orange: 'bg-orange-400',
  teal: 'bg-teal-400',
}

export function AppStateProvider({ children }) {
  const [tags, setTags] = useState(() => seedTags.map((t) => ({ ...t })))

  const addTag = useCallback(({ name, color }) => {
    const id = 't' + Date.now().toString(36)
    const dot = COLOR_DOT[color] || 'bg-indigo-400'
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-')
    setTags((prev) => [...prev, { id, name: slug, dot, noteCount: 0 }])
    return id
  }, [])

  return (
    <AppStateContext.Provider value={{ tags, addTag }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider')
  return ctx
}
