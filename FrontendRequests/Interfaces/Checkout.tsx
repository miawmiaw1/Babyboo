 export interface checkoutcontact {
  result: boolean;
  email?: string;      // VARCHAR(255) UNIQUE NOT NULL
  firstname?: string;  // VARCHAR(255) NOT NULL
  lastname?: string;   // VARCHAR(255) NOT NULL
}

 export interface checkoutaddress {
  result: boolean;
  address: string;
  phonenumber: number; // BIGINT (optional)
  city: string;
  country: string;
  postalcode: number;
}

export interface checkoutcard {
  result: boolean;
  cardnumber: number;
  exp: string;
  cvc: number;
}

export interface DeliveryOption {
  id: number;
  label: string;
  price: number;
  locations?: boolean; // Optional: Only for options with location dropdowns
}

export interface ParcelShop {
  name: string;
  additionalInfo: string;
  city: string;
  countryCode: string;
  houseNumber: string;
  street: string;
  zipCode: string;
  parcelShopId: string;
}

export interface CheckoutDeliveryOption {
  IsParcelShop: boolean;
  IsHomeDelivery: boolean;
  ParcelShop?: ParcelShop;
  price: number;
}