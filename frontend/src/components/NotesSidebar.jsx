import _React from 'react'

export default function NotesSidebar({ open, notes, setNotes, currentAlgorithm }) {
  if (!open) return null
  return (
    <div className="w-150 z-20 flex flex-col bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 pb-2 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#023047] text-white">🗒️</span>
          <h2 className="text-sm font-semibold text-[#023047] tracking-wide">MY NOTES</h2>
        </div>
      </div>
      <div className="flex-1 px-4 pb-2">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write notes..."
          className="w-full h-full resize-none bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base leading-7 p-3"
        />
      </div>
      <div className="px-4 pt-6 border-t border-gray-200 pb-5 bg-white/70">
        <button
          onClick={() => {
            const win = window.open('', '_blank')
            if (!win) return
            const safe = (notes || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
            win.document.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${currentAlgorithm}-notes</title><style>
              body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, Noto Sans, "Apple Color Emoji","Segoe UI Emoji"; margin:32px; color:#111827;}
              h1{font-size:18px;margin:0 0 16px 0;color:#023047}
              .content{white-space:normal; font-size:14px; line-height:1.6}
            </style></head><body>
            <h1>My Notes - ${currentAlgorithm || ''}</h1>
            <div class="content">${safe}</div>
            <script>window.onload = () => { window.print(); }</script>
            </body></html>`)
            win.document.close()
          }}
          className="w-full py-2 rounded-md text-white text-sm shadow-md relative overflow-hidden bg-gradient-to-r from-[#fb8500] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#fb8500]"
        >
          <span className="relative z-10">Save as PDF</span>
          <span className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_120%,white,transparent_60%)]" />
        </button>
      </div>
    </div>
  )
}


