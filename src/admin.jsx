import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";

const TG_BLUE  = "linear-gradient(135deg, #2AABEE, #229ED9)";
const PAGE_BG  = {
  background: `
    radial-gradient(ellipse at 20% 0%, rgba(42,171,238,0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 10%, rgba(34,158,217,0.12) 0%, transparent 50%),
    #0a0b0f
  `,
};

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

// ── SVG Icons ─────────────────────────────────────────────────────────────
const SvgDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const SvgCategories = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const SvgUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SvgVotes = () => (
  <svg className="w-5 h-5 text-[#2AABEE]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const SvgHome = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// ── Reusable UI ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-gray-900/60 border p-5 flex items-center gap-4"
      style={{ borderColor: "rgba(42,171,238,0.2)" }}>
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold" style={{ color: "#2AABEE" }}>{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b"
        style={{ color: "#2AABEE", borderColor: "rgba(42,171,238,0.2)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Btn({ onClick, children, danger, small, outline }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-semibold transition active:scale-95 ${small ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"}`}
      style={{
        background: outline ? "transparent" : danger ? "#dc2626" : TG_BLUE,
        color: outline ? "#2AABEE" : "#fff",
        border: outline ? "1px solid #2AABEE" : "none",
      }}
    >
      {children}
    </button>
  );
}

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",  label: "Dashboard",  icon: <SvgDashboard /> },
  { id: "categories", label: "Categories", icon: <SvgCategories /> },
  { id: "users",      label: "Users",      icon: <SvgUsers /> },
];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab]               = useState("dashboard");
  const [stats, setStats]           = useState(null);
  const [recentVotes, setRecentVotes] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [categories, setCategories] = useState([]);
  const [users, setUsers]           = useState([]);
  const [expandedCat, setExpandedCat] = useState(null);
  const [msg, setMsg]               = useState(null);
  const [newCat, setNewCat]         = useState({ slug: "", name: "", desc: "" });
  const [newComp, setNewComp]       = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true); // collapsible on mobile
  const [openDropdown, setOpenDropdown] = useState(null);

  const flash = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const api = useCallback(async (path, method = "GET", body) => {
    const res = await fetch(`${API_URL}/api/admin${path}`, {
      method,
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  }, []);

  // Fetch stats + recent activity
  const fetchDashboardData = useCallback(() => {
    api("/stats").then(setStats).catch(() => {});
    api("/recent-votes")
      .then(data => {
        setRecentVotes(data);
        setLoadingRecent(false);
      })
      .catch(() => setLoadingRecent(false));
  }, [api]);

  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (tab === "dashboard") {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 5000);
      return () => clearInterval(interval);
    }
  }, [tab, fetchDashboardData]);

  useEffect(() => { if (tab === "categories") api("/categories").then(setCategories).catch(() => {}); }, [tab, api]);
  useEffect(() => { if (tab === "users")      api("/users").then(setUsers).catch(() => {}); },      [tab, api]);


  // ── Handlers ─────────────────────────────────────────────────────────────────
  const createCategory = async () => {
    try {
      const cat = await api("/categories", "POST", newCat);
      setCategories(p => [...p, cat]);
      setNewCat({ slug: "", name: "", desc: "" });
      flash("Category created");
    } catch (e) { flash(e.message, false); }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category and all its votes?")) return;
    try {
      await api(`/categories/${id}`, "DELETE");
      setCategories(p => p.filter(c => c._id !== id));
      flash("Category deleted");
    } catch (e) { flash(e.message, false); }
  };

  const resetVotes = async (id, name) => {
    if (!confirm(`Reset all votes for "${name}"?`)) return;
    try {
      await api(`/categories/${id}/votes`, "DELETE");
      setCategories(p => p.map(c =>
        c._id === id ? { ...c, competitors: c.competitors.map(x => ({ ...x, votes: 0 })) } : c
      ));
      flash("Votes reset");
    } catch (e) { flash(e.message, false); }
  };

  const addCompetitor = async (catId) => {
    const form = newComp[catId] || {};
    if (!form.name) return flash("Competitor name is required", false);
    try {
      const updated = await api(`/categories/${catId}/competitors`, "POST", form);
      setCategories(p => p.map(c => c._id === catId ? updated : c));
      setNewComp(p => ({ ...p, [catId]: {} }));
      flash("Competitor added");
    } catch (e) { flash(e.message, false); }
  };

  const deleteCompetitor = async (catId, cid) => {
    if (!confirm("Are you sure you want to remove this competitor?")) return;
    try {
      const updated = await api(`/categories/${catId}/competitors/${cid}`, "DELETE");
      setCategories(p => p.map(c => c._id === catId ? updated : c));
      flash("Competitor removed");
    } catch (e) { flash(e.message, false); }
  };

  const toggleBan   = async (uid) => {
    try {
      const { message, banned } = await api(`/users/${uid}/ban`, "PUT");
      setUsers(p => p.map(u => u._id === uid ? { ...u, banned } : u));
      flash(message);
    } catch (e) { flash(e.message, false); }
  };

  const toggleAdmin = async (uid) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (uid === currentUser.uid) {
      return flash("You cannot revoke your own admin rights!", false);
    }
    try {
      const { message, isAdmin } = await api(`/users/${uid}/make-admin`, "PUT");
      setUsers(p => p.map(u => u._id === uid ? { ...u, isAdmin } : u));
      flash(message);
    } catch (e) { flash(e.message, false); }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white flex" style={PAGE_BG}>

      {/* ── SIDEBAR ── */}
      <aside
        className="flex flex-col sticky top-0 h-screen shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? "220px" : "64px",
          background: "linear-gradient(180deg, rgba(42,171,238,0.12) 0%, rgba(10,11,15,0.98) 100%)",
          borderRight: "1px solid rgba(42,171,238,0.2)",
        }}
      >
        {/* Logo / collapse toggle */}
        <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: "1px solid rgba(42,171,238,0.15)" }}>
          {sidebarOpen && (
            <span className="font-bold text-sm tracking-wide" style={{ color: "#2AABEE" }}>Admin Panel</span>
          )}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="text-gray-400 hover:text-white transition text-lg leading-none ml-auto"
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
              style={{
                background: tab === n.id ? "rgba(42,171,238,0.18)" : "transparent",
                color:      tab === n.id ? "#2AABEE" : "#9ca3af",
                borderLeft: tab === n.id ? "3px solid #2AABEE" : "3px solid transparent",
              }}
            >
              <span className="text-lg shrink-0">{n.icon}</span>
              {sidebarOpen && <span>{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* Back to site */}
        <div className="px-2 pb-6">
          <button
            onClick={() => navigate("/home")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-white transition"
          >
            <span className="text-lg shrink-0"><SvgHome /></span>
            {sidebarOpen && <span>Back to Site</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl">

        {/* Flash */}
        {msg && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl
            ${msg.ok ? "bg-emerald-600" : "bg-red-600"} text-white`}>
            {msg.text}
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-white">Overview</h1>
            {stats ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon={<SvgVotes />} label="Total Votes"      value={stats.totalVotes} />
                  <StatCard icon={<SvgUsers />} label="Registered Users" value={stats.totalUsers} />
                  <StatCard icon={<SvgCategories />} label="Categories"       value={stats.totalCategories} />
                </div>

                {/* Live Tracker */}
                <div className="mt-8">
                  <h2 className="text-lg font-bold mb-4 pb-2 border-b flex items-center gap-2"
                    style={{ color: "#2AABEE", borderColor: "rgba(42,171,238,0.2)" }}>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Live Vote Activity Tracker (Auto-updates)
                  </h2>

                  <div className="rounded-2xl bg-gray-900/60 border overflow-hidden"
                    style={{ borderColor: "rgba(42,171,238,0.2)" }}>
                    {loadingRecent ? (
                      <p className="p-6 text-gray-400 text-sm">Loading activity feed...</p>
                    ) : recentVotes.length === 0 ? (
                      <p className="p-6 text-gray-400 text-sm">No recent activity detected.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-white/10 text-gray-400 bg-white/5">
                              <th className="p-3">User</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Voted For</th>
                              <th className="p-3 text-right">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {recentVotes.map(v => (
                              <tr key={v._id} className="hover:bg-white/5 transition">
                                <td className="p-3 font-medium text-gray-300">{v.userEmail}</td>
                                <td className="p-3 text-gray-400">{v.categoryName}</td>
                                <td className="p-3 text-sky-400 font-semibold">{v.competitorName}</td>
                                <td className="p-3 text-right text-xs">
                                  <div className="text-gray-500">{new Date(v.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                                  <div style={{ color: "#2AABEE" }}>{new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : <p className="text-gray-400">Loading…</p>}

          </>
        )}

        {/* ── CATEGORIES ── */}
        {tab === "categories" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-white">Categories</h1>

            <Section title="Add New Category">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {["slug", "name", "desc"].map(f => (
                  <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    value={newCat[f]}
                    onChange={e => setNewCat(p => ({ ...p, [f]: e.target.value }))}
                    className="rounded-xl bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none"
                    onFocus={e => e.target.style.borderColor = "#2AABEE"}
                    onBlur={e => e.target.style.borderColor = ""}
                  />
                ))}
              </div>
              <Btn onClick={createCategory}>Create Category</Btn>
            </Section>

            <Section title="Manage Categories">
              <div className="space-y-4">
                {categories.map(cat => (
                  <div key={cat._id} className="rounded-2xl bg-gray-900/60 border p-4"
                    style={{ borderColor: "rgba(42,171,238,0.2)" }}>
                    {/* Clickable row header — click anywhere to reveal actions */}
                    <div
                      className="flex justify-between items-center flex-wrap gap-2 cursor-pointer select-none"
                      onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === cat._id ? null : cat._id); }}
                      style={{ userSelect: "none" }}
                    >
                      <div className="flex-1">
                        <span className="font-bold text-white">{cat.name}</span>
                        <span className="ml-2 text-xs text-gray-500 font-mono">/{cat.slug}</span>
                        <span className="ml-3 text-xs text-gray-400">
                          {cat.competitors.length} competitors · {cat.competitors.reduce((s, c) => s + c.votes, 0)} votes
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">{openDropdown === cat._id ? "▲" : "▼"}</span>
                    </div>

                    {/* Action panel — drops down when row is clicked */}
                    {openDropdown === cat._id && (
                      <div
                        className="mt-3 pt-3 border-t flex flex-wrap gap-2"
                        style={{ borderColor: "rgba(42,171,238,0.15)" }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => { setExpandedCat(expandedCat === cat._id ? null : cat._id); setOpenDropdown(null); }}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95"
                          style={{ background: "rgba(42,171,238,0.15)", color: "#2AABEE", border: "1px solid rgba(42,171,238,0.3)" }}
                        >
                          {expandedCat === cat._id ? "▲ Collapse" : "▼ Manage Competitors"}
                        </button>
                        <button
                          onClick={() => { setOpenDropdown(null); resetVotes(cat._id, cat.name); }}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95"
                          style={{ background: "rgba(234,179,8,0.12)", color: "#facc15", border: "1px solid rgba(234,179,8,0.3)" }}
                        >
                          Reset Votes
                        </button>
                        <button
                          onClick={() => { setOpenDropdown(null); deleteCategory(cat._id); }}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95"
                          style={{ background: "rgba(220,38,38,0.12)", color: "#f87171", border: "1px solid rgba(220,38,38,0.3)" }}
                        >
                          Delete Category
                        </button>
                      </div>
                    )}

                    {expandedCat === cat._id && (
                      <div className="mt-4 border-t border-white/10 pt-4 space-y-3">
                        {cat.competitors.map(c => (
                          <div key={c._id} className="flex justify-between items-center bg-black/30 rounded-xl px-3 py-2 text-sm">
                            <div>
                              <span className="font-medium text-white">{c.name}</span>
                              {c.username && <span className="ml-2 text-gray-500 text-xs">{c.username}</span>}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold" style={{ color: "#2AABEE" }}>{c.votes} votes</span>
                              <Btn small danger onClick={() => deleteCompetitor(cat._id, c._id)}>Remove</Btn>
                            </div>
                          </div>
                        ))}

                        {/* Add competitor form */}
                        <div className="pt-2">
                          <p className="text-xs text-gray-500 mb-2">Add Competitor</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {["name", "username", "imageKey", "link"].map(f => (
                              <input key={f} placeholder={f}
                                value={newComp[cat._id]?.[f] || ""}
                                onChange={e => setNewComp(p => ({ ...p, [cat._id]: { ...(p[cat._id] || {}), [f]: e.target.value } }))}
                                className="rounded-lg bg-gray-900 border border-gray-700 px-2 py-1.5 text-xs text-white focus:outline-none"
                                onFocus={e => e.target.style.borderColor = "#2AABEE"}
                                onBlur={e => e.target.style.borderColor = ""}
                              />
                            ))}
                          </div>
                          <div className="mt-2">
                            <Btn small onClick={() => addCompetitor(cat._id)}>+ Add Competitor</Btn>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-white">Users</h1>
            <Section title={`${users.length} registered users`}>
              <div className="space-y-2">
                {users.map(u => (
                  <div
                    key={u._id}
                    className="rounded-xl bg-gray-900/60 border px-4 py-3 text-sm"
                    style={{ borderColor: "rgba(42,171,238,0.2)" }}
                  >
                    {/* Clickable row header */}
                    <div
                      className="flex justify-between items-center flex-wrap gap-2 cursor-pointer select-none"
                      onClick={e => { e.stopPropagation(); setOpenDropdown(openDropdown === u._id ? null : u._id); }}
                      style={{ userSelect: "none" }}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white">{u.email || u.phone}</span>
                        <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                        {u.isAdmin && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: "rgba(42,171,238,0.15)", color: "#2AABEE" }}>Admin</span>
                        )}
                        {u.banned && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-red-900/50 text-red-400 font-semibold">Banned</span>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs">{openDropdown === u._id ? "▲" : "▼"}</span>
                    </div>

                    {/* Action panel */}
                    {openDropdown === u._id && (
                      <div
                        className="mt-3 pt-3 border-t flex flex-wrap gap-2"
                        style={{ borderColor: "rgba(42,171,238,0.15)" }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => { setOpenDropdown(null); toggleBan(u._id); }}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95"
                          style={u.banned
                            ? { background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }
                            : { background: "rgba(220,38,38,0.12)", color: "#f87171", border: "1px solid rgba(220,38,38,0.3)" }
                          }
                        >
                          {u.banned ? "Unban User" : "Ban User"}
                        </button>
                        <button
                          onClick={() => { setOpenDropdown(null); toggleAdmin(u._id); }}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95"
                          style={{ background: "rgba(14,165,233,0.12)", color: "#38bdf8", border: "1px solid rgba(14,165,233,0.3)" }}
                        >
                          {u.isAdmin ? "Revoke Admin" : "Make Admin"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}
      </main>
    </div>
  );
}
