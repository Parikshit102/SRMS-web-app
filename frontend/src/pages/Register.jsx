import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Mail, Lock, User, Building } from "lucide-react";

const DEPARTMENTS = ["Computer Science", "Engineering", "Business", "Arts", "Medicine", "Law", "Science", "Other"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", department: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d34] flex items-center justify-center px-4 py-10" style={{ fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-4 shadow-lg shadow-violet-500/30">
            <GraduationCap size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-white/40 mt-2 text-sm">Join SCRMS College Portal</p>
        </div>

        <div className="bg-[#12152b] border border-white/8 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-5 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Full Name", type: "text", icon: User, placeholder: "John Smith" },
              { key: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "you@college.edu" },
              { key: "password", label: "Password", type: "password", icon: Lock, placeholder: "Min. 6 characters" },
            ].map(({ key, label, type, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500 transition-all"
                    placeholder={placeholder}
                    required
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Role</label>
              <select
                value={form.role}
                onChange={e => set("role", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition-all"
              >
                <option value="student" className="bg-[#1a1d35]">Student</option>
                <option value="staff" className="bg-[#1a1d35]">Staff</option>
                <option value="admin" className="bg-[#1a1d35]">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Department</label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <select
                  value={form.department}
                  onChange={e => set("department", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition-all"
                >
                  <option value="" className="bg-[#1a1d35]">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#1a1d35]">{d}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.01] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-white/40 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
