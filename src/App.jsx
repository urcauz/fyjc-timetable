import React, { useEffect, useMemo, useRef, useState } from "react";
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

function getMinutesUntil(timeSlot) {
  const [start] = timeSlot.split("–");
  const [h, m] = start.split(":").map(Number);
  const targetTime = new Date();
  targetTime.setHours(h, m, 0, 0);

  const now = new Date();
  return Math.floor((targetTime - now) / 60000);
}

function getMinutesUntilEnd(timeSlot) {
  const [, end] = timeSlot.split("–");
  const [h, m] = end.split(":").map(Number);
  const targetTime = new Date();
  targetTime.setHours(h, m, 0, 0);

  const now = new Date();
  return Math.floor((targetTime - now) / 60000);
}

export default function App() {
  // persist division & notifications in localStorage
  const initialDivision =
    (typeof window !== "undefined" && localStorage.getItem("division")) ||
    Object.keys(DIVISIONS)[0];

  const initialNotifications =
    typeof window !== "undefined"
      ? localStorage.getItem("notifications") === "true" ||
        (window.Notification && Notification.permission === "granted")
      : false;

  const [division, setDivision] = useState(initialDivision);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(true); // primary = dark
  const [current, setCurrent] = useState(null);
  const [next, setNext] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [showFull, setShowFull] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialNotifications
  );

  const data = DIVISIONS[division];
  const today = dayName();
  const todaySlots = data[today] || [];

  // refs for scheduled timeouts and notified keys (so updates don't re-render)
  const scheduledTimeoutsRef = useRef([]);
  const notifiedKeysRef = useRef(new Set());

  // persist division & notification preference
  useEffect(() => {
    try {
      localStorage.setItem("division", division);
    } catch {}
  }, [division]);

  useEffect(() => {
    try {
      localStorage.setItem("notifications", notificationsEnabled ? "true" : "false");
    } catch {}
  }, [notificationsEnabled]);

  // request permission helper
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      setNotificationsEnabled(granted);
      if (granted) {
        showNotification("🔔 Notifications Enabled!", "You'll get alerts for upcoming lectures");
      }
    } catch (e) {
      console.warn("Notification permission error", e);
    }
  };

  // show notification helper (double-check permission)
  const showNotification = (title, body) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    try {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "lecture-notification",
      });
    } catch (e) {
      console.warn("Notification error", e);
    }
  };

  // handle select change (so we can reset scheduled notifications & immediately schedule new)
  const handleDivisionChange = (newDiv) => {
    // clear scheduled timeouts
    scheduledTimeoutsRef.current.forEach((t) => clearTimeout(t));
    scheduledTimeoutsRef.current = [];
    notifiedKeysRef.current = new Set();

    setDivision(newDiv);

    // If notifications are enabled & permission is granted, give a quick summary notification
    if (notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
      // compute next lecture for new division for today
      const slotsForNew = DIVISIONS[newDiv][today] || [];
      const nowIdx = getCurrentSlotIndex();
      const nextSlot = nowIdx >= 0 && nowIdx + 1 < slotsForNew.length ? slotsForNew[nowIdx + 1] : null;
      const nextTime = nowIdx >= 0 && nowIdx + 1 < TIME_SLOTS.length ? TIME_SLOTS[nowIdx + 1].split("–")[0] : null;
      const body = nextSlot ? `${nextSlot} — ${nextTime || ""}` : "No more lectures today";
      showNotification(`Switched to ${newDiv}`, `Next: ${body}`);
    }
  };

  // schedule notifications for today's slots (10 min before start, 5 min before end)
  useEffect(() => {
    // clear previously scheduled timeouts
    scheduledTimeoutsRef.current.forEach((t) => clearTimeout(t));
    scheduledTimeoutsRef.current = [];

    // reset notified keys (we keep this local to an effect so it restarts on division/day/enable change)
    notifiedKeysRef.current = new Set();

    if (!notificationsEnabled) return;

    // only proceed if permission granted
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    // For each slot, schedule notifications if in the future (or fire immediately if within window)
    todaySlots.forEach((slot, i) => {
      if (!slot || slot === "—") return;

      // start notification (10 minutes before)
      const [start] = TIME_SLOTS[i].split("–");
      const [sh, sm] = start.split(":").map(Number);
      const startTime = new Date();
      startTime.setHours(sh, sm, 0, 0);
      const msUntilStart = startTime - Date.now();
      const msUntilStartNotif = msUntilStart - 10 * 60 * 1000;
      const upcomingKey = `upcoming-${i}`;

      if (msUntilStartNotif > 0) {
        const t = setTimeout(() => {
          // avoid duplicate
          if (!notifiedKeysRef.current.has(upcomingKey)) {
            showNotification(
              "📚 Upcoming Lecture!",
              `${slot} starts in 10 minutes at ${start}`
            );
            notifiedKeysRef.current.add(upcomingKey);
          }
        }, msUntilStartNotif);
        scheduledTimeoutsRef.current.push(t);
      } else if (msUntilStart > 0 && msUntilStart <= 10 * 60 * 1000) {
        // we're within the 10-minute window now — notify immediately (if not already)
        if (!notifiedKeysRef.current.has(upcomingKey)) {
          showNotification(
            "📚 Upcoming Lecture!",
            `${slot} starts in ${Math.ceil(msUntilStart / 60000)} minute(s) at ${start}`
          );
          notifiedKeysRef.current.add(upcomingKey);
        }
      }

      // end notification (5 minutes before end)
      const [, end] = TIME_SLOTS[i].split("–");
      const [eh, em] = end.split(":").map(Number);
      const endTime = new Date();
      endTime.setHours(eh, em, 0, 0);
      const msUntilEnd = endTime - Date.now();
      const msUntilEndNotif = msUntilEnd - 5 * 60 * 1000;
      const endingKey = `ending-${i}`;

      if (msUntilEndNotif > 0) {
        const t2 = setTimeout(() => {
          if (!notifiedKeysRef.current.has(endingKey)) {
            const nxt = todaySlots[i + 1] || "No more lectures";
            showNotification("⏰ Current Lecture Ending Soon!", `${slot} ends in 5 minutes. Next: ${nxt}`);
            notifiedKeysRef.current.add(endingKey);
          }
        }, msUntilEndNotif);
        scheduledTimeoutsRef.current.push(t2);
      } else if (msUntilEnd > 0 && msUntilEnd <= 5 * 60 * 1000) {
        if (!notifiedKeysRef.current.has(endingKey)) {
          const nxt = todaySlots[i + 1] || "No more lectures";
          showNotification("⏰ Current Lecture Ending Soon!", `${slot} ends in ${Math.ceil(msUntilEnd / 60000)} minute(s). Next: ${nxt}`);
          notifiedKeysRef.current.add(endingKey);
        }
      }
    });

    // cleanup when effect re-runs
    return () => {
      scheduledTimeoutsRef.current.forEach((t) => clearTimeout(t));
      scheduledTimeoutsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division, notificationsEnabled, today]); // run when division or notifications toggle or day changes

  // core live updater (current/next/countdown)
  useEffect(() => {
    function update() {
      const idx = getCurrentSlotIndex();
      setCurrentIdx(idx);
      setCurrent(idx >= 0 ? todaySlots[idx] : null);
      setNext(idx >= 0 && idx + 1 < todaySlots.length ? todaySlots[idx + 1] : null);

      // Countdown for next slot
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division, todaySlots]);

  // reset notified keys when day changes
  useEffect(() => {
    notifiedKeysRef.current = new Set();
  }, [today]);

  const q = query.trim().toLowerCase();
  const filteredToday = useMemo(() => {
    if (!q) return todaySlots;
    return todaySlots.map((c) => (c && c.toLowerCase().includes(q) ? c : c === "—" ? "—" : ""));
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
          <select
            value={division}
            onChange={(e) => handleDivisionChange(e.target.value)}
          >
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

      {/* Main */}
      <main className="container">
        {/* Notification Banner (when disabled) */}
        {!notificationsEnabled && (
          <div className="notification-banner">
            <p>🔔 Get notified about upcoming lectures!</p>
            <button onClick={requestNotificationPermission} className="notify-btn">
              Enable Notifications
            </button>
          </div>
        )}

        {/* Notification status (when enabled) */}
        {notificationsEnabled && (
          <div className="notification-status">
            ✅ Notifications enabled - You'll get alerts 10 min before lectures & 5 min before they end
          </div>
        )}

        <section className="nowcard">
          <h3>Now</h3>
          <p className="big">{current || "No lecture right now"}</p>
          <p className="muted">Next: {next || "—"}</p>
          {countdown && <p className="countdown">{countdown}</p>}
        </section>

        <section className="today-list">
          <h3>📅 {today} Schedule</h3>
          <ul>
            {filteredToday.map((slot, i) => (
              <li key={i} className={i === currentIdx ? "active" : ""}>
                <span className="time">{TIME_SLOTS[i]}</span>
                <span className="subject">{slot || "—"}</span>
                {/* Show notification indicators */}
                {notificationsEnabled && slot && slot !== "—" && (
                  <span className="notification-indicator">
                    {getMinutesUntil(TIME_SLOTS[i]) <= 15 && getMinutesUntil(TIME_SLOTS[i]) > 0 && (
                      <span className="upcoming">🔔</span>
                    )}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

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
                      className={`cell ${day === today && i === currentIdx ? "active" : ""}`}
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

      {/* Full footer preserved (all items kept) */}
      <footer className="footer-consolidated">
        <div className="footer-item">
          {notificationsEnabled
            ? "🔔 Notifications Active - Get alerts for lectures!"
            : "🔔 Enable notifications above for lecture alerts"}
        </div>
        <div className="footer-item">
          💬 Suggestions? Contact me on{" "}
          <a
            href="https://wa.me/qr/U4B2LC3PC7QIO1"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            WhatsApp
          </a>
        </div>
        <div className="footer-item">⚠️ Unofficial app - Please verify with official timetable</div>
        <div className="footer-item">⚠️ Last Updated : 08-sep-2025 | 9:50pm</div>
      </footer>
    </div>
  );
}
