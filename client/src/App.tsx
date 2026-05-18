import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-lg)",
            padding: "14px 20px",
          },
          success: {
            iconTheme: {
              primary: "var(--color-success)",
              secondary: "#fff",
            },
            style: {
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-danger)",
              secondary: "#fff",
            },
            style: {
              background: "var(--color-danger-light)",
              color: "var(--color-danger)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
            },
          },
        }}
      />
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
