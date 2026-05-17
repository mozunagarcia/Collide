import { useState } from "react";

function RegisterForm({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailValid = email.endsWith("@ucr.edu");

  function getPasswordStrength() {
    if (password.length < 6) {
      return "Weak";
    } else if (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return "Strong";
    } else {
      return "Medium";
    }
  }

  const passwordStrength = getPasswordStrength();

  return (
    <form className="form">
      <div className="form-header">
        <h1 className="form-title">Register</h1>
        <p className="form-subtitle">Create your Collide account</p>
      </div>

      <div className="input-row">
        <label className="input-group">
          <span className="input-label">Full Name</span>
          <input className="input-field" type="text" placeholder="Your name" />
        </label>

        <label className="input-group">
          <span className="input-label">Email</span>
          <input
            className="input-field"
            type="email"
            placeholder="name@ucr.edu"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          {!emailValid && email.length > 0 && (
            <p className="error-text">Please enter a valid UCR email</p>
          )}
        </label>
      </div>

      <div className="input-row">
        <label className="input-group">
          <span className="input-label">Major</span>
          <input className="input-field" type="text" placeholder="Computer Science" />
        </label>

        <label className="input-group">
          <span className="input-label">Year</span>
          <input className="input-field" type="text" placeholder="4th Year" />
        </label>
      </div>

      <div className="input-row">
        <label className="input-group">
          <span className="input-label">Course Code</span>
          <input className="input-field" type="text" placeholder="CS170" />
        </label>

        <label className="input-group">
          <span className="input-label">Sign-up Code</span>
          <input className="input-field" type="text" placeholder="Course code" />
        </label>
      </div>

      <label className="input-group">
        <span className="input-label">Password</span>
        <input
          className="input-field"
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <p className="strength-text">Password Strength: {passwordStrength}</p>
      </label>

      <label className="input-group">
        <span className="input-label">Confirm Password</span>
        <input
          className="input-field"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        {password !== confirmPassword && confirmPassword.length > 0 && (
          <p className="error-text">Passwords do not match</p>
        )}
      </label>

      <button className="main-button" type="submit">
        Create Account
      </button>

      <p className="switch-text">
        Already have an account?
        <button className="switch-button" type="button" onClick={() => setPage("login")}>
          Login
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;