import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login as loginApi } from "../api/auth.api";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError("");
      const res = await loginApi(data.username, data.password);
      localStorage.setItem("token", res.token);
      toast.success("Login berhasil!");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat login";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #6366f1 100%)",
        fontFamily: "'Inter', sans-serif",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Login Card */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "var(--radius-xl, 20px)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "26px",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
            }}
          >
            📅
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#1e1b4b",
              margin: "0 0 6px",
              letterSpacing: "-0.03em",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Sign in to your Event Dashboard
          </p>
        </div>

        {/* Error */}
        {serverError && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              background: "#fef2f2",
              color: "#ef4444",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(239, 68, 68, 0.15)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Username Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e1b4b",
                  marginBottom: "6px",
                }}
              >
                Username
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="Masukkan username"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: `1.5px solid ${errors.username ? "#ef4444" : "#e2e8f0"}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#1e1b4b",
                  background: "#fff",
                  outline: "none",
                  transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "'Inter', sans-serif",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.username ? "#ef4444" : "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {errors.username && (
                <p style={{ marginTop: "4px", fontSize: "12px", color: "#ef4444", fontWeight: 500 }}>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1e1b4b",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Masukkan password"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: `1.5px solid ${errors.password ? "#ef4444" : "#e2e8f0"}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#1e1b4b",
                  background: "#fff",
                  outline: "none",
                  transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
                  fontFamily: "'Inter', sans-serif",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.password ? "#ef4444" : "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {errors.password && (
                <p style={{ marginTop: "4px", fontSize: "12px", color: "#ef4444", fontWeight: 500 }}>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              marginTop: "26px",
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              background: isSubmitting
                ? "#94a3b8"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: isSubmitting ? "none" : "0 4px 14px rgba(99, 102, 241, 0.35)",
              fontFamily: "'Inter', sans-serif",
              opacity: isSubmitting ? 0.7 : 1,
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(99, 102, 241, 0.35)";
              }
            }}
          >
            {isSubmitting && (
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75" />
              </svg>
            )}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer hint */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#94a3b8",
            marginTop: "24px",
            marginBottom: 0,
          }}
        >
          Event Dashboard • Technical Test
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
