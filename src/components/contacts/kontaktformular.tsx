import React, { useState, useEffect } from "react";
import { SendEmailToOwner } from "../../../FrontendRequests/Requests-Api/Email";

interface Props {}

export default function KontaktFormular({}: Props) {
  // State for the input fields
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");  // Added state for subject
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Effect to check the fields and enable/disable the button
  useEffect(() => {
    checkFields();
  }, [email, message, subject]);  // Added subject as dependency

  // Check fields to validate input
  const checkFields = () => {
    const isValid = message.trim() !== "" && email.trim() !== "" && subject.trim() !== "" && isValidEmail(email.trim());
    setIsButtonDisabled(!isValid);
  };

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input change for email
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // Handle input change for message
  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  // Handle input change for subject
  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  // Handle form submission (you can add your own logic here)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() !== "" && email.trim() !== "" && subject.trim() !== "") {
      SendEmailToOwner(email, message, subject).then((result) => {
        if(result.result) {
          alert("Email leveret! Tak for du kontaktede os")
          window.location.href = "Kontakt"
        } else {
        }
      })
      // You can replace the console.log with an actual submission logic.
    } else {
      console.log("Invalid form input.");
    }
  };

  return (
    <section className="bg-gray-100 d-flex justify-content-center align-items-center">
      <div className="row w-100">
        <div className="col-12 col-lg-6 p-3 p-md-5 mx-auto">
          <h5 className="mb-4">Kontakt information</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                id="emailbox"
                type="email"
                className="form-control"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="form-group">
              <label>Emne</label>  {/* Added subject label */}
              <input
                id="subjectbox"
                type="text"
                className="form-control"
                placeholder="Enter the subject"
                value={subject}
                onChange={handleSubjectChange}  // Added subject handler
              />
            </div>
            <div className="form-group">
              <label>Besked</label>
              <textarea
                id="messagebox"
                className="form-control"
                placeholder="Skriv besked her"
                style={{ width: "100%", height: "150px" }}
                value={message}
                onChange={handleMessageChange}
              ></textarea>
            </div>
            <button
              className="btn btn-dark w-100 mt-4"
              id="kontaktbutton"
              type="submit"
              disabled={isButtonDisabled}
            >
              Fortsæt
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
