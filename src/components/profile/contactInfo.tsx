import React, {useEffect, useState } from 'react';
import { type checkoutcontact } from '../../../FrontendRequests/Interfaces/Checkout';
import { type User} from "../../../FrontendRequests/Requests-Api/User"
interface Props {
  IsLoggedIn: boolean;
  setContactInfo: React.Dispatch<React.SetStateAction<checkoutcontact>>;
  contactInfo: checkoutcontact;
  User: User;
}

export default function ContactInfo({ IsLoggedIn, setContactInfo, contactInfo, User }: Props) {
  const [emailValid, setEmailValid] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const regexemail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    let updatedContactInfo = { ...contactInfo };

    // Always update firstname and lastname
    if (name === "firstname" || name === "lastname") {
        updatedContactInfo[name] = value;
    }

    // Update email only if it matches the regex pattern
    if (name === "email") {
        const isValidEmail = regexemail.test(value);
        setEmailValid(isValidEmail); // Update email validity status

        if (isValidEmail) {
            updatedContactInfo[name] = value;
        } else {
            updatedContactInfo[name] = "";
        }
    }

    // Check if all fields are filled
    const allFieldsFilled = updatedContactInfo.firstname?.trim() !== "" && updatedContactInfo.lastname?.trim() !== "";

    // If all fields are filled and email is valid, set result to true
    if (allFieldsFilled && emailValid) {
        updatedContactInfo.result = true;
        setContactInfo(updatedContactInfo);
    } else {
      updatedContactInfo.result = false;
        setContactInfo(updatedContactInfo);
    }
};

  useEffect(() => {
    if (IsLoggedIn && User) {
      setContactInfo({
        result: true,
        email: User.email,
        firstname: User.firstname,
        lastname: User.lastname,
      });
    }
  }, [IsLoggedIn, User]);

  return (
    <>
      <div className="form-group">
        <label>Email</label>
        <input
            name="email"
            className={`form-control ${!emailValid ? 'is-invalid' : ''}`}
            defaultValue={contactInfo.email}
            disabled={IsLoggedIn}
            onChange={handleInputChange}
            type="email"
            placeholder="Indtast din email addresse"
        />
      </div>
      <div className="row">
        <div className="col-6">
          <div className="form-group">
            <label>Fornavn</label>
            <input
              name="firstname"
              defaultValue={contactInfo.firstname}
              disabled={IsLoggedIn}
              onChange={handleInputChange}
              type="text"
              className="form-control"
              maxLength={10}
              placeholder="Indtast dit fornavn"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>Efternavn</label>
            <input
              name="lastname"
              defaultValue={contactInfo.lastname}
              disabled={IsLoggedIn}
              onChange={handleInputChange}
              type="text"
              className="form-control"
              maxLength={10}
              placeholder="Indtast dit Efternavn"
            />
          </div>
        </div>
      </div>
    </>
  );
}