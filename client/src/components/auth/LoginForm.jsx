import { useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

function LoginForm({ setPage }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });
      login(data.user, data.token);
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
          required
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
          required
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button className="main-button" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="form-links">
        <button
          className="link-button"
          type="button"
          onClick={() => setPage("register")}
        >
          Create an account
        </button>

      </div>
    </form>
  );
}

export default LoginForm;
