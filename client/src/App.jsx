import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Header from './components/Header.jsx'
import QuoteCard from './components/QuoteCard.jsx'
import QuoteForm from './components/QuoteForm.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function App() {
  const [random, setRandom] = useState(null)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')
  const [limit] = useState(8)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)

  const pages = useMemo(() => Math.ceil(total / limit), [total, limit])

  const fetchRandom = async () => {
    const { data } = await axios.get(`${API}/api/quotes/random`)
    setRandom(data)
  }

  const fetchList = async (pageNo = 1) => {
    setLoading(true)
    try {
      const params = { page: pageNo, limit, search, tag }
      const { data } = await axios.get(`${API}/api/quotes`, { params })
      setList(data.items)
      setTotal(data.total)
      setPage(data.page)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRandom()
    fetchList(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCreate = async (payload) => {
    await axios.post(`${API}/api/quotes`, payload)
    await fetchList(page)
  }

  const onUpdate = async (id, payload) => {
    await axios.put(`${API}/api/quotes/${id}`, payload)
    setEditing(null)
    await fetchList(page)
  }

  const onDelete = async (id) => {
    await axios.delete(`${API}/api/quotes/${id}`)
    await fetchList(page)
  }

  const onSearch = async (e) => {
    e.preventDefault()
    await fetchList(1)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pb-24">
        {/* Random Quote */}
        <section className="mt-8">
          <div className="glass p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold opacity-80">Random Inspiration</h2>
              <button className="btn" onClick={fetchRandom}>New Random</button>
            </div>
            {random && (
              <blockquote className="mt-4 text-2xl md:text-3xl leading-relaxed">
                “{random.text}”
                <footer className="mt-2 text-sm opacity-70">— {random.author}</footer>
              </blockquote>
            )}
          </div>
        </section>

        {/* Create / Edit */}
        <section className="mt-8">
          <div className="glass p-8">
            <h2 className="text-xl font-semibold opacity-80">{editing ? 'Edit Quote' : 'Add a Quote'}</h2>
            <QuoteForm
              initial={editing || { text: '', author: '', tags: '' }}
              onCancel={() => setEditing(null)}
              onSubmit={(payload) => {
                const tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean)
                const body = { text: payload.text, author: payload.author || 'Unknown', tags }
                return editing ? onUpdate(editing._id, body) : onCreate(body)
              }}
              isEditing={!!editing}
            />
          </div>
        </section>

        {/* Search / Filter */}
        <section className="mt-8">
          <form className="glass p-4 grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={onSearch}>
            <input className="input md:col-span-2" placeholder="Search quotes or authors" value={search} onChange={e => setSearch(e.target.value)} />
            <input className="input" placeholder="Filter by tag (e.g. wisdom)" value={tag} onChange={e => setTag(e.target.value)} />
            <button className="btn" type="submit">Apply</button>
          </form>
        </section>

        {/* List */}
        <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full text-center opacity-70">Loading…</div>
          ) : list.length === 0 ? (
            <div className="col-span-full glass p-6 text-center opacity-70">No quotes found.</div>
          ) : (
            list.map(q => (
              <QuoteCard
                key={q._id}
                quote={q}
                onEdit={() => setEditing(q)}
                onDelete={() => onDelete(q._id)}
              />
            ))
          )}
        </section>

        {/* Pagination */}
        <section className="mt-8 flex items-center justify-center gap-2">
          <button className="btn" onClick={() => fetchList(Math.max(1, page - 1))} disabled={page <= 1}>Prev</button>
          <span className="px-4 py-2 opacity-70">Page {page} / {Math.max(1, pages)}</span>
          <button className="btn" onClick={() => fetchList(Math.min(pages, page + 1))} disabled={page >= pages}>Next</button>
        </section>
      </main>
    </div>
  )
}
