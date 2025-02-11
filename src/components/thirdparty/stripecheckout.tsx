import React, { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, type PaymentIntent } from '@stripe/stripe-js';
import { CreatepaymentIntent, type stripe, type stripecheckout } from '../../../FrontendRequests/Requests-Api/stripe';
import { Button } from 'react-bootstrap';
import { CreateOrder } from '../../../FrontendRequests/Requests-Api/Order';
import type {Order, OrdersProduct}  from '../../../FrontendRequests/Requests-Api/Order';
import {statusenum} from "../../../FrontendRequests/Enums/status"
import {payment} from "../../../FrontendRequests/Enums/payment" 
import { useNotifications, type ExtendedBasketProduct } from '../NotifcationSystem/NotificationContext';
import { type ProductColorSize } from '../../../FrontendRequests/Requests-Api/Product';
import type { checkoutaddress, checkoutcontact } from '../../../FrontendRequests/Interfaces/Checkout';
import { GetProductColorSizeById, UpdateProductColorSizeQuantity } from '../../../FrontendRequests/Requests-Api/ProductColorSize';

const stripePromise = loadStripe(import.meta.env.PUBLICKEY); // Replace with your publishable key

const CheckoutForm = ({ totalprice, price, stripecheckout }: {totalprice: number, price: number; stripecheckout: stripecheckout }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { RemoveAllBasket } = useNotifications();

  const createneworder = async (userid: number, OrdersProduct: OrdersProduct[],
      contactInfo: checkoutcontact, addressinfo: checkoutaddress, parcel: string, ishomedelivery: boolean, 
      price : number, stripepaymentid: string) => {

      const order: Order = {
        orderid: 0,
        order_date: new Date().toISOString(), // Using string to represent dates in ISO format
        firstname: contactInfo.firstname as string,
        lastname: contactInfo.lastname as string,
        email: contactInfo.email as string,
        phonenumber: addressinfo.phonenumber as number,
        address: `${addressinfo.address}, ${addressinfo.postalcode}, ${addressinfo.city}, ${addressinfo.country}`,
        postalcode: addressinfo.postalcode as number,
        city: addressinfo.city as string,
        country: addressinfo.country as string,
        parcel: parcel,
        ishomedelivery: ishomedelivery,
        totalprice: price / 100,
        stripepaymentid: stripepaymentid,
        userid: userid,
        statusid: statusenum.Placed,
        paymentid: payment.Credit,
        order_products: OrdersProduct
      };

      const result = await CreateOrder(order);
      return result
    };

  function mapProductsToOrdersProduct(products: ExtendedBasketProduct[]): OrdersProduct[] {
    return products.map((product) => {
        // Get the first ProductColorSize
        const firstColorSize = product.productcolorsizes[0];
        
        // Return a mapped object to OrdersProduct
        return {
            orderid: 0, // You can adjust this based on your logic or data source
            productid: product.productid,
            productname: product.name,
            colorname: firstColorSize.colorname as string,
            sizename: firstColorSize.sizename as string,
            quantity: product.quantity,
            købspris_ex_moms: product.købspris_ex_moms,
            salgpris_ex_moms: product.salgpris_ex_moms,
            indgående_moms: product.indgående_moms,
            udgående_moms: product.udgående_moms
        };
    });
  }

  async function HandleUpdateProducts(products: ExtendedBasketProduct[]): Promise<boolean> {
    try {
      // Map over the products and execute the updates
      const operations = products.map(async (product) => {
        const productcolorsizeresult = await GetProductColorSizeById(product.productcolorsizes[0].colorid, product.productcolorsizes[0].sizeid, product.productid)

        if (productcolorsizeresult.result) {
          const productquantity = (productcolorsizeresult.data as ProductColorSize).quantity
          const customerquantity = product.quantity;

          const result = await UpdateProductColorSizeQuantity(
            product.productcolorsizes[0].colorid,
            product.productcolorsizes[0].sizeid,
            productquantity - customerquantity,
            product.productid
          );
          // Return the success status of this operation
          return result.result;
        } else {
          return false
        }
      });

      // Wait for all operations to complete and collect their results
      const results = await Promise.all(operations);

      // Check if all results are true
      const allSuccess = results.every((res) => res === true);

      // Return true if all operations succeed, otherwise false
      return allSuccess;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return false; // Return false if any operation fails
    }
  }

    const handleOrderCreation = (userId : number, deliveryAddress: string,
     isHomeDelivery: boolean, products : ExtendedBasketProduct[], contactInfo: checkoutcontact, addressinfo: checkoutaddress, price: number, paymentIntent: PaymentIntent) => {

      createneworder(
        userId,
        mapProductsToOrdersProduct(products),
        contactInfo,
        addressinfo,
        deliveryAddress,
        isHomeDelivery,
        price,
        paymentIntent.id
      ).then((result) => {
        if (result.result) {
          const orderdata = (result.data as Order)
          const authtoken = result.authtoken;
          HandleUpdateProducts(stripecheckout.products).then((result) => {
            if (result) {
              RemoveAllBasket();
              window.location.href = `/OrderSummery?orderid=${orderdata.orderid}&authtoken=${authtoken}`;
            } else {
              console.log("Cannot create order");
            }
          })
        } else {
          console.log("Cannot create order");
        }
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
  
    setIsProcessing(true);
  
    // Confirm payment without automatic redirection
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Avoid automatic redirection
    });
  
    if (error) {
      console.error(error.message);
      setIsProcessing(false);
      return;
    }
  
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      
      handleOrderCreation(stripecheckout.userId, stripecheckout.parceladdress, stripecheckout.isHomeDelivery,
        stripecheckout.products, stripecheckout.contactInfo, stripecheckout.addressinfo, 
        price, paymentIntent
      )
    }
  
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Total Price: {(totalprice / 100).toFixed(2)} DKK</h3> {/* Display price in DKK */}
      <PaymentElement />
      <Button
        variant="primary"
        style={{
          backgroundColor: import.meta.env.LIGHT_PURPLE || "#7352ff",
          border: "none",
          width: "100%",
          borderRadius: "8px",
        }}
        onClick={handleSubmit}
        className="mt-3"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay'}
      </Button>
    </form>
  );
};

interface StripeCheckoutProps {
  stripecheckout: stripecheckout; // Ensure 'stripecheckout' type is properly defined
}


const StripeForm = ({ stripecheckout }: StripeCheckoutProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [Price, setPrice] = useState<number>(2000); // Default price in øre (e.g., 20.00 DKK)
  const [TotalPrice, setTotalPrice] = useState<number>(0); // Default price in øre (e.g., 20.00 DKK)

  useEffect(() => {
    // set the price
    const price = stripecheckout.products?.reduce((subtotal, product) => {
      return subtotal + Math.round(parseFloat((Number(product.salgpris_ex_moms) + Number(product.udgående_moms)).toString()) * product.quantity * 100);
    }, 0) || 0;

    const totalprice = price + (stripecheckout.deliveryAddress.price * 100)

    setTotalPrice(totalprice)
    setPrice(price)

    // Call API to create payment intent
    CreatepaymentIntent({ amount: totalprice, currency: 'dkk' } as stripe).then((result) => {
      setClientSecret(result.data.clientSecret);
    });
  }, []);

  if (!clientSecret) return <div>Loading...</div>;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe', // Customize appearance
        },
      }}
    >
      <CheckoutForm totalprice={TotalPrice} price={Price} stripecheckout={stripecheckout} /> {/* Pass price as a prop */}
    </Elements>
  );
};

export default StripeForm;