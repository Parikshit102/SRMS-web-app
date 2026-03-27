import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../utils/api";
import {
  MessageSquareWarning, Star, Users, CheckCircle,
  Clock, XCircle, Loader, Plus, TrendingUp
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-[#12152b] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {sub && <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-lg">{sub}</span>}
      </div>
      <p className="text-3xl font-extrabold text-white mb-1">{value ?? "—"}</p>
      <p className="text-white/40 text-sm font-medium">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role !== "student") {
          const res = await api.get("/stats/dashboard");
          setStats(res.data);
        } else {
          const res = await api.get("/complaints");
          setMyComplaints(res.data);
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-60">
      <Loader className="animate-spin text-violet-500" size={28} />
    </div>
  );

  const statusBadge = {
    pending: "bg-amber-500/15 text-amber-400",
    in_progress: "bg-blue-500/15 text-blue-400",
    resolved: "bg-emerald-500/15 text-emerald-400",
    rejected: "bg-rose-500/15 text-rose-400",
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Hello, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {user?.department ? `${user.department} · ` : ""}{user?.role?.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/complaints/new"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all">
            <Plus size={15} /> New Complaint
          </Link>
        </div>
      </div>

      {/* Admin/Staff Stats */}
      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={MessageSquareWarning} label="Total Complaints" value={stats.total_complaints} color="bg-violet-600" />
            <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-amber-500" />
            <StatCard icon={CheckCircle} label="Resolved" value={stats.resolved} color="bg-emerald-500" />
            <StatCard icon={Users} label="Total Users" value={stats.total_users} color="bg-indigo-500" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Loader} label="In Progress" value={stats.in_progress} color="bg-blue-500" />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="bg-rose-500" />
            <StatCard icon={Star} label="Total Reviews" value={stats.total_reviews} color="bg-yellow-500" />
            <StatCard icon={TrendingUp} label="Avg. Rating" value={stats.avg_rating ? `${stats.avg_rating}/5` : "N/A"} color="bg-pink-500" />
          </div>

          {/* By category */}
          {stats.by_category.length > 0 && (
            <div className="bg-[#12152b] border border-white/5 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-5">Complaints by Category</h2>
              <div className="space-y-3">
                {stats.by_category.map(({ category, count }) => {
                  const pct = Math.round((count / stats.total_complaints) * 100);
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-white/70 font-medium">{category}</span>
                        <span className="text-white/40">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Student view */}
      {user?.role === "student" && (
        <div className="bg-[#12152b] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-base">My Complaints</h2>
            <span className="text-xs text-white/30">{myComplaints.length} total</span>
          </div>

          {myComplaints.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquareWarning size={36} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No complaints yet.</p>
              <Link to="/complaints/new" className="inline-block mt-4 text-violet-400 text-sm hover:text-violet-300">
                + Submit your first complaint
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myComplaints.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-white/3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div>
                    <p className="text-white text-sm font-semibold">{c.title}</p>
                    <p className="text-white/30 text-xs mt-0.5">{c.category} · {new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusBadge[c.status] || ""}`}>
                    {c.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
