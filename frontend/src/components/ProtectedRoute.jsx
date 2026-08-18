import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  // While AuthContext is verifying the token on page load, show a spinner
  // This prevents the "flash" where a logged-in user briefly sees the /login page
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        gap: "14px",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-base)",
      }}>
        <div className="spinner" />
        <p style={{ fontSize: "13px", margin: 0 }}>Verifying session...</p>
      </div>
    );
  }

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
