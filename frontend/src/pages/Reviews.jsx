import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Plus, Star, Loader, Trash2 } from "lucide-react";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={13}
          className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = catFilter ? { category: catFilter } : {};
      const res = await api.get("/reviews", { params });
      setReviews(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [catFilter]);

  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;
    await api.delete(`/reviews/${id}`);
    fetchReviews();
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const categories = [...new Set(reviews.map(r => r.category))];

  return (
    <div className="space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Reviews</h1>
          <p className="text-white/40 text-sm mt-1">{reviews.length} reviews · Avg {avgRating}/5</p>
        </div>
        <Link to="/reviews/new" className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all">
          <Plus size={15} /> Write Review
        </Link>
      </div>

      {/* Avg rating visual */}
      {reviews.length > 0 && (
        <div className="bg-[#12152b] border border-white/5 rounded-2xl p-5 flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">{avgRating}</p>
            <StarRating rating={Math.round(parseFloat(avgRating))} />
            <p className="text-white/30 text-xs mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(s => {
              const cnt = reviews.filter(r => Math.round(r.rating) === s).length;
              const pct = reviews.length ? Math.round((cnt / reviews.length) * 100) : 0;
              return (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-white/30 text-xs w-4">{s}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-white/30 text-xs w-6">{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCatFilter("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!catFilter ? "bg-violet-600 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
          >All</button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${catFilter === c ? "bg-violet-600 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
            >{c}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader className="animate-spin text-violet-500" size={24} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-[#12152b] rounded-2xl border border-white/5">
          <Star size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No reviews yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-[#12152b] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <StarRating rating={Math.round(r.rating)} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-lg">{r.category}</span>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => deleteReview(r.id)}
                      className="opacity-0 group-hover:opacity-100 text-rose-400/60 hover:text-rose-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{r.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed line-clamp-3">{r.content}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <span className="text-white/30 text-xs">{r.user?.name || "Anonymous"}</span>
                <span className="text-white/20 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
