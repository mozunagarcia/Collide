import { useState, useContext } from "react";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Swipe from "./pages/Swipe";
import Matches from "./pages/Matches";
import GroupSpace from "./pages/GroupSpace";
import Admin from "./pages/Admin";
import { AuthContext } from "./context/AuthContext";


function App() {
  const { user, logout } = useContext(AuthContext);
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    return token && savedUser ? "swipe" : "login";
  });
  const [chatMatchId, setChatMatchId] = useState(null);

  let currentPage;

  if (page === "login") {
    currentPage = (
      <LoginForm setPage={setPage} />
    );
  } else if (page === "register") {
    currentPage = (
      <RegisterForm setPage={setPage} />
    );
  } else if (page === "swipe") {
    currentPage = (
      <Swipe setPage={setPage} />
    );
  } else if (page === "profile") {
    currentPage = (
      <Profile setPage={setPage} />
    );
  } else if (page === "matches") {
    currentPage = (
      <Matches setPage={setPage} setChatMatchId={setChatMatchId} />
    );
  } else if (page === "chat") {
    currentPage = (
      <Chat setPage={setPage} matchId={chatMatchId} />
    );
    } else if (page === "groupspace") {
    currentPage = (
    <GroupSpace setPage={setPage} />
     );
     } else if (page === "admin") {
      currentPage = (
        <Admin setPage={setPage} />
      );
  } else {
    currentPage = (
      <LoginForm setPage={setPage} />
    );
  }

return (
  <main className="auth-page">
    {user && page !== "login" && page !== "register" && (
      <div className="top-demo-buttons">
        <button className="demo-button" onClick={() => setPage("swipe")}>Swipe</button>
        <button className="demo-button" onClick={() => setPage("matches")}>Matches</button>
        <button className="demo-button" onClick={() => setPage("profile")}>Profile</button>
        <button className="demo-button" onClick={() => setPage("chat")}>Chat</button>
        <button className="demo-button" onClick={() => setPage("groupspace")}>Groupspace</button>
        {user && user.isAdmin && (
          <button className="demo-button" onClick={() => setPage("admin")}>Admin</button>
          )}
        <button className="demo-button demo-button-logout" onClick={() => { logout(); setPage("login"); }}>Log Out</button>
      </div>
    )}

    <section className="auth-card">
      {(page === "login" || page === "register") && (
        <div className="auth-image">
          <div className="welcome-content">
            <h1 className="welcome-title">
              Collide
            </h1>

            <p className="welcome-text">
              Find your group ahead...
            </p>
          </div>
        </div>
      )}

      <div className={
            page === "login" || page === "register"
              ? "auth-form-box"
              : "auth-form-box auth-form-box-full"
        }
      >
        {currentPage}
      </div>
    </section>
  </main>
);
}

export default App;
