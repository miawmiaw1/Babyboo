import React, { useState, useEffect } from 'react';
import { FetchAllCountry, type Country } from '../../../FrontendRequests/Requests-Api/Country';
import { type checkoutaddress } from '../../../FrontendRequests/Interfaces/Checkout';

import {type User } from '../../../FrontendRequests/Requests-Api/User';
interface Props {
  sameAsShipping: boolean;
  IsLoggedIn: boolean;
  setAddressInfo: React.Dispatch<React.SetStateAction<checkoutaddress>>;
  addressinfo: checkoutaddress;
  User: User;
}

export default function ShippingInfo({sameAsShipping, IsLoggedIn, setAddressInfo, addressinfo, User }: Props) {
  const [Countries, setCountries] = useState<Country[] | null>(null);
  const [ThisUser, SetUser] = useState<User | null>();
  const [selectedCountryId, setSelectedCountryId] = useState<number>(0);

  const GetCountries = async () => {
    try {
      const result = await FetchAllCountry();
      setCountries(result.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      // Temporarily store the current values of the fields
      const updatedContactInfo = {...addressinfo};

      updatedContactInfo[name as keyof typeof updatedContactInfo] = value as never;

      if (name === "postalcode" || name == "phonenumber") {
        updatedContactInfo[name] = parseInt(value);
      }

      // Check if all fields are filled
      const allFieldsValid =
        typeof updatedContactInfo.result === 'boolean' &&
        updatedContactInfo.address?.trim() !== '' &&
        (updatedContactInfo.phonenumber === undefined || Number.isInteger(updatedContactInfo.phonenumber)) &&
        updatedContactInfo.city?.trim() !== '' &&
        updatedContactInfo.country?.trim() !== '' &&
        updatedContactInfo.postalcode > 0;

      // If all fields are filled and the phone number is valid, set contactInfo to the updated data
      if (allFieldsValid) {
        updatedContactInfo.result = true;
        setAddressInfo(updatedContactInfo);
      } else {
        updatedContactInfo.result = false;
        setAddressInfo(updatedContactInfo);
      }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedCountryId = e.target.value;
    setSelectedCountryId(parseInt(updatedCountryId));
    // Optionally update the state to reflect the new country
    setAddressInfo((prev) => ({
      ...prev,
      country: Countries?.find(e => e.countryid === parseInt(updatedCountryId))?.country as string
    }));
  };

  useEffect(() => {
    GetCountries();
    if (IsLoggedIn && User) {
      setSelectedCountryId(Countries?.find(e => e.country === User.country_name)?.countryid as number)
      SetUser(User)
      setAddressInfo({
        result: true,
        address: User.user_address as string,
        phonenumber: User.phonenumber as number, // BIGINT (optional)
        city: User.address_city as string,
        country: User.country_name as string,
        postalcode: User.address_postalcode as number,
      });
    }
  }, [IsLoggedIn, User]);

  useEffect(() => {
    if (sameAsShipping) {
      setAddressInfo({
        result: true,
        address: User.user_address as string,
        phonenumber: User.phonenumber as number, // BIGINT (optional)
        city: User.address_city as string,
        country: User.country_name as string,
        postalcode: User.address_postalcode as number,
      });
    } else {
      setAddressInfo({
        result: false,
        address: "",
        phonenumber: 0,
        city: "",
        country: Countries ? Countries?.find(e => e.country === "Denmark")?.country as string : "United States",
        postalcode: 0,
      });
    }
  }, [sameAsShipping, User]);


  return (
    <>
      <div className="form-group">
        <label>Gade/vej</label>
        <input
          name="address"
          type="text"
          className="form-control"
          placeholder={sameAsShipping ? ThisUser?.user_address : 'Indtast din addresse'}
          disabled={sameAsShipping}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Mobil Nummer</label>
          <input
            name='phonenumber'
            type="number"
            className={`form-control`}
            placeholder={sameAsShipping ? ThisUser?.phonenumber?.toString() : "Indtast din telefon nummer: +45 53948595"}
            disabled={sameAsShipping}
            onChange={handleInputChange}
          />
        </div>
      <div className="row">
        <div className="col-4">
          <div className="form-group">
            <label>By</label>
                <input
                  name='city'
                  type="text"
                  className="form-control"
                  placeholder={sameAsShipping ? ThisUser?.address_city : "Indtast din by"}
                  disabled={sameAsShipping}
                  onChange={handleInputChange}
                />
          </div>
        </div>
        <div className="col-4">
             {/* Dropdown for selecting country */}
             <div className="form-group">
                <label>Land</label>
                <select id="country" className="form-control" disabled={sameAsShipping} value={selectedCountryId} onChange={handleCountryChange}>
                  {Countries?.map((country) => (
                    <option key={country.countryid} value={country.countryid}>
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <label>Postnummer</label>
                <input
                  name='postalcode'
                  type="number"
                  className="form-control"
                  placeholder={sameAsShipping ? String(ThisUser?.address_postalcode) : "Indtast din Postnummer"}
                  maxLength={6}
                  disabled={sameAsShipping}
                  onChange={handleInputChange}
                />
          </div>
        </div>
      </div>
    </>
  );
}