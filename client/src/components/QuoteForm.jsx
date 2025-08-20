import { useEffect, useState } from 'react'

export default function QuoteForm({ initial, onSubmit, onCancel, isEditing }) {
  const [form, setForm] = useState(initial)

  useEffect(() => setForm(initial), [initial])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(s => ({ ...s, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form).then(() => setForm({ text: '', author: '', tags: '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3">
      <textarea
        className="input min-h-[100px]"
        placeholder="Quote text"
        name="text"
        value={form.text}
        onChange={handleChange}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="input" placeholder="Author (optional)" name="author" value={form.author} onChange={handleChange} />
        <input className="input" placeholder="Comma-separated tags (e.g., wisdom, life)" name="tags" value={form.tags} onChange={handleChange} />
      </div>
      <div className="flex gap-2">
        <button className="btn" type="submit">{isEditing ? 'Update' : 'Create'}</button>
        {isEditing && <button className="btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
