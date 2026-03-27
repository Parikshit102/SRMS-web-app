import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import NewComplaint from "./pages/NewComplaint";
import Reviews from "./pages/Reviews";
import NewReview from "./pages/NewReview";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";

function PrivateRoute({ children, roles }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="complaints/new" element={<NewComplaint />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="reviews/new" element={<NewReview />} />
            <Route
              path="admin"
              element={
                <PrivateRoute roles={["admin", "staff"]}>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
