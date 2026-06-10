import { useState } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

function RegisterForm({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [signUpCode, setSignUpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const emailValid = email.endsWith("@ucr.edu");

  function getPasswordStrength() {
    if (password.length < 6) {
      return "Weak";
    } else if (password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return "Strong";
    } else {
      return "Medium";
    }
  }

  const passwordStrength = getPasswordStrength();

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    if (!emailValid) {
      setError("Please enter a valid UCR email");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        signUpCode,
        major,
        year,
      });

      login(response.data.user, response.data.token);
      setPage("swipe");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleRegister}>
      <div className="form-header">
        <h1 className="form-title">Register</h1>
        <p className="form-subtitle">Create your Collide account</p>
      </div>

      <div className="input-row">
        <label className="input-group">
          <span className="input-label">Full Name</span>
          <input
            className="input-field"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
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
          <input
            className="input-field"
            type="text"
            placeholder="Computer Science"
            value={major}
            onChange={(event) => setMajor(event.target.value)}
          />
        </label>

        <label className="input-group">
          <span className="input-label">Year</span>
          <select
            className="input-field"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            <option value="">Select year</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Graduate">Graduate</option>
          </select>
        </label>
      </div>

      <label className="input-group">
        <span className="input-label">Sign-up Code</span>
        <input
          className="input-field"
          type="text"
          placeholder="Enter sign-up code"
          value={signUpCode}
          onChange={(event) => setSignUpCode(event.target.value)}
        />
      </label>

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

      {error && <p className="error-text">{error}</p>}

      <button className="main-button" type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
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
