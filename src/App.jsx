import { useState, useEffect } from "react";
import {
  Rocket,
  Plus,
  DollarSign,
  Clock,
  CalendarCheck,
  Layers,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  X,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Bell,
  Settings,
  Wallet,
  Star,
  Zap,
  Globe,
  Link2,
  CircleDot,
  Hexagon,
  Diamond,
  Pentagon,
  Box,
  Triangle,
  Gem,
  Trash2,
  CheckCircle2,
  Circle,
  Loader2,
  Calendar,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import { supabase } from './supabaseClient';

/* ───────────── Static Data ───────────── */
const CHAINS = {
  Solana:   { color: "from-purple-500 to-fuchsia-500", bg: "bg-purple-500/10", text: "text-purple-400", icon: Gem },
  Monad:    { color: "from-violet-500 to-indigo-500", bg: "bg-violet-500/10", text: "text-violet-400", icon: Hexagon },
  Ethereum: { color: "from-blue-500 to-cyan-500",   bg: "bg-blue-500/10",   text: "text-blue-400",   icon: Diamond },
  Arbitrum: { color: "from-sky-400 to-blue-500",    bg: "bg-sky-500/10",    text: "text-sky-400",    icon: Triangle },
  Base:     { color: "from-blue-600 to-indigo-600", bg: "bg-blue-600/10",   text: "text-blue-300",   icon: CircleDot },
  zkSync:   { color: "from-indigo-400 to-violet-600", bg: "bg-indigo-500/10", text: "text-indigo-400", icon: Pentagon },
  Sui:      { color: "from-cyan-400 to-teal-500",   bg: "bg-cyan-500/10",   text: "text-cyan-400",   icon: Box },
  Aptos:    { color: "from-emerald-400 to-green-500", bg: "bg-emerald-500/10", text: "text-emerald-400", icon: Globe },
  Canton:   { color: "from-teal-400 to-emerald-500", bg: "bg-teal-500/10", text: "text-teal-400", icon: Link2 },
  BTC:      { color: "from-orange-500 to-amber-500", bg: "bg-orange-500/10", text: "text-orange-400", icon: Circle },
  Other:    { color: "from-zinc-400 to-slate-500", bg: "bg-zinc-500/10", text: "text-zinc-400", icon: Circle },
};

const CATEGORIES = {
  Testnet:  { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20" },
  Mainnet:  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  Staking:  { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
  DeFi:     { bg: "bg-purple-500/10",  text: "text-purple-400",  border: "border-purple-500/20" },
  DePIN:    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20" },
  "Infrastructure / L2": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
};

const PRIORITIES = {
  High:   { bg: "bg-rose-500/10",   text: "text-rose-400",   dot: "bg-rose-400",   ring: "ring-rose-500/20" },
  Medium: { bg: "bg-amber-500/10",  text: "text-amber-400",  dot: "bg-amber-400",  ring: "ring-amber-500/20" },
  Low:    { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", ring: "ring-emerald-500/20" },
};

const INITIAL_PROJECTS = [
  { id: 1,  name: "LayerZero",      chain: "Ethereum", category: "Mainnet",  nextTask: "Bridge Assets",     priority: "High",   cost: 120,  status: "active"  },
  { id: 2,  name: "zkSync Era",     chain: "zkSync",   category: "Mainnet",  nextTask: "Swap on SyncSwap",  priority: "High",   cost: 85,   status: "active"  },
  { id: 3,  name: "Monad Testnet",  chain: "Monad",    category: "Testnet",  nextTask: "Daily Check-in",    priority: "High",   cost: 0,    status: "active"  },
  { id: 4,  name: "Starknet",       chain: "Ethereum", category: "Mainnet",  nextTask: "Provide Liquidity",  priority: "Medium", cost: 200,  status: "active"  },
  { id: 5,  name: "Sui Network",    chain: "Sui",      category: "Testnet",  nextTask: "Mint NFT",          priority: "Medium", cost: 0,    status: "active"  },
  { id: 6,  name: "Base Bridge",    chain: "Base",     category: "Mainnet",  nextTask: "Bridge ETH",        priority: "Medium", cost: 45,   status: "active"  },
  { id: 7,  name: "Aptos Staking",  chain: "Aptos",    category: "Staking",  nextTask: "Claim Rewards",     priority: "Low",    cost: 30,   status: "active"  },
  { id: 8,  name: "Arbitrum Odyssey", chain: "Arbitrum", category: "DeFi",   nextTask: "Swap on GMX",       priority: "Low",    cost: 60,   status: "active"  },
  { id: 9,  name: "Solana Phantom", chain: "Solana",   category: "DeFi",     nextTask: "Stake SOL",         priority: "Medium", cost: 150,  status: "active"  },
  { id: 10, name: "Scroll Testnet", chain: "Ethereum", category: "Testnet",  nextTask: "Deploy Contract",   priority: "High",   cost: 0,    status: "active"  },
];

/* ───────────── Helper: Relative Time ───────────── */
function timeAgo(dateStr) {
  if (!dateStr) return { text: 'No data', stale: false };
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let text;
  if (diffMins < 1) text = 'Just now';
  else if (diffMins < 60) text = `${diffMins}m ago`;
  else if (diffHours < 24) text = `${diffHours}h ago`;
  else if (diffDays === 1) text = 'Yesterday';
  else if (diffDays < 7) text = `${diffDays} days ago`;
  else {
    text = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return { text, stale: diffDays > 3 };
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ───────────── Helper Components ───────────── */

function StatCard({ icon: Icon, label, value, sub, gradient, trend, trendUp }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20">
      {/* background glow */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-[0.15]`} />

      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? "text-emerald-400" : "text-rose-400"}`}>
            {trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend}
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-0.5 text-sm text-zinc-400">{label}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

function ChainBadge({ chain }) {
  const cfg = CHAINS[chain] || CHAINS.Ethereum;
  const ChainIcon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <ChainIcon className="h-3 w-3" />
      {chain}
    </span>
  );
}

function CategoryBadge({ category }) {
  const cfg = CATEGORIES[category] || CATEGORIES.Testnet;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {category}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const cfg = PRIORITIES[priority] || PRIORITIES.Low;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {priority}
    </span>
  );
}

/* ─── Project Modal (Add + Edit) ─── */
function ProjectModal({ open, onClose, onSave, editProject }) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const isEdit = !!editProject;

  const emptyForm = {
    name: "",
    chain: "Ethereum",
    category: "Testnet",
    nextTask: "",
    priority: "Medium",
    cost: 0,
    lastActivity: todayStr,
    tgeDate: "",
    startDate: todayStr,
  };

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form when editProject changes
  useEffect(() => {
    if (editProject) {
      setForm({
        name: editProject.name || "",
        chain: editProject.chain || "Ethereum",
        category: editProject.category || "Testnet",
        nextTask: editProject.next_task || "",
        priority: editProject.priority || "Medium",
        cost: editProject.cost || 0,
        lastActivity: editProject.last_activity || todayStr,
        tgeDate: editProject.tge_date || "",
        startDate: editProject.start_date || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editProject]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);

    const payload = {
      name: form.name,
      chain: form.chain,
      category: form.category,
      next_task: form.nextTask,
      priority: form.priority,
      cost: Number(form.cost) || 0,
      last_activity: form.lastActivity || todayStr,
      tge_date: form.tgeDate || null,
      start_date: form.startDate || null,
    };

    let error;
    if (isEdit) {
      const res = await supabase
        .from('airdrops')
        .update(payload)
        .eq('id', editProject.id);
      error = res.error;
    } else {
      const res = await supabase
        .from('airdrops')
        .insert([{ ...payload, status: "Active" }])
        .select();
      error = res.error;
    }

    setSubmitting(false);
    if (error) {
      console.error(isEdit ? "Gagal update:" : "Gagal simpan:", error.message);
      alert("Error: " + error.message);
    } else {
      await onSave();
      if (!isEdit) setForm(emptyForm);
      onClose();
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/[0.08] bg-zinc-800/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20";
  const labelCls = "mb-1.5 block text-xs font-medium text-zinc-400";
  const selectCls =
    "w-full appearance-none rounded-xl border border-white/[0.08] bg-zinc-800/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg animate-[modalIn_0.25s_ease-out] rounded-2xl border border-white/[0.08] bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {isEdit ? <Pencil className="h-5 w-5 text-amber-400" /> : <Sparkles className="h-5 w-5 text-violet-400" />}
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* name */}
          <div>
            <label className={labelCls}>Project Name</label>
            <input className={inputCls} placeholder="e.g. LayerZero" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          {/* chain + category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Chain</label>
              <select className={selectCls} value={form.chain} onChange={(e) => setForm({ ...form, chain: e.target.value })}>
                {Object.keys(CHAINS).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select className={selectCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {Object.keys(CATEGORIES).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* next task + priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Next Task</label>
              <input className={inputCls} placeholder="e.g. Daily Check-in" value={form.nextTask} onChange={(e) => setForm({ ...form, nextTask: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select className={selectCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {Object.keys(PRIORITIES).map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* cost */}
          <div>
            <label className={labelCls}>Estimated Cost ($)</label>
            <input className={inputCls} type="number" min={0} value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          </div>

          {/* dates row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Start Date</span>
              </label>
              <input className={inputCls} type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Last Activity</span>
              </label>
              <input className={inputCls} type="date" value={form.lastActivity} onChange={(e) => setForm({ ...form, lastActivity: e.target.value })} />
            </div>
          </div>

          {/* dates row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Target / TGE Date</span>
              </label>
              <input className={inputCls} type="date" value={form.tgeDate} onChange={(e) => setForm({ ...form, tgeDate: e.target.value })} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Project' : 'Add Project')}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═════════════════ MAIN APP ═════════════════ */
export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // { [id]: 'delete' | 'toggle' }

  // Fungsi untuk ambil data dari Supabase
  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('airdrops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('Error fetching:', error);
    } else {
      const today = new Date();
      const enrichedData = (data || []).map(p => {
        let completed_today = false;
        if (p.task_done && p.updated_at) {
          const updatedDate = new Date(p.updated_at);
          completed_today = 
            today.getDate() === updatedDate.getDate() &&
            today.getMonth() === updatedDate.getMonth() &&
            today.getFullYear() === updatedDate.getFullYear();
        }
        return { ...p, completed_today };
      });
      setProjects(enrichedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState("");
  const [filterChain, setFilterChain] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  /* ── Derived ── */
  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchChain = filterChain === "All" || p.chain === filterChain;
    const matchPriority = filterPriority === "All" || p.priority === filterPriority;
    return matchSearch && matchChain && matchPriority;
  });

  const totalCost = projects.reduce((s, p) => s + (p.cost || 0), 0);
  const highPriorityCount = projects.filter((p) => p.priority === "High").length;
  const pendingTasks = projects.filter((p) => !p.completed_today).length;

  /* ── Handlers ── */
  const handleSave = async () => await fetchProjects();

  const openEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const removeProject = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: 'delete' }));
    const { error } = await supabase.from('airdrops').delete().eq('id', id);
    if (error) {
      console.error('Gagal hapus:', error.message);
      alert('Error: ' + error.message);
    } else {
      await fetchProjects();
    }
    setActionLoading((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const toggleTaskDone = async (id, currentValue) => {
    setActionLoading((prev) => ({ ...prev, [id]: 'toggle' }));
    
    const nowISO = new Date().toISOString();
    const { error } = await supabase
      .from('airdrops')
      .update({ 
        task_done: !currentValue,
        updated_at: nowISO 
      })
      .eq('id', id);
    if (error) {
      console.error('Gagal update task:', error.message);
      alert('Error: ' + error.message);
    } else {
      await fetchProjects();
    }
    setActionLoading((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* subtle grid background */}
      <div className="pointer-events-none fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-100" />

      {/* top glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ━━━━━━━━━━━━ HEADER ━━━━━━━━━━━━ */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Airdrop <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Command Center</span>
              </h1>
              <p className="text-xs text-zinc-500">Track · Farm · Claim</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-white/[0.06] bg-zinc-900/60 p-2.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
              <Bell className="h-4.5 w-4.5" />
            </button>
            <button className="rounded-xl border border-white/[0.06] bg-zinc-900/60 p-2.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
              <Settings className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>
        </header>

        {/* ━━━━━━━━━━━━ STAT CARDS (LIVE) ━━━━━━━━━━━━ */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Layers}        label="Total Active Projects" value={projects.length}                    gradient="from-violet-600 to-indigo-600"  sub={`${highPriorityCount} high priority`} />
          <StatCard icon={DollarSign}    label="Total Farming Cost"    value={`$${totalCost.toLocaleString()}`}   gradient="from-emerald-600 to-teal-600"   sub="Sum of all project costs" />
          <StatCard icon={Clock}         label="Pending Tasks"         value={pendingTasks}                       gradient="from-amber-500 to-orange-600"   sub={`${projects.length - pendingTasks} completed today`} />
          <StatCard icon={CalendarCheck} label="Completed Tasks"       value={projects.length - pendingTasks}     gradient="from-rose-500 to-pink-600"      sub="Tasks marked as done" />
        </section>

        {/* ━━━━━━━━━━━━ TOOLBAR ━━━━━━━━━━━━ */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* search */}
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-xl border border-white/[0.06] bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />

            <div className="relative">
              <select
                value={filterChain}
                onChange={(e) => setFilterChain(e.target.value)}
                className="appearance-none rounded-lg border border-white/[0.06] bg-zinc-900/60 py-2 pl-3 pr-8 text-xs text-zinc-300 outline-none transition focus:border-violet-500/40"
              >
                <option value="All">All Chains</option>
                {Object.keys(CHAINS).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            </div>

            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="appearance-none rounded-lg border border-white/[0.06] bg-zinc-900/60 py-2 pl-3 pr-8 text-xs text-zinc-300 outline-none transition focus:border-violet-500/40"
              >
                <option value="All">All Priorities</option>
                {Object.keys(PRIORITIES).map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━ TABLE ━━━━━━━━━━━━ */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/50 backdrop-blur-sm">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                <p className="text-sm text-zinc-400">Loading projects...</p>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold">Chain</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Next Task</th>
                  <th className="px-6 py-4 font-semibold">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Started At</span>
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Last Active</span>
                  </th>
                  <th className="px-6 py-4 font-semibold">Cost</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((p) => {
                  const chainCfg = CHAINS[p.chain] || CHAINS.Ethereum;
                  const ChainIcon = chainCfg.icon;
                  return (
                    <tr key={p.id} className="group transition-colors hover:bg-white/[0.02]">
                      {/* project name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${chainCfg.color} shadow`}>
                            <ChainIcon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{p.name}</p>
                            <p className="text-xs text-zinc-500">ID #{String(p.id).padStart(4, "0")}</p>
                          </div>
                        </div>
                      </td>

                      {/* chain */}
                      <td className="px-6 py-4">
                        <ChainBadge chain={p.chain} />
                      </td>

                      {/* category */}
                      <td className="px-6 py-4">
                        <CategoryBadge category={p.category} />
                      </td>

                      {/* next task */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleTaskDone(p.id, p.completed_today)}
                            disabled={actionLoading[p.id] === 'toggle'}
                            className={`flex-shrink-0 rounded-md p-0.5 transition-all ${
                              p.completed_today
                                ? "text-emerald-400 hover:text-emerald-300"
                                : "text-zinc-500 hover:text-amber-400"
                            } disabled:opacity-50`}
                            title={p.completed_today ? "Mark as pending" : "Mark as done"}
                          >
                            {actionLoading[p.id] === 'toggle' ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : p.completed_today ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </button>
                          {p.completed_today ? (
                            <div className="flex flex-col">
                              <span className="text-emerald-400 font-medium text-xs">Completed Today ✓</span>
                              {p.updated_at && (
                                <span className="text-[10px] text-zinc-500 mt-0.5">
                                  Checked at {new Date(p.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-zinc-300">
                              {p.next_task || p.nextTask || '-'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* started at */}
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-xs text-zinc-400">
                          <Calendar className="h-3 w-3" />
                          {p.start_date ? formatDate(p.start_date) : '-'}
                        </span>
                      </td>

                      {/* last active */}
                      <td className="px-6 py-4">
                        {(() => {
                          const { text, stale } = timeAgo(p.last_activity);
                          return (
                            <div className="flex flex-col">
                              <span className={`flex items-center gap-1 text-sm font-medium ${
                                stale ? 'text-rose-400' : 'text-zinc-300'
                              }`}>
                                {stale && <AlertTriangle className="h-3 w-3" />}
                                {text}
                              </span>
                              {p.tge_date && (
                                <span className="mt-0.5 text-xs text-zinc-500 flex items-center gap-1">
                                  <Calendar className="h-2.5 w-2.5" />
                                  TGE: {formatDate(p.tge_date)}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* cost */}
                      <td className="px-6 py-4 font-medium text-zinc-300">
                        {(p.cost || 0) > 0 ? `$${p.cost}` : <span className="text-emerald-400">Free</span>}
                      </td>

                      {/* priority */}
                      <td className="px-6 py-4">
                        <PriorityBadge priority={p.priority} />
                      </td>

                      {/* actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-amber-500/10 hover:text-amber-400"
                            title="Edit project"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-white" title="Open">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-white" title="Favorite">
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeProject(p.id)}
                            disabled={actionLoading[p.id] === 'delete'}
                            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete from database"
                          >
                            {actionLoading[p.id] === 'delete' ? (
                              <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-zinc-700" />
                        <p className="text-sm text-zinc-500">No projects found</p>
                        <p className="text-xs text-zinc-600">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-3">
            <p className="text-xs text-zinc-500">
              Showing <span className="font-medium text-zinc-300">{filtered.length}</span> of{" "}
              <span className="font-medium text-zinc-300">{projects.length}</span> projects
            </p>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Wallet className="h-3.5 w-3.5" />
              Total invested: <span className="font-semibold text-white">${totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━ */}
        <footer className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-600">
          <Rocket className="h-3.5 w-3.5" />
          <span>Airdrop Command Center</span>
          <span>·</span>
          <span>Built with React & Tailwind CSS v4</span>
        </footer>
      </div>

      {/* ━━━━━━━━━━━━ PROJECT MODAL (Add / Edit) ━━━━━━━━━━━━ */}
      <ProjectModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditingProject(null); }}
        onSave={handleSave}
        editProject={editingProject}
      />

      {/* keyframe for modal */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}
