export default function QuoteCard({ quote, onEdit, onDelete }) {
  return (
    <div className="glass p-5 flex flex-col justify-between">
      <div>
        <p className="text-lg leading-relaxed">“{quote.text}”</p>
        <p className="mt-2 text-sm opacity-70">— {quote.author}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(quote.tags || []).map((t, i) => (
            <span key={i} className="px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10">{t}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="btn" onClick={onEdit}>Edit</button>
        <button className="btn" onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}
