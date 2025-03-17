import React, { useState, useEffect } from 'react';
import { loginUser } from '../../../FrontendRequests/Requests-Api/User';

export default function Loginformular() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check fields validity on input change
    const isValid = password.trim() !== '' && email.trim() !== '' && isValidEmail(email.trim());
    setIsButtonDisabled(!isValid);
  }, [email, password]);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.trim() !== '' && email.trim() !== '') {
      const result = await loginUser(email.trim(), password.trim());
      if (result) {
        window.location.href = '/';
      } else {
        setErrorMessage('Login ikke korrekt. Prøv igen');
      }
    } else {
      setErrorMessage('Felterne skal udfyldes korrekt');
    }
  };

  return (
    <>
      <section className="bg-gray-100 d-flex justify-content-center align-items-center">
        <div className="row w-100">
          <div className="col-12 col-lg-6 p-3 p-md-5 mx-auto">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  id="emailbox"
                  type="email"
                  className="form-control"
                  placeholder="Indtast din email addresse"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Kodeord</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter din kodeord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <button
                type="submit"
                className="btn btn-dark w-100 mt-4"
                id="loginbutton"
                disabled={isButtonDisabled}
              >
                Login
              </button>
            </form>
            <div className="text-center">
              <p>
                Intet brugernavn: <a href="Register" style={{ color: 'blue' }}>Register</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
