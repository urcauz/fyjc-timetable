import React, { useEffect, useMemo, useState } from "react";
import { DIVISIONS, TIME_SLOTS } from "./data/timetable.js";
import "./index.css";

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
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

export default function App() {
  const [division, setDivision] = useState(Object.keys(DIVISIONS)[0]);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(true);
  const [current, setCurrent] = useState(null);
  const [next, setNext] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [showFull, setShowFull] = useState(false);
  const [countdown, setCountdown] = useState("");

  const data = DIVISIONS[division];
  const today = dayName();
  const todaySlots = data[today] || [];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    function update() {
      const idx = getCurrentSlotIndex();
      setCurrentIdx(idx);
      setCurrent(idx >= 0 ? todaySlots[idx] : null);
      setNext(idx >= 0 && idx + 1 < todaySlots.length ? todaySlots[idx + 1] : null);

      // countdown
      if (idx >= 0 && idx + 1 < TIME_SLOTS.length) {
        const [start] = TIME_SLOTS[idx + 1].split("–");
        const [h, m] = start.split(":").map(Number);
        const nextTime = new Date();
        nextTime.setHours(h, m, 0, 0);

        const diff = nextTime - new Date();
        if (diff > 0) {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setCountdown(
            mins > 0
              ? `⏳ Next in ${mins} min${mins > 1 ? "s" : ""}`
              : `⏳ Next in ${secs} sec${secs > 1 ? "s" : ""}`
          );
        } else {
          setCountdown("🚀 Starting now!");
        }
      } else {
        setCountdown("");
      }
    }

    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [division, todaySlots]);

  const q = query.trim().toLowerCase();
  const filteredToday = useMemo(() => {
    if (!q) return todaySlots;
    return todaySlots.map((c) =>
      c && c.toLowerCase().includes(q) ? c : c === "—" ? "—" : ""
    );
  }, [todaySlots, q]);

  return (
    <div className="app-root">
      {/* Header */}
      <header className="topbar">
        <div>
          <h1>📚 Elphinstone FYJC</h1>
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
          
        </div>
      </header>

      {/* Now / Next Card */}
      <main className="container">
        <section className="nowcard">
          <h3>Now</h3>
          <p className="big">{current || "No lecture right now"}</p>
          <p className="muted">Next: {next || "—"}</p>
          {countdown && <p className="countdown">{countdown}</p>}
        </section>

        {/* Today's Schedule */}
        <section className="today-list">
          <h3>💀 {today} Schedule</h3>
          <ul>
            {filteredToday.map((slot, i) => (
              <li key={i} className={i === currentIdx ? "active" : ""}>
                <span className="time">{TIME_SLOTS[i]}</span>
                <span className="subject">{slot || "—"}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Full timetable toggle */}
        <button className="toggle-btn" onClick={() => setShowFull((s) => !s)}>
          {showFull ? "Hide Full Timetable" : "Show Full Timetable"}
        </button>

        {showFull && (
          <section className="timetable">
            <div className="grid">
              <div className="head left">Day / Time</div>
              {TIME_SLOTS.map((t) => (
                <div className="head" key={t}>
                  {t}
                </div>
              ))}
              {Object.entries(data).map(([day, slots]) => (
                <React.Fragment key={day}>
                  <div className="dayname">{day}</div>
                  {slots.map((cell, i) => (
                    <div
                      key={i}
                      className={`cell ${
                        day === today && i === currentIdx ? "active" : ""
                      }`}
                    >
                      {cell}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        📲 Mobile Friendly • 🔔 Notifications Ready | Made by Cauz :)
      </footer>
            <footer className="footer">
        ⚠️ To Suggest Changes, Contact Me on WhatsApp: 7738770095 ⚠️
      </footer>
      <footer className="footer">
        ⚠️ This is an unofficial app. Verify with official sources. ⚠️
      </footer>
    </div>
  );
}
