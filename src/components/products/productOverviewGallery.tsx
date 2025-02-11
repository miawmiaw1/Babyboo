import React, { useEffect, useState } from 'react';
import ProductBadge from './productBadge';
import ProductImages from './productImages';
import ProductAccordion from './productAccordion';
import { GetProduct, type Product, type ProductColorSize } from '../../../FrontendRequests/Requests-Api/Product';
import { useNotifications } from '../NotifcationSystem/NotificationContext';
import { Form } from 'react-bootstrap';

export default function ProductOverviewGallery() {
  const { addToBasket } = useNotifications();
  const [GetProductState, SetProductState] = useState<Product | null>(null);
  const [GetIdentifier, SetIdentifier] = useState<ProductColorSize | null>(null);
  const [defaultproduct, setdefaultproduct] = useState<boolean>(false);
  const [uniquecolors, setuniquecolors] = useState<ProductColorSize[]>();
  const [uniquesizes, setuniquesizes] = useState<ProductColorSize[]>();
  const [selectedcolor, setselectedcolor] = useState<number>();
  const [selectedsize, setselectedsize] = useState<number>();

  function isProductColorSize(obj: any): obj is ProductColorSize {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.colorid === 'number' &&
        typeof obj.colorname === 'string' &&
        typeof obj.sizeid === 'number' &&
        typeof obj.sizename === 'string' &&
        typeof obj.quantity === 'number'
    );
}

  const handleColorSelect = (e: { target: { value: any; }; }) => {
    const sizes = GetProductState?.productcolorsizes.filter((colors) => colors?.colorid === Number(e.target.value)) as ProductColorSize[]
    const uniquesizes = sizes
    .filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.sizename === item.sizename // Check for unique size names
        ))
    )

    setuniquesizes(uniquesizes)
    setselectedcolor(Number(e.target.value))
  };

  const handlesizeSelect = (e: { target: { value: any; }; }) => {
    setselectedsize(Number(e.target.value))
  };

  const Getproductfunc = async (productid: string, Identifier: ProductColorSize) => {
    try {
      if (productid !== null) {
        const result = await GetProduct(productid);
        if (result.result) {
          const product = (result.data as Product)
          product.productcolorsizes = product.productcolorsizes.filter(item => item.quantity > 0);
          
          SetProductState(product);
          if (isProductColorSize(Identifier)) {
            SetIdentifier(Identifier);
            const productcolorsize = Identifier as ProductColorSize

            if (productcolorsize.colorname === "Default") {
              setdefaultproduct(true)
              setselectedcolor(productcolorsize.colorid)
              setselectedsize(productcolorsize.sizeid)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.id !== null) {
      Getproductfunc(params.id, JSON.parse(params.Identifier));
    }
  }, []);

  useEffect(() => {

    const uniquecolors = GetProductState?.productcolorsizes
    .filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.colorname === item.colorname // Check for unique size names
        ))
    )

    const uniquesizes = GetProductState?.productcolorsizes
    .filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.sizename === item.sizename // Check for unique size names
        ))
    )

    setuniquecolors(uniquecolors)
    setuniquesizes(uniquesizes)

  }, [GetProductState]);

  // Handler for "Add to Cart" button
  const addToCartHandler = (productId:number) => {

    if (selectedcolor && selectedsize) {
      // add product to basket
      const productcolorsize = GetProductState?.productcolorsizes.find(
        (item) => item.colorid === selectedcolor && item.sizeid === selectedsize
      )
      if (productcolorsize !== undefined) {
        addToBasket(productId, productcolorsize)

        window.location.href = '/Butik'; // Redirects to the cart page with product id
      } else {
        alert("Kunne ikke finde produktet")
      }
    } else {
      alert("Farve eller størrelse ikke valgt!")
    }
  };

  return (
    <>
      <div className="card card-product card-plain">
        <div className="row">
          {GetProductState?.images.length !== 0 && GetProductState?.images != null && (
            <ProductImages images={GetProductState?.images} />
          )}
          <div className="col-12 col-lg-6 mt-5 mt-lg-0">
            {GetProductState?.name.length !== 0 && (
              <h2 style={{ fontSize: '30px !important' }}>{GetProductState?.name}</h2>
            )}
            {GetProductState?.salgpris_ex_moms && (
              <>
                <div className="d-flex mb-3">
                  <h4 className="font-weight-bold">
                    {(Number(GetProductState?.salgpris_ex_moms) + Number(GetProductState?.udgående_moms)).toLocaleString()} kr.
                  </h4>
                  <input className="opacity-0" defaultValue={(Number(GetProductState?.salgpris_ex_moms) + Number(GetProductState?.udgående_moms)).toLocaleString()} />
                </div>
              </>
            )}

            <p style={{ fontSize: '15px !important' }} className="mt-4">
              {GetProductState?.description}
            </p>

            {GetProductState?.productcolorsizes.length !== 0 && (
              <>
                <h6 className="mt-4">Farve:</h6>
                {GetProductState?.productcolorsizes && (
                  <ProductBadge
                    addtocart={true}
                    productid={GetProductState.productid}
                    colorsize={GetProductState?.productcolorsizes}
                  />
                )}
              </>
            )}

          <Form.Select className="input-select" onChange={handleColorSelect} defaultValue="Vælg Farver" disabled={defaultproduct}>
              <option disabled>Vælg Farver</option>
              {uniquecolors?.map((color) => (
                <option value={color.colorid}>
                  {color.colorname}
                </option>
              ))}
          </Form.Select>

          <h6 className="mt-4">Størrelser:</h6>
          <Form.Select className="input-select" onChange={handlesizeSelect} defaultValue="Vælg Størrelser" disabled={defaultproduct}>
              <option disabled>Vælg Størrelser</option>
              {uniquesizes?.map((size) => (
                <option value={size.sizeid}>
                  {size.sizename}
                </option>
              ))}
          </Form.Select>

            <div className="d-flex align-items-center mt-4">
              <button
                className="btn btn-dark btn-lg mb-0 me-4"
                onClick={() => {
                  if (!GetProductState && !GetIdentifier) {
                    return;
                  } else {
                    addToCartHandler(GetProductState?.productid as number);
                  }
                }}
                disabled={!GetProductState || !GetIdentifier} // Disable the button if either is falsy
              >
                Tilføj
              </button>
              <a href="#favorite">
                <i id="heart1" className="far fa-heart text-2xl"></i>
              </a>
            </div>
            {GetProductState && <ProductAccordion product={GetProductState} />}
          </div>
        </div>
      </div>
    </>
  );
}