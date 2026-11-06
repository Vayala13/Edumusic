import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resetting, setResetting] = useState(false);

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Firebase login error:", err.code, err.message, err);
      setError(
        [err.code, err.message].filter(Boolean).join(" — ") ||
          "Incorrect email or password."
      );
    }
  }

  async function handleReset() {
    setError("");
    setInfo("");

    if (!email) {
      setError("Enter your email first, then click Forgot password.");
      return;
    }

    setResetting(true);
    try {
      await resetPassword(email);
      setInfo(`Reset link sent to ${email}. Check inbox and spam.`);
    } catch (err) {
      console.error("Firebase reset error:", err.code, err.message, err);
      setError(
        [err.code, err.message].filter(Boolean).join(" — ") ||
          "Could not send reset email."
      );
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-glow auth-glow-one"></div>
        <div className="auth-glow auth-glow-two"></div>
      </div>

      <main className="auth-container">
        <section className="auth-card">

          <div className="auth-brand">
            <div className="auth-brand-icon">🎻</div>
            <span>Edumusic</span>
          </div>

          <div className="auth-heading">
            <p className="auth-eyebrow">WELCOME BACK</p>
            <h1>Log in</h1>
            <p>
              Continue your musical journey.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {info && (
            <div className="auth-info">
              <span>✓</span>
              <p>{info}</p>
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="auth-forgot"
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? "Sending reset link…" : "Forgot password?"}
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit"
            >
              Log In
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>New to Edumusic?</span>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Sign up</Link>
          </p>

        </section>

        <p className="auth-footer">
          Learn • Practice • Play
        </p>
      </main>
    </div>
  );
}

export default Login;