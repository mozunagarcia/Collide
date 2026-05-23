import { useState } from "react";

function LoginForm({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    if (
      email === "test@ucr.edu" &&
      password === "1234"
    ) {
      setPage("swipe");
    } else {
      alert("Invalid login");
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

      <button className="main-button" type="submit">
        Login
      </button>

      <div className="form-links">
        <button
          className="link-button"
          type="button"
          onClick={() => setPage("register")}
        >
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