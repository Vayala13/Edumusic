import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await signup(email, password);
      navigate("/"); // send them to the home page once account is created
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else {
        setError("Something went wrong. Please try again.");
      }
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
            <p className="auth-eyebrow">GET STARTED</p>
            <h1>Create an account</h1>
            <p>
              Start your musical journey with Edumusic.
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span className="auth-hint">
                Use at least 6 characters.
              </span>
            </div>

            <button
              type="submit"
              className="auth-submit"
            >
              Create Account
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>Already a member?</span>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>

        </section>

        <p className="auth-footer">
          Learn • Practice • Play
        </p>
      </main>
    </div>
  );
}

export default Signup;