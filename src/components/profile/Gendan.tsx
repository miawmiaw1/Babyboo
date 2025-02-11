import React, { useState, useEffect } from 'react';
import { RecoverUser, UserExsistByEmail } from '../../../FrontendRequests/Requests-Api/User';
import { SendMesssage } from '../../../FrontendRequests/Requests-Api/Email';

export default function GendanFormular() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const handleButtonClick = async () => {
    const result = await UserExsistByEmail(email)
    if (result.result) {
      const passwordresult = await RecoverUser(result.data.userid)

      if (passwordresult.result) {

        const message = `Din nye adgangskode: ${passwordresult.data}

        Brug adgangskoden til at logge ind på ${import.meta.env.STORENAME}
        
        Du kan ændre adgangskoden på hjemmesiden i din brugerprofil indstillinger`;

        const subject = `${import.meta.env.STORENAME} - Gendannelse af adgangskode`

        const messageresult = await SendMesssage(email, message, subject)

        if (messageresult.result) {
          setMessage("Adgangskode sent til din email")
          alert("Adgangskode sent til din email")
          window.location.href = '/Login';
        } else {
          alert(messageresult.message)
        }
      } else {
        alert(passwordresult.message)
      }
    } else {
      alert("Email findes ikke. Prøv igen")
    }
  };

  const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  };

  useEffect(() => {
    const loginbutton = document.getElementById("loginbutton") as HTMLButtonElement;
    // Add keydown event listener to the button
    if (loginbutton) {
      document.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && !loginbutton.disabled) { // Check if Enter is pressed and button is enabled
          loginbutton.click(); // Trigger click event on the button
        }
    });
    }

    // Clean up event listener on component unmount
    return () => {
      if (loginbutton) {
        loginbutton.removeEventListener("keydown", function(event) {});
      }
    };
  }, []); // Re-run effect when isEmailValid changes

  return (
    <>
      <section className="bg-gray-100 d-flex justify-content-center align-items-center">
        <div className="row w-100">
          <div className="col-12 col-lg-6 p-3 p-md-5 mx-auto">
            <div className="form-group">
              <label>Email</label>
              <input
                id="emailbox"
                type="email"
                className="form-control"
                placeholder="Indtast din email addresse"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <button
              className="btn btn-dark w-100 mt-4"
              id="loginbutton"
              onClick={handleButtonClick}
              disabled={!isEmailValid}  // Button disabled until email is valid
            >
              Gendan
            </button>
            {message && (
              <div className="text-center mt-3">
                <p>{message}</p>
              </div>
            )}
            <div className="text-center">
              <p>
                Allerede bruger: <a href="Login" style={{ color: 'blue' }}>Login</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}