import React, { useState } from 'react';
import type { checkoutcard } from '../../../FrontendRequests/Interfaces/Checkout';
import { cardLogos } from '../../../FrontendRequests/Enums/cardtypes';

interface Props {
  setCardInfo: React.Dispatch<React.SetStateAction<checkoutcard>>;
  CardInfo: checkoutcard;
}

export default function PaymentDetails({ setCardInfo, CardInfo }: Props) {
  const [errors, setErrors] = useState({ cardnumber: true, exp: true, cvc: true });
  const [cardType, setCardType] = useState<string | null>(null);

      // Simple Luhn algorithm to validate credit card number
      const isValidCardNumber = (num: string): boolean => {
        // Ensure input contains only digits and has a valid length
        if (!/^\d+$/.test(num) || num.length < 13 || num.length > 19) return false;
      
        let sum = 0;
        let shouldDouble = false;
      
        for (let i = num.length - 1; i >= 0; i--) {
          let digit = parseInt(num[i], 10);
      
          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
      
          sum += digit;
          shouldDouble = !shouldDouble;
        }
      
        return sum % 10 === 0;
      };
  
      // Basic card type detection
      const detectCardType = (num: string) => {
        if (/^4/.test(num)) return 'Visa';
        if (/^5[1-5]/.test(num)) return 'MasterCard';
        return null;
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedCardInfo = { ...CardInfo, [name]: value };
        const updatedErrors = { ...errors };
      
        // Update card type and validate card number
        if (name === 'cardnumber') {
          setCardType(detectCardType(value));
          updatedErrors.cardnumber = !isValidCardNumber(value);
          updatedCardInfo[name] = parseInt(value, 10);
        }
      
        // Validate expiration date (MM/YY)
        if (name === 'exp') {
          const expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
          updatedErrors.exp = !expRegex.test(value);
          updatedCardInfo[name] = value;
        }
      
        // Validate CVC (3 or 4 digits)
        if (name === 'cvc') {
          const cvcRegex = /^[0-9]{3}$/;
          updatedErrors.cvc = !cvcRegex.test(value);
          updatedCardInfo[name] = parseInt(value, 10);
        }
      
        // Set the updated errors state directly
        setErrors(updatedErrors);
      
        // Check if all fields are valid
        const allFieldsValid =
          !updatedErrors.cardnumber &&
          !updatedErrors.exp &&
          !updatedErrors.cvc &&
          isValidCardNumber(updatedCardInfo.cardnumber.toString());
      
        updatedCardInfo.result = allFieldsValid;
        setCardInfo(updatedCardInfo);
      };

  return (
    <>
      <div className="form-group">
        <label>Card Number</label>
        <div className="d-flex align-items-center">
          <input
            type="number"
            name="cardnumber"
            className={`form-control ${errors.cardnumber ? 'is-invalid' : ''}`}
            placeholder="Enter your card number"
            onChange={handleInputChange}
            style={{ flex: 1 }}
          />
          {cardType && (
            <img
              src={cardLogos[cardType as keyof typeof cardLogos] || 'https://via.placeholder.com/50?text=Card'}
              alt={cardType}
              style={{ marginLeft: '10px', marginBottom: "5px" }}
            />
          )}
        </div>
        {errors.cardnumber && <small className="text-danger">Invalid card number</small>}
      </div>
      <div className="row">
        <div className="col-8">
          <div className="form-group">
            <label>Expiration Date (MM/YY)</label>
            <input
              type="text"
              name="exp"
              className={`form-control ${errors.exp ? 'is-invalid' : ''}`}
              placeholder="MM/YY"
              onChange={handleInputChange}
            />
            {errors.exp && <small className="text-danger">Invalid expiration date</small>}
          </div>
        </div>
        <div className="col-4">
          <div className="form-group">
            <label>CVC</label>
            <input
              type="number"
              name="cvc"
              className={`form-control ${errors.cvc ? 'is-invalid' : ''}`}
              placeholder="CVC"
              maxLength={3}
              onChange={handleInputChange}
            />
            {errors.cvc && <small className="text-danger">Invalid CVC</small>}
          </div>
        </div>
      </div>
    </>
  );
}