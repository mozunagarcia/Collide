import { useState } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

function LoginForm({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user, response.data.token);
      setPage("swipe");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleLogin}>
      <div className="form-header">
        <h1 className="form-title">Login</h1>
        <p className="form-subtitle">Welcome back to Collide</p>
      </div>

      <label className="input-group">
        <span className="input-label">Email</span>
        <input
          className="input-field"
          type="email"
          placeholder="name@ucr.edu"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="input-group">
        <span className="input-label">Password</span>
        <input
          className="input-field"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button className="main-button" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="form-links">
        <button className="link-button" type="button" onClick={() => setPage("register")}>
          Create an account
        </button>

        <button className="link-button" type="button">
          Forgot password
        </button>
      </div>
    </form>
  );
}

export default LoginForm;