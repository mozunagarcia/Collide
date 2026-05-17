import { useState } from "react";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

function App() {
  const [page, setPage] = useState("login");

  let currentPage;

  if (page === "login") {
    currentPage = <LoginForm setPage={setPage} />;
  } else {
    currentPage = <RegisterForm setPage={setPage} />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
      <div className="auth-image">
        <h1 className="welcome-title">Welcome</h1>
        <p className="welcome-text">Find your group ahead...</p>
      </div>
        <div className="auth-form-box">
          {currentPage}
        </div>
      </section>
    </main>
  );
}

export default App;