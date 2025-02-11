import OrderCardProduct from './orderCardProduct';
import OrderSummary from '../cart/orderSummary';
import React, {useEffect, useState } from 'react';
import { FetchOrderById } from '../../../FrontendRequests/Requests-Api/Order';
import type { Order, OrdersProduct } from '../../../FrontendRequests/Requests-Api/Order';
import { GetProduct } from '../../../FrontendRequests/Requests-Api/Product';
import type { Product } from '../../../FrontendRequests/Requests-Api/Product';
import { getShippingPrice } from '../../../FrontendRequests/Enums/shippingprice';
import { Button, Form, Modal } from 'react-bootstrap';
import { generateOrderConfirmationPDF, type OrderDetails } from '../FileGenerator/OrderSummery';
import { SendMesssage, SendOrderEmail } from '../../../FrontendRequests/Requests-Api/Email';
import type { SendOrderParams } from '../../../FrontendRequests/Requests-Api/Email';
import { Verifytoken } from '../../../FrontendRequests/Requests-Api/security';
import Editorder from './editorder';
import type { ProductImage } from '../../../FrontendRequests/Requests-Api/ProductImages';

interface Props {
  order: Order | null,
  isadmin: boolean
}

export default function OrderSummaries({ order, isadmin }: Props) {
  const [Order, SetOrder] = useState<Order | null>(null);
  const [SubTotal, SetSubTotal] = useState<number>(0);
  const [Moms, SetMoms] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [showTrackingNumberModal, setTrackingNumberModal] = useState(false);
  const [showStatusModal, setshowStatusModal] = useState(false);
  const [trackingnumber, Settrackingnumber] = useState<string>();
  const [deliveryservice, Setdeliveryservice] = useState<string>();

  function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    // Convert the Uint8Array to a regular array of numbers
    const binaryString = String.fromCharCode.apply(
      null,
      Array.from(uint8Array) // Convert Uint8Array to regular array
    );
    return btoa(binaryString); // Convert binary string to base64
  }

  async function handleSubmitTrackingNumber() {
    // Check if trackingnumber and deliveryservice are not empty
    if (!trackingnumber || !deliveryservice) {
        alert("Tracking nummer eller levering-websted må ikke være tom.");
    } else {
      const message = `Din Tracking nummer: ${trackingnumber}

      Brug Tracking nummeret til at spore din ordre på: ${deliveryservice}
      
      Du kan altid kontakte os på vores hjemmeside: ${import.meta.env.STORENAME} Hvis du har brug for hjælp! `;
  
      const subject = `${import.meta.env.STORENAME} - Din Tracking nummer`;
  
      const messageresult = await SendMesssage(order?.email as string, message, subject);
  
      if (messageresult.result) {
          alert("Tracking nummer er sendt");
          setTrackingNumberModal(false);
      } else {
          alert("Tracking nummer kunne ikke sendes");
          setTrackingNumberModal(false);
      }
    }
  }

  async function SendOrderConfirmation(order : Order) {
    const sampleStatement: OrderDetails = {
      companyname: import.meta.env.STORENAME,
      companyaddress: import.meta.env.STOREADDRESS,
      companyemail: import.meta.env.STOREEMAIL,
      companyphone: import.meta.env.STOREPHONE,
      orderid: order?.orderid.toString() as string,
      useremail: order?.email as string,
      invoiceDate: new Date()
      .toLocaleDateString('en-GB')
      .split('/')
      .join('/'),
      billingDetails: `${order?.firstname} ${order?.lastname} \n \n ${order?.email}`,
      shippingDetails: `${order?.address}`,
      comments: "Betaling forfalder inden for 30 dage. Vær venlig at angive Ordrenr i din betalingsmetode",
      orderProducts: order?.order_products as OrdersProduct[],
      subtotal: order?.totalprice as number,
      salesTax: order?.order_products?.reduce((acc, product) => 
        acc + parseFloat((Number(product.udgående_moms)).toString()) * product.quantity, 0
      ) as number,
      shippingprice: getShippingPrice(order?.order_products.length)
    };

    generateOrderConfirmationPDF(sampleStatement).then((pdfbytes) => {
      const sendorder : SendOrderParams = {
        email: order?.email as string,
        pdfbase64: uint8ArrayToBase64(pdfbytes),
        Filename: "ordrebekræftelse.pdf"
      }

      SendOrderEmail(sendorder).then((result) => {
      })
    })
  }

  const getorder = async (order: string | Order) => {
    try {
      if (typeof order === 'string') {
        const result = await FetchOrderById(order)
        if (result.result) {
          const Products = await getproducts(result.data)
  
          if (Products) {
            result.data.products = Products
            SetOrder(result.data);
            SetSubTotal(result.data.totalprice);
            SetMoms(result.data.order_products?.reduce((acc: number, product: { udgående_moms: any; quantity: number; }) => 
              acc + parseFloat((Number(product.udgående_moms)).toString()) * product.quantity, 0
            ) as number)
            SendOrderConfirmation(result.data as Order);
          } else {
          }
        } else {
        }
      } else {
        const Products = await getproducts(order)
  
          if (Products) {
            order.products = Products
            SetOrder(order);
            SetSubTotal(order.totalprice);
            SetMoms(order.order_products?.reduce((acc: number, product: { udgående_moms: any; quantity: number; }) => 
              acc + parseFloat((Number(product.udgående_moms)).toString()) * product.quantity, 0
            ) as number)
          } else {
          }
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

  const getproducts = async (Order: Order) => {
    const updatedOrderProducts = await Promise.all(
      Order.order_products.map(async (orderProduct) => {
        const product = await GetProduct(orderProduct.productid.toString());
        
        if (!product.result) {
          return {
              productid: orderProduct.productid,
              name: orderProduct.productname,
              description: "",
              features: "",
              link: "",
              købspris_ex_moms: orderProduct.købspris_ex_moms,
              salgpris_ex_moms: orderProduct.salgpris_ex_moms,
              indgående_moms: orderProduct.indgående_moms,
              udgående_moms: orderProduct.udgående_moms,
              tags: "",
              barcode: 32342334,
              images: [
                {
                  imageid: 1,
                  productid: 0,
                  image_url: "",
                  description: "",
                  created_at: new Date().toISOString(),
                },
              ] as ProductImage[],
              productcolorsizes: [],
              manufacturer: "",
              categories: [],
          } as Product;
        }
  
        (product.data as Product).købspris_ex_moms = orderProduct.købspris_ex_moms;
        (product.data as Product).salgpris_ex_moms = orderProduct.salgpris_ex_moms;
        (product.data as Product).indgående_moms = orderProduct.indgående_moms;
        (product.data as Product).udgående_moms = orderProduct.udgående_moms;
        
        return { ...product.data };
      })
    );
  
    return updatedOrderProducts;
  };
  

  useEffect(() => {
    if (order == null) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      if (params.authtoken !== null) {
        Verifytoken(params.authtoken).then((result) => {
          if (params.orderid !== null && result.result) {
            
            getorder(params.orderid)
            setShowModal(true);
            const timer = setTimeout(() => {
              setShowModal(false);
            }, 5000);
        
            return () => clearTimeout(timer); // Cleanup the timer on unmount
          } 
        })
      } else {
        
      }
    } else {
      getorder(order)
    }
  }, []);

  return (
    <>
    <div className="p-3 p-md-5 bg-gray-100 rounded-2">
      <div className="d-block d-md-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="mb-2">Order #{Order?.orderid}</h3>
          <p className="mb-0 text-dark">Total Products: <b>{Order?.order_products?.length}</b></p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isadmin ? (
            <Button
              className="custom-dropdown-toggle text_style"
              variant="warning"
              onClick={() => {
                const sampleStatement: OrderDetails = {
                  companyname: import.meta.env.STORENAME,
                  companyaddress: import.meta.env.STOREADDRESS,
                  companyemail: import.meta.env.STOREEMAIL,
                  companyphone: import.meta.env.STOREPHONE,
                  orderid: order?.orderid.toString() as string,
                  useremail: order?.email as string,
                  invoiceDate: new Date().toISOString().split('T')[0],
                  billingDetails: `${order?.firstname} ${order?.lastname} \n \n ${order?.email}`,
                  shippingDetails: `${order?.address}`,
                  comments: "Betaling forfalder inden for 30 dage. Vær venlig at angive Ordrenr i din betalingsmetode",
                  orderProducts: order?.order_products as OrdersProduct[],
                  subtotal: order?.totalprice as number,
                  salesTax: order?.order_products?.reduce((acc, product) => 
                    acc + parseFloat((Number(product.udgående_moms)).toString()) * product.quantity, 0
                  ) as number,
                  shippingprice: getShippingPrice(order?.order_products.length)
                };

                generateOrderConfirmationPDF(sampleStatement).then((pdfbytes) => {
                  const blob = new Blob([pdfbytes], { type: 'application/pdf' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'ordrebekræftelse.pdf';
                  link.click();

                  console.log('Rapport hentet!');
                });
              }}
            >
              Download PDF
            </Button>
          ) : null}

          {isadmin ? (
            <div>
              <Button
                className="custom-dropdown-toggle text_style"
                variant="primary"
                onClick={() => {
                  setTrackingNumberModal(true)
                }}
              >
                Send tracking nummer
              </Button>
            </div>
          ) : null}
          {isadmin ? (
            <div>
              <Button
                className="custom-dropdown-toggle text_style"
                style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                variant="primary"
                onClick={() => {
                  setshowStatusModal(true);
                }}
              >
                Ændre Status
              </Button>
            </div>
          ) : null}
        </div>

      </div>

      {Order?.products?.map((product, index) => (
        <OrderCardProduct 
          key={index} // Use a unique key, if available, such as product.id
          product={product} 
          status={Order.statusid} 
          quantity={Order.order_products[index].quantity} 
          address={`${Order.address}`} 
          email={Order.email} 
          phoneNumber={Order.phonenumber as number} 
        />
      ))}
      <div className="card shadow-xs border p-3 p-md-4 mb-4">
        <div className="row">
          <div className="col-12 col-lg-3 mt-4 mt-md-0">
            <h5 className="text-base">Billing Address</h5>
            <p className="text-sm mb-0 opacity-8 pe-md-7">{Order?.address}</p>
          </div>
          <div className="col-12 col-lg-3 mt-4 mt-lg-0">
            <h5 className="text-base">Payment information</h5>
            <div className="d-flex">
              <svg width="49" height="32" viewBox="0 0 49 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_152_7843)">
                <path d="M22.1996 20.8737H19.6074L21.2288 10.8484H23.8209L22.1996 20.8737Z" fill="#00579F"/>
                <path d="M31.5982 11.0936C31.0869 10.8907 30.276 10.6667 29.2732 10.6667C26.7133 10.6667 24.9106 12.0318 24.8996 13.9835C24.8783 15.4234 26.1902 16.2232 27.1714 16.7033C28.1743 17.1939 28.5153 17.5141 28.5153 17.9514C28.5051 18.623 27.7049 18.9326 26.9585 18.9326C25.9236 18.9326 25.3691 18.773 24.5263 18.3993L24.185 18.2392L23.8223 20.4896C24.4302 20.7666 25.5504 21.0124 26.7133 21.0232C29.4332 21.0232 31.204 19.6792 31.225 17.5994C31.2353 16.4582 30.5426 15.5837 29.0491 14.8691C28.1424 14.4104 27.5872 14.1011 27.5872 13.6318C27.5978 13.2051 28.0568 12.7681 29.0803 12.7681C29.923 12.7467 30.5422 12.9492 31.0112 13.1519L31.2457 13.2584L31.5982 11.0936Z" fill="#00579F"/>
                <path d="M35.0438 17.3221C35.2573 16.7461 36.0787 14.5171 36.0787 14.5171C36.068 14.5385 36.2918 13.9305 36.4198 13.5573L36.601 14.4211C36.601 14.4211 37.0918 16.8208 37.1984 17.3221C36.7933 17.3221 35.5558 17.3221 35.0438 17.3221ZM38.2436 10.8484H36.2385C35.6202 10.8484 35.1504 11.0295 34.8836 11.6802L31.0332 20.8735H33.7531C33.7531 20.8735 34.2009 19.6362 34.2972 19.3697C34.5956 19.3697 37.2415 19.3697 37.6254 19.3697C37.6998 19.7217 37.9347 20.8735 37.9347 20.8735H40.3348L38.2436 10.8484Z" fill="#00579F"/>
                <path d="M17.4429 10.8484L14.9043 17.6847L14.6269 16.2982C14.1575 14.6984 12.6856 12.9602 11.043 12.096L13.3683 20.863H16.1095L20.184 10.8484H17.4429Z" fill="#00579F"/>
                <path d="M12.5473 10.8484H8.37665L8.33398 11.051C11.5873 11.8829 13.742 13.8883 14.6272 16.2986L13.7206 11.6911C13.5713 11.0508 13.1126 10.8695 12.5473 10.8484Z" fill="#FAA61A"/>
                </g>
                <rect x="0.833984" y="0.5" width="47" height="31" rx="5.5" stroke="#DDE0E5"/>
                <defs>
                <clipPath id="clip0_152_7843">
                  <rect width="32" height="32" fill="white" transform="translate(8.33398)"/>
                </clipPath>
                </defs>
              </svg>

              <p className="text-sm ms-3">
                <b>{Order?.paymentname}</b> <br/>
              </p>
            </div>
          </div>
          
          <div className="col-12 col-lg-6">
            <OrderSummary 
              subtotal={SubTotal}
              shippingprice={getShippingPrice(Order?.order_products.length)}
              moms={Moms}
            />
          </div>
        </div>
      </div>

      	{/* Modal for Order */}
        <Modal show={showModal} size="lg" centered>
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title className="d-flex align-items-center">
              <i className="mdi mdi-check-circle-outline me-2" style={{ fontSize: "1.5rem" }}></i>
              Ordre gennemført med succes
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center p-4">
            <i className="mdi mdi-cart-check-outline" style={{ fontSize: "4rem", backgroundColor: "lightgreen" }}></i>
            <p className="mt-3 fs-5">
              Tak for dit køb! Din ordre er blevet registreret og er under behandling
            </p>
            <p className="mt-3 fs-5">
              Du får en ordrebekræftelse i din indbakke snarest - Tjek din spam eller uønsket email
            </p>
            <p className="mt-3 fs-5">
              Du får en tracking nummer så du kan spore din ordre så snart den er færdig behandlet! - Tjek din spam eller uønsket email
            </p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
          </Modal.Footer>
        </Modal>

      {/* Modal for Sending tracking number */}
      <Modal show={showTrackingNumberModal} onHide={() => setTrackingNumberModal(false)} size="lg" centered>
        <Modal.Header closeButton className="text-white" style={{ backgroundColor: "blue" }}>
        <Modal.Title className="d-flex align-items-center">
          <i className="mdi mdi-package-check me-2" style={{ fontSize: "1.5rem" }}></i>
          Send tracking number
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {/* Textfield for the tracking number */}
              <Form>
                  <Form.Group controlId="trackingNumber">
                      <Form.Label>Tracking nummer</Form.Label>
                      <Form.Control 
                          type="text" 
                          placeholder="Indtast tracking nummer" 
                          value={trackingnumber} 
                          onChange={(e) => Settrackingnumber(e.target.value)} 
                      />
                  </Form.Group>
              </Form>
                {/* Textfield for delivery service */}
                <Form>
                  <Form.Group controlId="deliveryService">
                      <Form.Label>Leverings-websted</Form.Label>
                      <Form.Control 
                          type="text" 
                          placeholder="eksempel: GLS.com" 
                          value={deliveryservice} 
                          onChange={(e) => Setdeliveryservice(e.target.value)} 
                      />
                  </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={() => setTrackingNumberModal(false)}>
                  Close
              </Button>
              <Button variant="primary" onClick={handleSubmitTrackingNumber}>
                  Submit
              </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for Changing status */}
        <Modal show={showStatusModal} onHide={() => setshowStatusModal(false)} size="lg" centered>
          <Modal.Header closeButton className="text-white" style={{ backgroundColor: "purple" }}>
            <Modal.Title className="w-100 d-flex justify-content-center">
              <Editorder order={Order as Order} />
            </Modal.Title>
          </Modal.Header>
        </Modal>
    </div>
    </>
  );
};