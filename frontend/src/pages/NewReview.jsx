import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { ArrowLeft, Send, Star } from "lucide-react";

const CATEGORIES = ["Teaching Quality", "Campus Facilities", "Library", "Hostel", "Canteen", "Sports", "Administration", "Overall Experience"];

export default function NewReview() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", category: "", rating: 0 });
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { setError("Please select a rating."); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("/reviews", form);
      navigate("/reviews");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl" style={{ fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="flex items-center gap-3 mb-8">
        <Link to="/reviews" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Write a Review</h1>
          <p className="text-white/40 text-sm mt-0.5">Share your college experience</p>
        </div>
      </div>

      <div className="bg-[#12152b] border border-white/5 rounded-2xl p-8">
        {error && (
          <div className="mb-5 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star rating */}
          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => set("rating", i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      i <= (hoverRating || form.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-white/15"
                    }`}
                  />
                </button>
              ))}
              {form.rating > 0 && (
                <span className="ml-2 self-center text-white/40 text-sm">
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]}
                </span>
              )}
            </div>
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
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Review Title</label>
              <input
                value={form.title}
                onChange={e => set("title", e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-all"
                placeholder="Short headline"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Detailed Review</label>
            <textarea
              value={form.content}
              onChange={e => set("content", e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-all resize-none"
              placeholder="Share your detailed experience, feedback, or suggestions..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/reviews" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 transition-all">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.01] transition-all disabled:opacity-60"
            >
              <Send size={15} />
              {loading ? "Submitting…" : "Publish Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
