import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/app.scss";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await login(username, password);

      toast.success("Đăng nhập thành công!");

      const userRole = userData.role;
      console.log("LoginPage: User role for redirection:", userRole);

      if (userRole === "doctor" || userRole === "Doctor") {
        console.log("LoginPage: Redirecting to doctor dashboard...");
        navigate("/doctor", { replace: true });
      } else if (userRole === "manager" || userRole === "Manager") {
        console.log("LoginPage: Redirecting to manager dashboard...");
        navigate("/manager", { replace: true });
      } else {
        console.log("LoginPage: Redirecting to home (unknown role)...");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("LoginPage: Login error:", error);
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="z-50"
        toastClassName="bg-white shadow-lg rounded-lg"
      />

      <div className="login-card">
        <div className="text-center">
          <h2 className="login-title">Đăng nhập</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="form-input"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="form-input"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="checkbox-container">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="checkbox-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="checkbox-label">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="login-submit-button"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="spinner h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
