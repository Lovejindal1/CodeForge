import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Welcome to CodeForge 🚀</h1>
      <p>You are logged in. This is a placeholder — build the Problem List page here next.</p>
      <button onClick={handleLogout} style={{ marginTop: "20px", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
