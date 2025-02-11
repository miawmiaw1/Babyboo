import React from 'react';

interface Props {
  subtotal: number;
  shippingprice: number;
  moms: number;
}

export default function OrderSummary({
  subtotal,
  shippingprice,
  moms
}: Props) {

  return (
    <>
      <ul className="list-unstyled">
        <li className="mt-2">
          <div className="d-flex justify-content-between">
            <p>Pris i alt</p>
            <p>{subtotal.toLocaleString()} kr.</p>
          </div>
        </li>
        <li className="mt-2">
          <div className="d-flex justify-content-between">
            <p>Fragt</p>
            <p>{shippingprice} kr.</p>
          </div>
        </li>
        <li className="border-bottom mt-2">
          <div className="d-flex justify-content-between">
            <p>Moms <span data-bs-toggle="tooltip" data-bs-placement="top" title="Moms er inkluderet i prisen" data-container="body" data-animation="true"><i className="mdi mdi-message-question-outline text-sm" style={{ color: import.meta.env.LIGHT_ORANGE }}></i></span></p>
            <p>{moms.toFixed(2)} kr.</p>
          </div>
        </li>
        <li className="mt-2">
          <div className="d-flex justify-content-between">
            <p>Total</p>
            <p>{(shippingprice + Number(subtotal)).toLocaleString()} DKK</p>
          </div>
        </li>
      </ul>
    </>
  );
}