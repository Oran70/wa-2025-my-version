import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vul zowel e-mailadres als wachtwoord in.");
      return;
    }

    setError("");
    console.log("Inloggen met:", email, password);
    // inlogverwerking
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
    // resetverwerking
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
          {error && <div className="error-message">{error}</div>}

          <label htmlFor="password">Wachtwoord</label>
          <input
            type="password"
            id="password"
            placeholder="Voer je wachtwoord in"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Inloggen</button>

          <div
            className="forgot-password"
            onClick={() => setForgotPassword(true)}
          >
            Wachtwoord vergeten?
          </div>
        </form>
      )}

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
