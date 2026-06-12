import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AuthCallback() {
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userRaw = params.get("user");

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        login(user, token);
        window.location.replace("/");
      } catch {
        window.location.replace("/");
      }
    } else {
      window.location.replace("/");
    }
  }, []);

  return (
    <main className="auth-page">
      <p style={{ color: "#fff", fontSize: "18px" }}>Signing you in...</p>
    </main>
  );
}

export default AuthCallback;
