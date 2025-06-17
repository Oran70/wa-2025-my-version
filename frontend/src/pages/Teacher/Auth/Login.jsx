import React, { useState } from "react";
import "./Login.css";
import { useLogin } from "../../../hooks/useAuth"; // Import the hook

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Use the hook to get the login function and state
  const { login, loading, error: apiError } = useLogin();

  // This function now calls the API via the hook
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setValidationError("Vul zowel e-mailadres als wachtwoord in.");
      return;
    }
    setValidationError("");
    await login(email, password);
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (!resetEmail.includes("@")) {
      setResetError("Vul een geldig e-mailadres in.");
      return;
    }
    setResetError("");
    setResetSent(true);
    console.log("Resetlink verstuurd naar:", resetEmail);
  };

  return (
      <div className="login-container">
        {!forgotPassword && (
            <form className="login-form" onSubmit={handleLogin}>
              <h2>Inloggen</h2>

              <label htmlFor="email">E-mailadres</label>
              <input
                  type="email"
                  id="email"
                  placeholder="Voer je e-mailadres in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />

              {(validationError || apiError) && <div className="error-message">{validationError || apiError}</div>}

              <label htmlFor="password">Wachtwoord</label>
              <input
                  type="password"
                  id="password"
                  placeholder="Voer je wachtwoord in"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Inloggen...' : 'Inloggen'}
              </button>

              <div
                  className="forgot-password"
                  onClick={() => setForgotPassword(true)}
              >
                Wachtwoord vergeten?
              </div>
            </form>
        )}

        {/* No changes to the code below this line */}
        {forgotPassword && !resetSent && (
            <form className="login-form" onSubmit={handleReset} noValidate>
              <h2>Wachtwoord resetten</h2>
              <label htmlFor="reset-email">E-mailadres</label>
              <input
                  type="email"
                  id="reset-email"
                  placeholder="Voer je e-mailadres in"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
              />
              {resetError && <div className="error-message">{resetError}</div>}
              <button type="submit">Verzend resetlink</button>
            </form>
        )}

        {resetSent && (
            <div className="login-form reset-confirmation">
              <h2>Resetlink verstuurd!</h2>
              <p>
                Als het e-mailadres bestaat in ons systeem, ontvang je binnenkort
                een e-mail met een link om je wachtwoord te resetten.
              </p>
              <button onClick={() => {
                setForgotPassword(false);
                setResetSent(false);
                setResetEmail("");
              }}>
                Terug naar inloggen
              </button>
            </div>
        )}
      </div>
  );
}

export default Login;