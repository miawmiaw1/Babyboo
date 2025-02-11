import ShippingInfo from '../profile/shippingInfo';
import BillingInfo from '../profile/billingInfo';
import OrderSummary from '../cart/orderSummary';
import CheckoutSingleItem from '../checkout/checkoutSingleItem';
import React, {useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNotifications, type ExtendedBasketProduct } from '../NotifcationSystem/NotificationContext';
import { GetProduct } from '../../../FrontendRequests/Requests-Api/Product';
import { IsLoggedIn, fetchUserById } from '../../../FrontendRequests/Requests-Api/User';
import type { User } from '../../../FrontendRequests/Requests-Api/User';
import ContactInfo from '../profile/contactInfo';
import type { checkoutcontact, checkoutaddress, CheckoutDeliveryOption } from '../../../FrontendRequests/Interfaces/Checkout';
import DeliveryOptions from './DeliveryInfo';
import {UserRoles} from "../../../FrontendRequests/Enums/Usertypes"
import StripeForm from '../thirdparty/stripecheckout';
import type { stripecheckout } from '../../../FrontendRequests/Requests-Api/stripe';
import { getShippingPrice } from '../../../FrontendRequests/Enums/shippingprice';

export default function CheckoutSummary({
}) {
  const { Basket, removeFromBasket } = useNotifications();
  const [GetProducts, SetProducts] = useState<ExtendedBasketProduct[] | null>(null);
  const [LoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [User, SetUser] = useState<User>();
  const [showWarningModal, setWarningModal] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedStripeCheckout, setselectedStripeCheckout] = useState<stripecheckout>();
  const [handelsbetingelser, sethandelsbetingelser] = useState<boolean>(false);

  const handleClose = () => setShowModal(false);

  const [contactInfo, setContactInfo] = useState<checkoutcontact>({
    result: false,
    email: "",
    firstname: "",
    lastname: "",
  });
  
  const [addressinfo, setAddressInfo] = useState<checkoutaddress>({
    result: false,
    address: "",
    phonenumber: 0,
    city: "",
    country: "",
    postalcode: 0,
  });

  const [DeliveryOption, setDeliveryOption] = useState<CheckoutDeliveryOption>({
    IsParcelShop: false,
    IsHomeDelivery: false,
    price: 0
  });

  const checkLoginStatus = async () => {
    try {
      const result = await IsLoggedIn();
      setIsLoggedIn(result.result);
      if (result.result) {
        const userresult = await fetchUserById(result.data.user.userid)
        SetUser(userresult.data)
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };
  
  const GetProductsByIds = async () => {
    try {
      const productPromises = Basket.map(async (product, index) => {
        const response = await GetProduct(product.ProductId.toString()); // Fetch product by ID
  
        if (response.result) { // Check if response.result is truthy
          return {
            ...response.data, // Spread the rest of the product data
            productcolorsizes: [product.ProductCustoms],
            quantity: product.quantity,
          };
        } else {
          removeFromBasket(index); // Remove the product from the basket
          console.log(`Product at index ${index} removed from basket`);
          return null; // Return null for invalid products
        }
      });
  
      // Wait for all promises to resolve
      const updatedProducts = await Promise.all(productPromises);
  
      // Filter out any null values and update the products
      const validProducts = updatedProducts.filter(product => product !== null);
      SetProducts(validProducts); // Assuming SetProducts updates the state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle button click
  const handleProceedToPaymentClick = () => {

    if (GetProducts && GetProducts?.length > 0) {

      if (contactInfo.result && addressinfo.result) {
        if (handelsbetingelser) {
          if (DeliveryOption.IsHomeDelivery) {
            const userId = LoggedIn ? User?.userid : UserRoles.DEFAULT;
            const homeAddress = `${User?.user_address}, ${User?.address_postalcode}, ${User?.address_city}, ${User?.country_name}`;
  
            setselectedStripeCheckout({
              userId: userId as number,
              parceladdress: homeAddress,
              isHomeDelivery: true,
              products: GetProducts,
              contactInfo: contactInfo,
              addressinfo: addressinfo,
              deliveryAddress: DeliveryOption
            })
            setShowModal(true);
  
          } else if (DeliveryOption.IsParcelShop) {
            const userId = LoggedIn ? User?.userid : UserRoles.DEFAULT;
            const parcelShopAddress = `${DeliveryOption.ParcelShop?.name}, ${DeliveryOption.ParcelShop?.street}, ${DeliveryOption.ParcelShop?.houseNumber}, ${DeliveryOption.ParcelShop?.city}, ${DeliveryOption.ParcelShop?.zipCode}`;
            
            setselectedStripeCheckout({
              userId: userId as number,
              parceladdress: parcelShopAddress,
              isHomeDelivery: true,
              products: GetProducts,
              contactInfo: contactInfo,
              addressinfo: addressinfo,
              deliveryAddress: DeliveryOption
            })
            setShowModal(true);
  
          }
        } else {

        }
      }

    } else {
      setWarningModal(true);
    }
  };
  
  let subtotal = 0;
  GetProducts?.map(product => 
    subtotal += parseFloat((Number(product.salgpris_ex_moms) + Number(product.udgående_moms)).toString()) * product.quantity
  );
  let moms = 0;
  GetProducts?.map(product => 
    moms += parseFloat((Number(product.udgående_moms)).toString()) * product.quantity
  );

  useEffect(() => {
    checkLoginStatus();
    GetProductsByIds();
  }, []);


  return (
    <>

      <section>
        <div className="row">
          <div className="col-12 col-lg-6 p-3 p-md-5 bg-gray-100">
            <h5 className="mb-4">Kontakt information</h5>
            <ContactInfo IsLoggedIn={LoggedIn} setContactInfo={setContactInfo} contactInfo={contactInfo as checkoutcontact} User={User as User}/>
            <h5 className="mt-5 mb-4">Adresse</h5>
            <ShippingInfo 
                sameAsShipping={sameAsShipping}
                IsLoggedIn={LoggedIn}
                setAddressInfo={setAddressInfo}
                addressinfo={addressinfo}
                User={User as User}
            />

            <h5 className="mt-5 mb-4">Levering</h5>
            <DeliveryOptions SetDeliveryOption={setDeliveryOption} price={getShippingPrice(Basket.length)}/>
            
            {LoggedIn && (
              <>
                <h5 className="mt-5 mb-4">Faktureringsadresse</h5>
                <BillingInfo 
                  sameAsShipping={sameAsShipping}
                  setSameAsShipping={setSameAsShipping}
                />
              </>
            )}
            <div>
              <h5 className="mt-5 mb-4">Handelsbetingelser</h5>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={handelsbetingelser}
                  onChange={() => sethandelsbetingelser(!handelsbetingelser)}
                  id="handelsbetingelserCheckbox"
                />
                <label htmlFor="handelsbetingelserCheckbox" className="custom-control-label">
                  <strong style={{ textDecoration: 'underline' }}>
                    <a href="/Privatpolitik" style={{ textDecoration: 'none', color: 'inherit' }}>
                      Accepter handelsbetingelser
                    </a>
                  </strong>
                </label>
                {!handelsbetingelser && (
                  <div style={{ color: 'red', marginTop: '8px' }}>
                    Venligst accepter handelsbetingelser
                  </div>
                )}
              </div>
            </div>

            <hr className="dark horizontal"/>
            <button className="btn btn-dark float-end mt-2 mb-0" onClick={handleProceedToPaymentClick}>
              <svg className="me-1" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2.80039 2.80005C2.02719 2.80005 1.40039 3.42685 1.40039 4.20005V4.90005H12.6004V4.20005C12.6004 3.42685 11.9736 2.80005 11.2004 2.80005H2.80039Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6004 6.30005H1.40039V9.80005C1.40039 10.5733 2.02719 11.2 2.80039 11.2H11.2004C11.9736 11.2 12.6004 10.5733 12.6004 9.80005V6.30005ZM2.80039 9.10005C2.80039 8.71344 3.11379 8.40005 3.50039 8.40005H4.20039C4.58699 8.40005 4.90039 8.71344 4.90039 9.10005C4.90039 9.48666 4.58699 9.80005 4.20039 9.80005H3.50039C3.11379 9.80005 2.80039 9.48666 2.80039 9.10005ZM6.30039 8.40005C5.91379 8.40005 5.60039 8.71344 5.60039 9.10005C5.60039 9.48666 5.91379 9.80005 6.30039 9.80005H7.00039C7.387 9.80005 7.70039 9.48666 7.70039 9.10005C7.70039 8.71344 7.387 8.40005 7.00039 8.40005H6.30039Z" fill="white"/>
              </svg>
              Fortsæt til betaling
            </button>
          </div>
          <div className="col-12 col-lg-6 p-3 p-md-5 bg-dark bg-gradient rounded-end">
            <p className="text-white opacity-6 mb-0 text-end">Pris</p>
            <h3 className="text-white mb-4 text-end">{subtotal.toLocaleString()} kr.</h3>
            {GetProducts?.map((product, i) => 
                <CheckoutSingleItem
                Product={product}
                />
            )}
            <OrderSummary subtotal={subtotal} shippingprice={getShippingPrice(GetProducts?.length)} moms={moms} />
          </div>
        </div>

        {/* Modal for stripe */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
              <div className="w-100 text-center">
              <Modal.Title>Powered by Stripe</Modal.Title>
              </div>
          </Modal.Header>
          <Modal.Body>
              <StripeForm stripecheckout={selectedStripeCheckout as stripecheckout} />
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
              Close
              </Button>
          </Modal.Footer>
          </Modal>

        {/* Modal for Warning */}
        <Modal show={showWarningModal} size="lg" centered>
          <Modal.Header closeButton className="text-white" style={{ backgroundColor: "red" }}>
              <Modal.Title className="d-flex flex-column">
                  <div className="d-flex align-items-center">
                      <i className="mdi mdi-delete-empty-outline me-2" style={{ fontSize: "1.5rem" }}></i>
                         Basket is empty
                  </div>
                  <div className="mt-2 fw-bold" style={{ fontSize: "0.9rem" }}>
                      Please add products in basket to proceed
                  </div>
              </Modal.Title>
          </Modal.Header>

          <Modal.Footer className="d-flex justify-content-center">
              <button className="btn btn-success me-2" onClick={() => window.location.href = '/'}>Refresh</button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};

