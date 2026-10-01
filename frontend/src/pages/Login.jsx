import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Incorrect email or password.");
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