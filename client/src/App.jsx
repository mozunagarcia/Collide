import {useState} from "react";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Swipe from "./pages/Swipe";
import ProfileForm from "./components/profile/ProfileForm";

function App() {
  const [page, setPage] = useState("login");

  function saveDemoProfile(profileData) {
    const demoProfile = {
      fullName:"Demo Student",
      email:"demo@ucr.edu",
      courseCode:"CS110",
      signUpCode:"COLLIDE",
      matchPercent:92,
      ...profileData
    };

    localStorage.setItem("collideProfile", JSON.stringify(demoProfile));
    setPage("profile");
  }

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
  } else if (page === "chat") {
    currentPage = (
      <Chat setPage={setPage} />
    );
  } else if (page === "personalization") {
    currentPage = (
      <ProfileForm
        initialProfile={{
          profilePhoto:"",
          displayName:"Demo Student",
          pronouns:"Do not display",
          customPronouns:"",
          major:"Computer Science",
          year:"4th Year",
          bio:"Looking for teammates who communicate well and want to finish projects early.",
          skills:[
            "React",
            "Python",
            "Git/GitHub"
          ]
        }}
        onSave={saveDemoProfile}
        buttonText="Save Demo Profile"
      />
    );
  } else {
    currentPage = (
      <LoginForm setPage={setPage} />
    );
  }

  return (
    <main className="auth-page">
      <div className="top-demo-buttons">
        <button
          className="demo-button"
          onClick={() => setPage("login")}
        >
          Login
        </button>

        <button
          className="demo-button"
          onClick={() => setPage("register")}
        >
          Register
        </button>

        <button
          className="demo-button"
          onClick={() => setPage("personalization")}
        >
          Personalization Demo
        </button>

        <button
          className="demo-button"
          onClick={() => setPage("swipe")}
        >
          Swipe
        </button>

        <button
          className="demo-button"
          onClick={() => setPage("profile")}
        >
          Profile
        </button>

        <button
          className="demo-button"
          onClick={() => setPage("chat")}
        >
          Chat
        </button>
      </div>

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

        <div
          className={
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