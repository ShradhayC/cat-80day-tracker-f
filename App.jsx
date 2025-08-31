import React, { useEffect, useState } from 'react'

const START_KEY = 'cat80_startISO'
const DAYS_KEY = 'cat80_days'
const LOG_KEY = 'cat80_log'

function buildTodayPlan(startISO, dayIndex) {
  // simple prioritized topics for demo
  const quantPriority = ['Arithmetic: Percent & Ratios','Algebra: Quadratic','Geometry: Triangles','Numbers: Permutations','Arithmetic: TSD']
  const dilrMenu = ['DI: Tables','DI: Caselets','LR: Arrangements','LR: Games','LR: Venn']
  const quant = quantPriority[dayIndex % quantPriority.length]
  const dilr = dilrMenu[dayIndex % dilrMenu.length]
  return { quant, dilr, varc: '4 RC + 10 VA', sectional: ['Quant','DILR','VARC'][dayIndex % 3], mock: ((dayIndex+1)%7===4 || (dayIndex+1)%7===0) }
}

export default function App() {
  const [startISO, setStartISO] = useState(() => localStorage.getItem(START_KEY) || new Date().toISOString().slice(0,10))
  const [dayIndex, setDayIndex] = useState(() => parseInt(localStorage.getItem('cat80_dayIndex')||'0',10))
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem(LOG_KEY) || '[]'))

  const todayPlan = buildTodayPlan(startISO, dayIndex)
  const yesterdayPlan = buildTodayPlan(startISO, Math.max(0, dayIndex-1))

  useEffect(()=>{
    localStorage.setItem(START_KEY, startISO)
  },[startISO])

  function markDone() {
    const entry = {
      date: new Date().toISOString().slice(0,10),
      day: dayIndex+1,
      plan: todayPlan,
      notes: document.getElementById('notes').value || ''
    }
    const arr = [...notes, entry]
    setNotes(arr)
    localStorage.setItem(LOG_KEY, JSON.stringify(arr))
    const next = dayIndex + 1
    setDayIndex(next)
    localStorage.setItem('cat80_dayIndex', String(next))
    alert('Marked complete for Day ' + entry.day)
  }

  function exportJSON() {
    const data = { startISO, notes }
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'cat80_progress.json'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <header>
        <h1>CAT 80‑Day Tracker</h1>
        <p className="muted">Minimal clean dashboard — Today’s agenda, yesterday recap, practice counts. Saves locally.</p>
      </header>

      <main>
        <section className="card">
          <h2>Day {dayIndex+1} • {new Date().toLocaleDateString()}</h2>
          <div className="grid">
            <div><strong>Quant</strong><p>{todayPlan.quant}</p></div>
            <div><strong>DILR</strong><p>{todayPlan.dilr}</p></div>
            <div><strong>VARC</strong><p>{todayPlan.varc}</p></div>
            <div><strong>Sectional</strong><p>{todayPlan.sectional}</p></div>
            <div><strong>Mock</strong><p>{todayPlan.mock ? 'Yes' : 'No'}</p></div>
          </div>
          <div className="actions">
            <button onClick={markDone}>✅ Mark Day Complete</button>
            <button onClick={exportJSON} className="ghost">Export Progress</button>
          </div>
        </section>

        <section className="card small">
          <h3>Yesterday’s Recap</h3>
          {notes.length===0 ? <p className="muted">No entries yet.</p> : (
            <div>
              <p><strong>Day {notes[notes.length-1].day}:</strong> {notes[notes.length-1].plan.quant} • {notes[notes.length-1].plan.dilr}</p>
              <p><em>Notes:</em> {notes[notes.length-1].notes || '—'}</p>
            </div>
          )}
        </section>

        <section className="card small">
          <h3>What to Learn Today</h3>
          <ul>
            <li>Formula / Shortcut: <strong>LCM trick for relative speed</strong></li>
            <li>Practice recommended: <strong>25 Quant Qs</strong>, <strong>3 DILR sets</strong>, <strong>4 RCs + 10 VA</strong></li>
          </ul>
        </section>

        <section className="card notes">
          <h3>Daily Notes</h3>
          <textarea id="notes" placeholder="Write 1-3 bullets: what you revised, mistakes, plans..."></textarea>
        </section>
      </main>

      <footer>
        <small>Saved in your browser. Use Export to backup.</small>
      </footer>
    </div>
  )
}
