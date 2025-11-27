import React, { useState } from "react";

type Props = {
  setUserWasCreated: React.Dispatch<React.SetStateAction<boolean>>;
};

const API_URL =
  "https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicWFzaW0ucnNsNzg2QGdtYWlsLmNvbSJdLCJpc3MiOiJoZW5uZ2UtYWRtaXNzaW9uLWNoYWxsZW5nZSIsInN1YiI6ImNoYWxsZW5nZSJ9.4W8pjxzBNUHcuHgEYpBMVLh44bYEYesjchvl2qqAV-k";

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 10)
    errors.push("Password must be at least 10 characters long");
  if (password.length > 24)
    errors.push("Password must be at most 24 characters long");
  if (/\s/.test(password))
    errors.push("Password cannot contain spaces");
  if (!/[0-9]/.test(password))
    errors.push("Password must contain at least one number");
  if (!/[A-Z]/.test(password))
    errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password))
    errors.push("Password must contain at least one lowercase letter");
  return errors;
}

export default function CreateUserForm({ setUserWasCreated }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [clientErrors, setClientErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // For aria-errormessage
  const usernameErrorId = "username-error";
  const passwordErrorId = "password-error";
  const apiErrorId = "api-error";

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setClientErrors(validatePassword(e.target.value));
    setApiError(null);
    setSubmitted(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setApiError(null);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSubmitted(true);

    const errors = validatePassword(password);
    setClientErrors(errors);

    if (!username || errors.length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 401 || res.status === 403) {
        setApiError("Not authenticated to access this resource.");
      } else if (res.status === 500) {
        setApiError("Something went wrong, please try again.");
      } else if (res.status === 400) {
        const data = await res.json();
        if (
          data?.error &&
          data.error.toLowerCase().includes("password not allowed")
        ) {
          setApiError(
            "Sorry, the entered password is not allowed, please try a different one."
          );
        } else {
          setApiError("Something went wrong, please try again.");
        }
      } else if (res.ok) {
        setUserWasCreated(true);
      } else {
        setApiError("Something went wrong, please try again.");
      }
    } catch {
      setApiError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Determine aria-invalid for username and password
  const usernameInvalid = submitted && !username;
  const passwordInvalid = submitted && clientErrors.length > 0;

  return (
    <div style={formWrapper}>
      <form onSubmit={handleSubmit} style={form} noValidate>
        <div>
          <label htmlFor="username-input">
            Username
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              disabled={loading}
              aria-required="true"
              aria-invalid={usernameInvalid ? "true" : "false"}
              aria-errormessage={usernameInvalid ? usernameErrorId : undefined}
              style={formInput}
            />
          </label>
          {usernameInvalid && (
            <div
              id={usernameErrorId}
              className="form-errors"
              role="alert"
              style={{ color: "red", marginTop: "4px" }}
            >
              Please enter a username.
            </div>
          )}
        </div>
        <div>
          <label htmlFor="password-input">
            Password
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              aria-required="true"
              aria-invalid={passwordInvalid ? "true" : "false"}
              aria-errormessage={passwordInvalid ? passwordErrorId : undefined}
              style={formInput}
            />
          </label>
          {passwordInvalid && (
            <ul
              id={passwordErrorId}
              className="form-errors"
              role="alert"
              style={{ color: "red", marginTop: "4px" }}
            >
              {clientErrors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
        {/* API error messages */}
        {apiError && (
          <div
            id={apiErrorId}
            className="api-error"
            role="alert"
            style={{ color: "red", marginTop: "8px" }}
          >
            {apiError}
          </div>
        )}
        <button type="submit" disabled={loading} style={formButton}>
          Create User
        </button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};

