import React from 'react';
import type { ExtendedBasketProduct } from '../NotifcationSystem/NotificationContext';

interface Props {
  Product: ExtendedBasketProduct
}

export default function CheckoutSingleItem({
  Product

}: Props) {

  return (
    <>
      <div className="d-flex mb-4">
        <img className="w-20 rounded-3" src={`${Product.images[0].image_url}`} alt={Product.images[0].created_at} />
        <div className="w-60 w-md-70 pt-2 ps-3 ps-md-4">
          <h6 className="text-lg text-white mb-1">{Product.name}</h6>
          <p className="mb-0 text-white opacity-8">{Product.productcolorsizes[0].colorname}</p>
          <p className="mb-0 text-sm text-white opacity-8">{Product.productcolorsizes[0].sizename}</p>
        </div>

        <div className="w-20 text-end">
          <p className="text-white mb-0 ">{Product.quantity} x {(Number(Product.salgpris_ex_moms) + Number(Product.udgående_moms)).toLocaleString()} kr.</p>
        </div>
      </div>
    </>
  );
}
