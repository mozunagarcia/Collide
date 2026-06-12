import { useState } from "react";
import api from "../../utils/api";

function RegisterForm({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    major: "",
    year: "",
    signUpCode: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const emailValid = form.email.endsWith("@ucr.edu");

  function getPasswordStrength() {
    if (form.password.length < 6) return "Weak";
    if (/[A-Z]/.test(form.password) && /[0-9]/.test(form.password)) return "Strong";
    return "Medium";
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!emailValid) {
      return setError("Please enter a valid UCR email");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        major: form.major,
        year: form.year,
        signUpCode: form.signUpCode,
        password: form.password,
      });

      setSuccess(data.message);

      setForm({
        name: "",
        email: "",
        major: "",
        year: "",
        signUpCode: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
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
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="input-group">
          <span className="input-label">Email</span>
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="name@ucr.edu"
            value={form.email}
            onChange={handleChange}
            required
          />
          {!emailValid && form.email.length > 0 && (
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
            name="major"
            placeholder="Computer Science"
            value={form.major}
            onChange={handleChange}
          />
        </label>

        <label className="input-group">
          <span className="input-label">Year</span>
          <select
            className="input-field"
            name="year"
            value={form.year}
            onChange={handleChange}
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

      <div className="input-row">
        <label className="input-group">
          <span className="input-label">Sign-up Code</span>
          <input
            className="input-field"
            type="text"
            name="signUpCode"
            placeholder="CS170-TEST"
            value={form.signUpCode}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label className="input-group">
        <span className="input-label">Password</span>
        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <p className="strength-text">Password Strength: {getPasswordStrength()}</p>
      </label>

      <label className="input-group">
        <span className="input-label">Confirm Password</span>
        <input
          className="input-field"
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        {form.password !== form.confirmPassword && form.confirmPassword.length > 0 && (
          <p className="error-text">Passwords do not match</p>
        )}
      </label>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

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