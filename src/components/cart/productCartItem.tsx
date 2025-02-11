import React from 'react';
import { useNotifications } from '../NotifcationSystem/NotificationContext';
import type { ProductColorSize } from '../../../FrontendRequests/Requests-Api/Product';

interface Props {
  index: number;
  ProductId: number,
  image_url: string;
  image_desc: string;
  ProductName: string;
  ProductColor: string;
  ProductSize: string;
  ProductPrice: number;
  ProductStock: number;
  ProductQuantity: number;
  ProductColorSizes: ProductColorSize
}

export default function CartItem({
  index,
  ProductId,
  image_url,
  image_desc,
  ProductName,
  ProductColor,
  ProductSize,
  ProductPrice,
  ProductStock,
  ProductQuantity,
  ProductColorSizes
}: Props) {
  const { removeFromBasket, UpdateBasketQuantity } = useNotifications();

  const handledelete = () => {
    removeFromBasket(index);
  };

  return (
    <div className="position-relative">
      {/* Delete Icon Positioned at Top Right */}
      <div className="position-absolute top-0 end-0 m-2">
        <a href="/kurv" onClick={handledelete}>
          <i className="mdi mdi-delete text-danger"></i>
        </a>
      </div>

      <div className="d-block d-md-flex align-items-center">
        <img className="w-50 w-md-30 rounded-3" src={`${image_url}`} alt={image_desc} />
        <div className="w-100 w-md-50 ps-md-4">
          <h6 className="text-lg mb-1">{ProductName}</h6>
          <div className="d-flex">
            <p className="pe-3 mb-0">{ProductColor}</p>
            <p className="border-start ps-3 mb-0">{ProductSize}</p>
          </div>
          <div className="d-flex align-items-center mt-2">
            {ProductStock ? 
              <>
                <i className="mdi mdi-check text-lg text-success"></i>
                <p className="mb-0 ms-2 text-sm">In Stock</p>
              </>
              :
              <>
                <i className="mdi mdi-minus-circle text-lg"></i>
                <p className="mb-0 ms-2 text-sm">Out of Stock</p>
              </>
            }
          </div>
        </div>
        <div className="w-20 w-md-20 mt-4 mt-md-0">
        <input
          type="number"
          min={1}
          max={ProductStock}
          defaultValue={ProductQuantity}
          className="form-control"
          aria-label="amount"
          onInput={(e) => {
            const value = parseInt(e.currentTarget.value, 10);

            if (value === 0) {
              e.currentTarget.value = "1"; // Clear the value or set to a valid default
            } else if (value > ProductStock) {
              e.currentTarget.value = String(ProductStock); // Set the value to max (ProductStock)
            }

            UpdateBasketQuantity(ProductId, ProductColorSizes, Number(e.currentTarget.value))
          }}
        />
        </div>
        <h4 className="ms-3">{ProductPrice.toLocaleString()} .kr</h4>
      </div>
    </div>
  );
}
