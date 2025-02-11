import React, { useState, useEffect } from 'react';
import { FetchAllCountry, type Country } from '../../../FrontendRequests/Requests-Api/Country';
import { RegisterUser, UserExsistByEmail } from "../../../FrontendRequests/Requests-Api/User";
import { CreateAddress } from "../../../FrontendRequests/Requests-Api/Address";
import { UserRoles } from "../../../FrontendRequests/Enums/Usertypes";
import { SendMesssage } from '../../../FrontendRequests/Requests-Api/Email';

export default function Registerformular() {
  const [Countries, setCountries] = useState<Country[] | null>(null);
  const [formValues, setFormValues] = useState({
    user: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    ageCheck: false,
    tradeCheck: false,
    country: ''
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Fetch countries
  const GetCountries = async () => {
    try {
      const result = await FetchAllCountry();
      setCountries(result.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    }
  };

  useEffect(() => {
    GetCountries();
  }, []);

  // Check form validity
  useEffect(() => {
    const isValid = Object.values(formValues).every(value => 
  typeof value === 'string' ? value.trim() !== '' : true // Only trim if the value is a string
) && formValues.ageCheck && formValues.tradeCheck && formValues.country !== '';
    setIsButtonDisabled(!isValid);
  }, [formValues]);

  // Handlers for form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    // Check if the target is an HTMLInputElement
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement; // Type assertion to HTMLInputElement
      setFormValues(prevState => ({
        ...prevState,
        [name]: checked
      }));
    } else {
      // For other input types, use value directly
      setFormValues(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Validation functions
  const postalCheck = (postalCode: string) => /^[0-9]+$/.test(postalCode);
  const phoneCheck = (phone: string) => /^[0-9]{8}$/.test(phone);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordMatch = (password1: string, password2: string) => password1 === password2;
  const passwordLength = (password: string) => password.length >= 10;
  const nameCheck = (name: string) => /^[A-Za-z]{2,15}$/.test(name);
  const surnameCheck = (surname: string) => /^[A-Za-z]{2,15}$/.test(surname);
  const usernameCheck = (user: string) => /^[A-Za-z0-9_]{5,10}$/.test(user);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (postalCheck(formValues.postalCode) && phoneCheck(formValues.phone) && isValidEmail(formValues.email) &&
        passwordMatch(formValues.password, formValues.confirmPassword) && passwordLength(formValues.password)
        && nameCheck(formValues.name) && surnameCheck(formValues.surname) && usernameCheck(formValues.user)) {
      
      const userCheck = await UserExsistByEmail(formValues.email);

      if (userCheck.result) {
        alert("Email findes. Prøv igen");
      } else {
        const resultAddress = await CreateAddress(formValues.address, Number(formValues.postalCode), formValues.city, Number(formValues.country));

        if (resultAddress.result) {
          const addressId = resultAddress.data.addressid;

          const resultRegister = await RegisterUser(
            formValues.user, formValues.name, formValues.surname, formValues.password, formValues.email,
            Number(formValues.phone), addressId, UserRoles.USER
          );

          if (resultRegister.result) {
            const message = `Din bruger er nu oprettet på - ${import.meta.env.STORENAME} \n\n Brugernavn: ${resultRegister.data.username} \n Email: ${resultRegister.data.email} \n Kodeord: Kodeordet du oprettede \n\n Du kan anvende følgende oplysninger til at logge ind på ${import.meta.env.STORENAME} \n\n Venlig hilsen ${import.meta.env.STORENAME}`
            await SendMesssage(formValues.email, message, `${import.meta.env.STORENAME} - Bruger oprettet`)
            alert("Bruger oprettet");
            window.location.href = '/';
          } else {
            alert("Bruger ikke oprettet");
          }
        } else {
          alert("Addresse kunne ikke gemmes");
        }
      }
    } else {
      if (!postalCheck(formValues.postalCode)) alert("Postnummer skal være nummerisk");
      if (!phoneCheck(formValues.phone)) alert("Telefon Nummer skal være på 8 tegn og være nummerisk");
      if (!isValidEmail(formValues.email)) alert("EMAIL ER IKKE KORREKT");
      if (!passwordMatch(formValues.password, formValues.confirmPassword)) alert("KODEORD MATCHER IKKE");
      if (!passwordLength(formValues.password)) alert("KODEORD MÅ IKKE VÆRE MINDRE END 10 TEGN");
      if (!nameCheck(formValues.name)) alert("Navn skal være mellem 2 og 15 bogstaver");
      if (!surnameCheck(formValues.surname)) alert("Efternavn skal være mellem 2 og 15 bogstaver");
      if (!usernameCheck(formValues.user)) alert("Brugernavn skal være mellem 5 og 15 bogstaver");
    }
  };

  return (
    <section className="bg-gray-100 d-flex justify-content-center align-items-center">
      <div className="row w-100">
        <div className="col-12 col-lg-6 p-3 p-md-5 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Brugernavn</label>
              <input
                type="text"
                className="form-control"
                name="user"
                value={formValues.user}
                onChange={handleInputChange}
                maxLength={10}
                placeholder="Indtast din brugernavn"
              />
            </div>
            <div className="form-group">
              <label>Fornavn</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                maxLength={15}
                placeholder="Indtast dit fornavn"
              />
            </div>
            <div className="form-group">
              <label>Efternavn</label>
              <input
                type="text"
                className="form-control"
                name="surname"
                value={formValues.surname}
                onChange={handleInputChange}
                maxLength={15}
                placeholder="Indtast dit Efternavn"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="Indtast din email addresse"
              />
            </div>
            <div className="form-group">
              <label>Telefon Nummer</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
                placeholder="Indtast din telefon nummer: 53948595"
              />
            </div>
            <div className="form-group">
              <label>Gade/vej</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formValues.address}
                onChange={handleInputChange}
                placeholder="Indtast din addresse"
              />
            </div>
            <div className="form-group">
              <label>By</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formValues.city}
                onChange={handleInputChange}
                placeholder="Indtast din by"
              />
            </div>
            <div className="form-group">
              <label>Postnummer</label>
              <input
                type="text"
                className="form-control"
                name="postalCode"
                value={formValues.postalCode}
                onChange={handleInputChange}
                maxLength={6}
                placeholder="Indtast din Postnummer"
              />
            </div>
            <div className="form-group">
              <label>Land</label>
              <select
                className="form-control"
                name="country"
                value={formValues.country}
                onChange={handleInputChange}
              >
                <option value="" disabled>Vælg land</option>
                {Countries?.map((country) => (
                  <option key={country.countryid} value={country.countryid}>
                    {country.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Kodeord</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
                placeholder="Indtast din kodeord"
              />
            </div>
            <div className="form-group">
              <label>Gentag Kodeord</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                placeholder="Gentag din kodeord"
              />
            </div>
            <div className="d-flex align-items-center">
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="ageCheck"
                  checked={formValues.ageCheck}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="ageCheck">
                  Jeg er <strong>18+</strong>
                </label>
              </div>
              <div className="form-group form-check ps-5">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="tradeCheck"
                  checked={formValues.tradeCheck}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="tradeCheck">
                  Jeg accepter <strong>Handelsbetingelser</strong>
                </label>
              </div>
            </div>
            <button
              className="btn btn-dark w-100 mt-4"
              id="registerbutton"
              type="submit"
              disabled={isButtonDisabled}
            >
              Register
            </button>
            <div className="text-center">
              <p>
                Allerede bruger: <a href="Login" style={{ color: 'blue' }}>Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
