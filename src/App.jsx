import React, { useEffect, useMemo, useState } from 'react';
import { DIVISIONS, TIME_SLOTS } from './data/timetable.js';
import './index.css';

function getCurrentSlotIndex() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const bounds = [
    [10 * 60 + 20, 11 * 60],
    [11 * 60, 11 * 60 + 40],
    [11 * 60 + 40, 12 * 60 + 20],
    [12 * 60 + 20, 13 * 60],
    [13 * 60, 13 * 60 + 40],
    [13 * 60 + 40, 14 * 60 + 20],
    [14 * 60 + 20, 15 * 60],
    [15 * 60, 15 * 60 + 40],
    [15 * 60 + 40, 16 * 60 + 20],
    [16 * 60 + 20, 17 * 60],
    [17 * 60, 17 * 60 + 40],
  ];
  for (let i = 0; i < bounds.length; i++) {
    if (mins >= bounds[i][0] && mins < bounds[i][1]) return i;
  }
  return -1;
}

function dayName() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

export default function App() {
  const [division, setDivision] = useState(Object.keys(DIVISIONS)[0]);
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);
  const [current, setCurrent] = useState(null);
  const [next, setNext] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const data = DIVISIONS[division];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    let timer;
    function update() {
      const idx = getCurrentSlotIndex();
      const today = dayName();
      const slots = data[today] || [];

      setCurrentIdx(idx);
      setCurrent(idx >= 0 ? slots[idx] : null);
      setNext(idx >= 0 && idx + 1 < slots.length ? slots[idx + 1] : null);

      // 🔔 Schedule notification 5 minutes before next lecture
      if (idx >= 0 && slots[idx + 1]) {
        const [start] = TIME_SLOTS[idx + 1].split('–');
        const [h, m] = start.split(':').map(Number);
        const nextStart = new Date();
        nextStart.setHours(h, m, 0, 0);

        const diff = nextStart - Date.now() - 5 * 60 * 1000;
        if (diff > 0) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (Notification.permission === 'granted') {
              new Notification('Upcoming Lecture', {
                body: `${slots[idx + 1]} starts in 5 minutes (Div ${division})`,
              });
            }
          }, diff);
        }
      }
    }

    if ('Notification' in window) Notification.requestPermission();
    update();
    const iv = setInterval(update, 60 * 1000);
    return () => {
      clearInterval(iv);
      clearTimeout(timer);
    };
  }, [division, data]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return data;
    const out = {};
    Object.keys(data).forEach(
      (d) =>
        (out[d] = data[d].map((c) =>
          c && c.toLowerCase().includes(q) ? c : c === '—' ? '—' : ''
        ))
    );
    return out;
  }, [data, q]);

  return (
    <div className="app-root">
      <header className="topbar">
        <div>
          <h1>📚 Elphinstone FYJC Timetable</h1>
          <p>
            Academic Year 2025–26 — <strong>{division}</strong>
          </p>
        </div>
        <div className="controls">
          <select value={division} onChange={(e) => setDivision(e.target.value)}>
            {Object.keys(DIVISIONS).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            placeholder="🔍 Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setDark((d) => !d)}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <main className="container">
        <section className="nowcard">
          <h3>Now</h3>
          <p className="big">{current || 'No lecture right now'}</p>
          <p className="muted">
            Next: {next || '—'}{' '}
            {next && (
              <span style={{ fontStyle: 'italic', color: '#888' }}>
                (Div {division})
              </span>
            )}
          </p>
        </section>

        <section id="timetable-capture" className="timetable">
          <div className="grid">
            <div className="head left">Day / Time</div>
            {TIME_SLOTS.map((t) => (
              <div className="head" key={t}>
                {t}
              </div>
            ))}
            {Object.entries(filtered).map(([day, slots]) => (
              <React.Fragment key={day}>
                <div className="dayname">{day}</div>
                {slots.map((cell, i) => (
                  <div
                    key={i}
                    className={`cell ${
                      day === dayName() && i === currentIdx ? 'active' : ''
                    }`}
                  >
                    {cell}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        📲 Mobile Friendly • 🔔 Notifications Enabled • Install as PWA • Made by someone with roll no.1053
      </footer>
    </div>
  );
}
