import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { ArrowLeft, Send } from "lucide-react";

const CATEGORIES = ["Academic", "Hostel", "Library", "Transport", "Administration", "Faculty", "Infrastructure", "IT Services", "Fee / Finance", "Other"];
const PRIORITIES = ["low", "medium", "high"];

export default function NewComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "", priority: "medium" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/complaints", form);
      navigate("/complaints");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl" style={{ fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="flex items-center gap-3 mb-8">
        <Link to="/complaints" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">New Complaint</h1>
          <p className="text-white/40 text-sm mt-0.5">Describe your issue in detail</p>
        </div>
      </div>

      <div className="bg-[#12152b] border border-white/5 rounded-2xl p-8">
        {error && (
          <div className="mb-5 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Complaint Title</label>
            <input
              value={form.title}
              onChange={e => set("title", e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-all"
              placeholder="Brief title for your complaint"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition-all"
              >
                <option value="" className="bg-[#1a1d35]">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1d35]">{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set("priority", p)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      form.priority === p
                        ? p === "high" ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                          : p === "medium" ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                          : "bg-gray-500/20 border-gray-500/40 text-gray-400"
                        : "bg-white/3 border-white/10 text-white/30 hover:border-white/20"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-all resize-none"
              placeholder="Describe your complaint in detail. Include specific dates, names, or incident details..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/complaints" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-all">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.01] transition-all disabled:opacity-60"
            >
              <Send size={15} />
              {loading ? "Submitting…" : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
