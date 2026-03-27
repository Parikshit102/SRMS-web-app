import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Plus, Filter, Loader, MessageSquareWarning, ChevronRight } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  rejected: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const PRIORITY_COLORS = {
  low: "text-gray-400",
  medium: "text-amber-400",
  high: "text-rose-400",
};

export default function Complaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", category: "" });
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.category) params.category = filter.category;
      const res = await api.get("/complaints", { params });
      setComplaints(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, [filter]);

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await api.patch(`/complaints/${id}/status`, { status, response });
      setSelected(null);
      setResponse("");
      fetchComplaints();
    } catch {}
    finally { setUpdating(false); }
  };

  const deleteComplaint = async (id) => {
    if (!confirm("Delete this complaint?")) return;
    await api.delete(`/complaints/${id}`);
    setSelected(null);
    fetchComplaints();
  };

  const categories = [...new Set(complaints.map(c => c.category))];

  return (
    <div className="space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Complaints</h1>
          <p className="text-white/40 text-sm mt-1">{complaints.length} total complaints</p>
        </div>
        <Link to="/complaints/new" className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all">
          <Plus size={15} /> New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="px-4 py-2 bg-[#12152b] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
        >
          <option value="">All Statuses</option>
          {["pending", "in_progress", "resolved", "rejected"].map(s => (
            <option key={s} value={s} className="bg-[#1a1d35]">{s.replace("_", " ")}</option>
          ))}
        </select>
        {categories.length > 0 && (
          <select
            value={filter.category}
            onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
            className="px-4 py-2 bg-[#12152b] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c} className="bg-[#1a1d35]">{c}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader className="animate-spin text-violet-500" size={24} />
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-20 bg-[#12152b] rounded-2xl border border-white/5">
          <MessageSquareWarning size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className="bg-[#12152b] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[c.status] || ""}`}>
                      {c.status.replace("_", " ")}
                    </span>
                    <span className={`text-xs font-semibold capitalize ${PRIORITY_COLORS[c.priority] || ""}`}>
                      ↑ {c.priority}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm">{c.title}</h3>
                  <p className="text-white/40 text-xs mt-1 truncate">{c.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                    <span>{c.category}</span>
                    <span>·</span>
                    <span>{c.user?.name || "Unknown"}</span>
                    <span>·</span>
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <ChevronRight size={16} className={`text-white/20 transition-transform mt-1 ${selected?.id === c.id ? "rotate-90" : ""}`} />
              </div>

              {/* Expanded */}
              {selected?.id === c.id && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3" onClick={e => e.stopPropagation()}>
                  <p className="text-white/60 text-sm leading-relaxed">{c.description}</p>
                  {c.staff_response && (
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3">
                      <p className="text-violet-300 text-xs font-bold mb-1">Staff Response</p>
                      <p className="text-white/70 text-sm">{c.staff_response}</p>
                    </div>
                  )}

                  {(user?.role === "admin" || user?.role === "staff") && (
                    <div className="space-y-3 pt-2">
                      <textarea
                        value={response}
                        onChange={e => setResponse(e.target.value)}
                        placeholder="Add a response (optional)..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 resize-none"
                      />
                      <div className="flex gap-2 flex-wrap">
                        {["in_progress", "resolved", "rejected"].map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(c.id, s)}
                            disabled={updating}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white capitalize transition-all"
                          >
                            Mark {s.replace("_", " ")}
                          </button>
                        ))}
                        {user?.role === "admin" && (
                          <button
                            onClick={() => deleteComplaint(c.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 transition-all"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
