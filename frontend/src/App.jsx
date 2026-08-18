import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login        from "./pages/Login";
import Register     from "./pages/Register";
import ProblemList  from "./pages/ProblemList";
import ProblemDetail from "./pages/ProblemDetail";
import Submissions  from "./pages/Submissions";
import Profile      from "./pages/Profile";
import NotFound     from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider must be inside BrowserRouter so useNavigate works inside it */}
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/problems" element={
            <ProtectedRoute><ProblemList /></ProtectedRoute>
          } />

          <Route path="/problems/:id" element={
            <ProtectedRoute><ProblemDetail /></ProtectedRoute>
          } />

          <Route path="/submissions" element={
            <ProtectedRoute><Submissions /></ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/problems" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;