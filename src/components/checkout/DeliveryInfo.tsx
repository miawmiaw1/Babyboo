import React, { useEffect } from 'react';
import type { checkoutaddress, CheckoutDeliveryOption, DeliveryOption } from '../../../FrontendRequests/Interfaces/Checkout';
import { shippingprice } from '../../../FrontendRequests/Enums/shippingprice';
import { Folders, Identifier } from '../../../FrontendRequests/Enums/Images';

interface Props {
  SetDeliveryOption: React.Dispatch<React.SetStateAction<CheckoutDeliveryOption>>;
  price: number;
}

const DeliveryOptions = ({ SetDeliveryOption, price }: Props) => {

  const deliveryOptions: DeliveryOption[] = [
    { id: 2, label: 'Hjemmelevering', price: price },
  ];

  useEffect(() => {
    SetDeliveryOption({
      IsParcelShop: false,
      IsHomeDelivery: true,
      price: price
    })
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-lg">
        <h5 className="mb-4">
        <span style={{ backgroundColor: '#e1a100', color: 'dark' }} className="badge deep-yellow me-2 mb-2">2</span>
        <span className="ms-2 mb-2">Hvordan skal dine produkter leveres?</span>
        </h5>

      {deliveryOptions.map((option) => (
        <div key={option.id} className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <input
                type="radio"
                id={`option-${option.id}`}
                name="deliveryOption"
                checked={true}
                className="me-2"
              />
            <label htmlFor={`option-${option.id}`} className="form-check-label font-weight-bold">
            {option.label} {option.price.toFixed(2)} .kr
            </label>
            </div>
            {/* Placeholder for Delivery Company Logo */}
            <img
              src={`https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${Folders.MEDIA}/${Identifier.DELIVERY}.jpg`}
              alt="Delivery Logo"
              style={{height: "30px", width: "80px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryOptions;