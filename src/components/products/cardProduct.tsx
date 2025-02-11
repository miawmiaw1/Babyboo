import { type Product, type ProductColorSize } from '../../../FrontendRequests/Requests-Api/Product';
import { useNotifications } from '../NotifcationSystem/NotificationContext';
import ProductBadge from './productBadge';
import React, { useEffect, useState } from 'react';
import { Card, Button } from "react-bootstrap";

interface Props {
  Product: Product
}

export default function CardProduct({
  Product
}: Props) {
  const { addToBasket } = useNotifications();
  const [GetProduct, SetProduct] = useState<Product>();

  const addToCartHandler = (product:Product) => {

    if (product.productcolorsizes !== undefined) {
      addToBasket(product.productid, product.productcolorsizes[0])
      window.location.href = "/"
    } else {
      alert("Kunne ikke finde produktet")
    }
  };

  useEffect(() => {
    const product = Product as Product;
    product.productcolorsizes = product.productcolorsizes.filter(item => item.quantity > 0);
    SetProduct(Product)
  }, []);

  return (
<Card
  className="shadow-lg border-0 rounded-4 overflow-hidden mb-5"
  style={{ maxWidth: "300px", cursor: "pointer" }}
  onClick={() =>
    window.location.href = `/ProductDetails?id=${GetProduct?.productid}&Identifier=${encodeURIComponent(JSON.stringify(GetProduct?.productcolorsizes[0]))}`
  }
>
  <Card.Img variant="top" src={GetProduct?.images[0].image_url} className="p-3" style={{ objectFit: "contain", height: "200px" }} />
  <Card.Body>
    <Card.Text className="text-muted text-uppercase small fw-bold">{GetProduct?.categories[0].categoryname}</Card.Text>
    <Card.Title className="fw-bold">{GetProduct?.name}</Card.Title>
    <div className="mb-2">
      <ProductBadge addtocart={false} colorsize={GetProduct?.productcolorsizes as ProductColorSize[]} productid={GetProduct?.productid as number} />
    </div>
    <div className="align-items-center">
      <span className="mdi mdi-star text-warning"></span>
      <span className="mdi mdi-star text-warning"></span>
      <span className="mdi mdi-star text-warning"></span>
      <span className="mdi mdi-star-outline text-muted"></span>
      <span className="mdi mdi-star-outline text-muted"></span>
    </div>
    <h5 className="text-success fw-bold mt-2">
      {(Number(GetProduct?.salgpris_ex_moms) + Number(GetProduct?.udgående_moms)).toLocaleString()} kr.
    </h5>
    <Button
      className="w-100 mt-3 fw-bold"
      variant="dark"
      onClick={(e) => {
        e.stopPropagation(); // Prevents card click event from triggering
        addToCartHandler(Product);
      }}
    >
      <i className="mdi mdi-cart"></i> Tilføj til kurv
    </Button>
  </Card.Body>
</Card>
  );
};
