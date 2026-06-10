import { useState } from "react";
import ProfileForm from "../profile/ProfileForm";

function RegisterForm({ setPage }) {
  const [step, setStep] = useState("account");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [signUpCode, setSignUpCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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

  function handleAccountSubmit(event) {
    event.preventDefault();

    if (fullName.trim().length === 0) {
      setError("Please enter your name");
      return;
    } else if (!emailValid) {
      setError("Please enter a valid UCR email");
      return;
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else {
      setError("");
      setStep("profile");
    }
  }

  function handleProfileSave(profileData) {
    const accountData = {
      fullName: fullName.trim(),
      email: email.trim(),
      major: major.trim(),
      year: year.trim(),
      courseCode: courseCode.trim(),
      signUpCode: signUpCode.trim()
    };

    const newProfile = {
      ...accountData,
      ...profileData,
      matchPercent: 92
    };

    localStorage.setItem("collideProfile", JSON.stringify(newProfile));
    setPage("profile");
  }

  const passwordStrength = getPasswordStrength();

  if (step === "profile") {
    return (
      <ProfileForm
        initialProfile={{
          profilePhoto: "",
          displayName: fullName,
          pronouns: "Do not display",
          customPronouns: "",
          major,
          year,
          bio: "",
          skills: []
        }}
        onSave={handleProfileSave}
        buttonText="Create Account"
      />
    );
  } else {
    return (
      <form className="form" onSubmit={handleAccountSubmit}>
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
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
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
            <input
              className="input-field"
              type="text"
              placeholder="4th Year"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </label>
        </div>

        <div className="input-row">
          <label className="input-group">
            <span className="input-label">Course Code</span>
            <input
              className="input-field"
              type="text"
              placeholder="CS170"
              value={courseCode}
              onChange={(event) => setCourseCode(event.target.value)}
            />
          </label>

          <label className="input-group">
            <span className="input-label">Sign-up Code</span>
            <input
              className="input-field"
              type="text"
              placeholder="Course code"
              value={signUpCode}
              onChange={(event) => setSignUpCode(event.target.value)}
            />
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

        {error.length > 0 && (
          <p className="error-text">{error}</p>
        )}

        <button className="main-button" type="submit">
          Continue to Profile
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
}

export default RegisterForm;