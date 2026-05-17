function LoginForm({ setPage }) {
  return (
    <form className="form">
      <div className="form-header">
        <h1 className="form-title">Login</h1>
        <p className="form-subtitle">Welcome back to Collide</p>
      </div>

      <label className="input-group">
        <span className="input-label">Email</span>
        <input className="input-field" type="email" placeholder="name@ucr.edu" />
      </label>

      <label className="input-group">
        <span className="input-label">Password</span>
        <input className="input-field" type="password" placeholder="Enter password" />
      </label>

      <button className="main-button" type="submit">
        Login
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