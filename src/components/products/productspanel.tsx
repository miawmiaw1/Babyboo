import React, {useEffect, useState } from 'react';
import ProductTable from './productTable';
import { FetchAllCateGories, type Category } from "../../../FrontendRequests/Requests-Api/Category";
import { GetAllProducts, type Product } from '../../../FrontendRequests/Requests-Api/Product';

const ProductPanel = () => {
  const [GetProducts, SetProducts] = useState<Product[] | null>(null);
  const [categories, Setcategories] = useState<Category[]>();
  const [gethighestproduct, sethighestproduct] = useState<Product | null>(null);
  const [getlowestproduct, setlowestproduct] = useState<Product | null>(null);

  const GetCategories = async () => {
    try {
      const result = await FetchAllCateGories();
      if (result.result) {
        Setcategories(result.data)
      }
    } catch (error) {
      console.error('Error Getting categories:', error);
    }
  };

  const GetProcuts = async () => {
    try {
      const result = await GetAllProducts();
      if (result.result) {
        SetProducts(result.data)
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

  useEffect(() => {
    GetCategories();
    GetProcuts();
  }, []);

  useEffect(() => {
    if (GetProducts && GetProducts?.length > 0) {
      const highestPriceProduct = GetProducts?.reduce((max, product) => {
        return Math.round(product.salgpris_ex_moms) > Math.round(max.salgpris_ex_moms) ? product : max;
      });
      const lowestPriceProduct = GetProducts?.reduce((min, product) => {
        return Math.round(product.salgpris_ex_moms) < Math.round(min.salgpris_ex_moms) ? product : min;
      });
      
      if (highestPriceProduct && lowestPriceProduct) {
        sethighestproduct(highestPriceProduct)
        setlowestproduct(lowestPriceProduct)
      } else {
        sethighestproduct(null);
        setlowestproduct(null);
      }
    } else {
      sethighestproduct(null);
      setlowestproduct(null);
    }

  }, [GetProducts]);


return (
  <div className="container-fluid p-2">
    <div className="container p-3">
      <div className="row text-center p-2 bg-white rounded shadow-lg">
        {/* Cards */}
        <div className="col-md-3 d-flex flex-column align-items-center border-end p-3 position-relative bg-white">
          <div
            className="position-absolute top-0 end-0 mt-1 me-2 d-flex justify-content-center align-items-center"
            style={{ width: '40px', height: '40px', backgroundColor: '#ede4ff', borderRadius: '8px' }}
          >
            <i
              className="mdi mdi-storefront-outline"
              style={{ fontSize: '24px', color: `${import.meta.env.LIGHT_PURPLE}` }}
            ></i>
          </div>
          <div className="text-start mt-0">
            <p className="mb-1">Produkter i alt</p>
          </div>
          <h4 className="mb-1 mt-4">{GetProducts?.length}</h4>
        </div>

        {/* Repeat for other cards */}
        <div className="col-md-3 d-flex flex-column align-items-center border-end p-3 position-relative bg-white">
          <div
            className="position-absolute top-0 end-0 mt-1 me-2 d-flex justify-content-center align-items-center"
            style={{ width: '40px', height: '40px', backgroundColor: '#e8e8e8', borderRadius: '8px' }}
          >
            <i className="mdi mdi-web" style={{ fontSize: '24px', color: '#AFAFAF' }}></i>
          </div>
          <div className="text-start mt-0">
            <p className="mb-1">Kategorier i alt</p>
          </div>
          <h4 className="mb-1 mt-4">{categories?.length}</h4>
        </div>

        {/* Example for lowest product */}
        <div className="col-md-3 d-flex flex-column align-items-center border-end p-3 position-relative bg-white">
          <div
            className="position-absolute top-0 end-0 mt-1 me-2 d-flex justify-content-center align-items-center"
            style={{ width: '40px', height: '40px', backgroundColor: '#ffe2e3', borderRadius: '8px' }}
          >
            <i className="mdi mdi-chart-pie-outline" style={{ fontSize: '24px', color: `${import.meta.env.LIGHT_RED}` }}></i>
          </div>
          <div className="text-start mt-0">
            <p className="mb-1">Billigste produkt</p>
            <h4 className="mb-1">${getlowestproduct?.salgpris_ex_moms}</h4>
          </div>
        </div>

        {/* Example for expensive product */}
        <div className="col-md-3 d-flex flex-column align-items-center border-end p-3 position-relative bg-white">
          <div
            className="position-absolute top-0 end-0 mt-1 me-2 d-flex justify-content-center align-items-center"
            style={{ width: '40px', height: '40px', backgroundColor: '#ffe2e3', borderRadius: '8px' }}
          >
            <i className="mdi mdi-chart-pie-outline" style={{ fontSize: "24px", color: `${import.meta.env.LIGHT_BLUE}` }}></i>
          </div>
          <div className="text-start mt-0">
            <p className="mb-1">Dyreste produkt</p>
            <h4 className="mb-1">${gethighestproduct?.salgpris_ex_moms}</h4>
          </div>
        </div>

        {/* Adjust the remaining cards similarly */}
      </div>
    </div>

    {/* Product Table Section */}
    <div className="mt-4 bg-white rounded shadow-lg" style={{ margin: '0 auto', padding: '1rem' }}>
      <ProductTable />
    </div>
  </div>
);
};

export default ProductPanel;