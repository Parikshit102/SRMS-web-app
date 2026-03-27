import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Users, Loader, Trash2 } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-amber-500/15 text-amber-400",
  in_progress: "bg-blue-500/15 text-blue-400",
  resolved: "bg-emerald-500/15 text-emerald-400",
  rejected: "bg-rose-500/15 text-rose-400",
};

const PRIORITY_COLORS = {
  low: "text-gray-400",
  medium: "text-amber-400",
  high: "text-rose-400",
};

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [u, c] = await Promise.all([
          api.get("/users"),
          api.get("/complaints"),
        ]);
        setUsers(u.data);
        setComplaints(c.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const deleteComplaint = async (id) => {
    if (!confirm("Delete this complaint?")) return;
    await api.delete(`/complaints/${id}`);
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-60">
      <Loader className="animate-spin text-violet-500" size={24} />
    </div>
  );

  return (
    <div className="space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div>
        <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
        <p className="text-white/40 text-sm mt-1">Manage users and all records</p>
      </div>

      {/* Users Table */}
      <div className="bg-[#12152b] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Users size={16} className="text-violet-400" />
          <h2 className="text-white font-bold text-sm">All Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Name", "Email", "Role", "Department", "Joined"].map(h => (
                  <th key={h} className="text-left pb-3 text-white/30 text-xs font-bold uppercase tracking-wider pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/3 hover:bg-white/2">
                  <td className="py-3 pr-6 text-white font-semibold text-xs">{u.name}</td>
                  <td className="py-3 pr-6 text-white/40 text-xs">{u.email}</td>
                  <td className="py-3 pr-6">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                      u.role === "admin" ? "bg-rose-500/15 text-rose-400"
                      : u.role === "staff" ? "bg-amber-500/15 text-amber-400"
                      : "bg-sky-500/15 text-sky-400"
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 pr-6 text-white/40 text-xs">{u.department || "—"}</td>
                  <td className="py-3 text-white/40 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-[#12152b] border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-bold text-sm mb-5">All Complaints ({complaints.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Title", "By", "Category", "Priority", "Status", "Date", ""].map(h => (
                  <th key={h} className="text-left pb-3 text-white/30 text-xs font-bold uppercase tracking-wider pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id} className="border-b border-white/3 hover:bg-white/2">
                  <td className="py-3 pr-4 text-white font-semibold text-xs max-w-[160px] truncate">{c.title}</td>
                  <td className="py-3 pr-4 text-white/40 text-xs">{c.user?.name || "—"}</td>
                  <td className="py-3 pr-4 text-white/40 text-xs">{c.category}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-bold capitalize ${PRIORITY_COLORS[c.priority]}`}>{c.priority}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[c.status] || ""}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-white/40 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button onClick={() => deleteComplaint(c.id)} className="text-rose-400/50 hover:text-rose-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
