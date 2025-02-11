import { Form, Col, Row } from "react-bootstrap";
import React, {useEffect, useState } from 'react';
import { FetchAllCateGories, type Category } from "../../../FrontendRequests/Requests-Api/Category";
import { GetAllColors, type Color } from "../../../FrontendRequests/Requests-Api/Color";
import { GetAllSizes, type Sizes } from "../../../FrontendRequests/Requests-Api/Size";
import { type Product, type ProductColorSize, type ProductImage, GetProduct } from "../../../FrontendRequests/Requests-Api/Product";
import _ from 'lodash';

interface Props {
  product: Product;
}

const ViewProduct = ({product}: Props) => {
  const [productTags, setProductTags] = useState<string[]>([]);
  const [productFeatures, setproductFeatures] = useState<string[]>([]);
  const [ProductColorSize, setProductColorSize] = useState<ProductColorSize[]>([]);
  const [ProductImages, setProductImages] = useState<ProductImage[]>();
  const [categories, Setcategories] = useState<Category[]>();
  const [colors, Setcolors] = useState<Color[]>();
  const [size, Setsize] = useState<Sizes[]>();
  const [activeButtonIndex, setActiveButtonIndex] = useState<number>();
  const [SelectedProductColorSize, setSelectedProductColorSize] = useState<ProductColorSize>();

  const GetProductImages = async (productid: string) => {
    try {
      if (productid !== null) {
        const result = await GetProduct(productid);
        if (result.result) {
          setProductImages((result.data as Product).images);
        }
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

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

  const GetColors = async () => {
    try {
      const result = await GetAllColors();
      if (result.result) {
        Setcolors(result.data)
      }
    } catch (error) {
      console.error('Error Getting colors:', error);
    }
  };

  const Getsizes = async () => {
    try {
      const result = await GetAllSizes();
      if (result.result) {
        Setsize(result.data)
      }
    } catch (error) {
      console.error('Error Getting sizes:', error);
    }
  };

  const handleHoverProductColorSizes = (index:number, colorproductsize: ProductColorSize) => {
    setActiveButtonIndex(index)
    setSelectedProductColorSize(colorproductsize)
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value); // Convert the input value to a number

    setProductColorSize((prev) => {
      const updatedSizes = [...prev]; // Copy the previous state
      const index = updatedSizes.findIndex(
        (item) =>
          item.colorid === SelectedProductColorSize?.colorid &&
          item.sizeid === SelectedProductColorSize?.sizeid
      ); // Find the index of the selected object

      if (index !== -1) {
        updatedSizes[index].quantity = newQuantity; // Update the quantity if found
      }

      return updatedSizes; // Return the updated array
    });
  };

  useEffect(() => {
    GetCategories();
    GetColors();
    Getsizes();
    GetProductImages(product.productid.toString());
    setproductFeatures(product.features.split(","))
    setProductTags(product.tags.split(","))
    setProductColorSize(product.productcolorsizes)
  }, []);
  return (
    <>
      <style>
        {`
          /* Font & Typography */
          body, .form-title, .card-title, .form-label {
            font-family: 'Inter', sans-serif;
            font-size: 0.7rem;
          }

          .form-title {
            font-size: 1.3rem;
            font-weight: 400;
            color: #333;
          }

          .card-header {
            background-color: #f9f9f9;
            border-bottom: none;
            padding: 1rem;
          }

          .card-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: #333;
          }

          .card-body {
            padding: 1.5rem;
          }

          /* Input and Select Styling */
          .input-text, .input-select {
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            padding: 0.75rem;
            font-size: 0.8rem;
            transition: all 0.2s ease-in-out;
          }

          .input-text:focus, .input-select:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          }

          /* Button Styling */
          .rounded-btn {
            border-radius: 8px;
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
            background-color: ${import.meta.env.LIGHT_PURPLE}
          }

          .rounded-btn:hover {
            background-color: ${import.meta.env.LIGHT_PURPLE};
            color: #fff;
            transition: all 0.2s ease-in-out;
          }

          button:focus {
            outline: none;
          }

          /* Upload Area */
          .upload-area {
            border: 2px dashed #e0e0e0;
            border-radius: 12px;
            background-color: #f9f9f9;
          }

          .upload-area i {
            color: ${import.meta.env.LIGHT_PURPLE};
          }

          .upload-area p {
            font-size: 0.8rem;
            color: #666;
          }
          .file-input {
            display: none;
          }
        `}
      </style>

      <div className="product-form container mt-4">

        <Row>
          {/* Product Information */}
          <Col md={8}>
            <div className="card rounded shadow-lg mb-4">
              <div className="card-header">
                <h5 className="card-title">Produkt Information</h5>
              </div>
              <div className="card-body">
                <Form>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Produkt Navn"
                          className="input-text"
                          value={product.name}
                          maxLength={15}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                      <Form.Control
                          type="number"
                          placeholder="Barkode"
                          className="input-text"
                          value={product.barcode}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Beskrivelse</Form.Label>
                    <Form.Control
                          type="text"
                          placeholder="Produkt Beskrivelse"
                          className="input-text"
                          value={product.description}
                        />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Link</Form.Label>
                    <Form.Control
                          type="text"
                          placeholder="Produkt Link"
                          className="input-text"
                          value={product.link}
                        />
                  </Form.Group>
                </Form>
              </div>
            </div>

            {/* Product Image */}
            <div className="card-body text-center">

              {/* Placeholder images section */}
              <div className="image-placeholders d-flex justify-content-start gap-2 mt-2">
                <div className="d-flex mt-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="position-relative">

                      {/* Placeholder or Image */}
                      <div 
                        className="placeholder-container rounded-2" 
                        style={{
                          width: '120px', 
                          height: '120px',
                          backgroundColor: '#f0f0f0', // Light background color for placeholders
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: ProductImages?.[index] ? 'none' : '2px dashed #ccc', // Dashed border for empty placeholders
                          position: 'relative'
                        }}
                      >
                        {ProductImages?.[index] ? (
                          <img
                            className="rounded-2 w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            src={ProductImages[index].image_url}
                            alt={`Uploaded ${index + 1}`}
                          />
                        ) : (
                          <span style={{ color: '#aaa' }}>No Image</span> // Placeholder text or icon when image is not present
                        )}
                      </div>
                    </div>
                  ))}
                </div>
</div>
            </div>

            {/* Variants */}
            <div className="card rounded shadow-lg mb-4">
              <div className="card-header">
                <h5 className="card-title">Varianter</h5>
              </div>
              <div className="card-body">
                <Form>
                  <Row className="mb-3">
                    <Col md={5}>
                    <Form.Group>
                    <Form.Select className="input-select" defaultValue="Vælg farver" disabled>
                      <option disabled>Vælg farver</option>
                      {colors?.map((color) => (
                        <option key={color.colorid} value={color.colorid}>
                          {color.colorname}
                        </option>
                      ))}
                    </Form.Select>

                  <div className="selected-colors mt-3">
                    {ProductColorSize
                      .filter((productColorSize, index, self) =>
                        index === self.findIndex((p) => p.colorid === productColorSize.colorid)
                      )
                      .map((color) => (
                        <button
                            key={color.colorid} // Use colorid as the unique key for each button
                            type="button"
                            aria-label="Delete"
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: `${import.meta.env.LIGHT_PURPLE}`,
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              marginRight: "5px",
                            }}
                          >
                          {color.colorname}
                        </button>
                      ))}
                  </div>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group>
                      <Form.Select className="input-select" defaultValue="Vælg størrelse" disabled>
                        <option disabled>Vælg størrelse</option>
                        {size?.map((sizes) => (
                          <option value={sizes.sizeid}>
                              {sizes.sizename}
                          </option>
                          ))}
                      </Form.Select>
                      <div className="selected-sizes mt-3">
                        {ProductColorSize
                          .filter((productColorSize, index, self) =>
                            index === self.findIndex((p) => p.sizeid === productColorSize.sizeid)
                          )
                          .map((size) => (
                            <button
                                key={size.sizeid} // Use colorid as the unique key for each button
                                type="button"
                                aria-label="Delete"
                                style={{
                                  fontSize: '0.75rem',
                                  backgroundColor: `${import.meta.env.LIGHT_PURPLE}`,
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '2px 6px',
                                  marginRight: "5px",
                                }}
                              >
                              {size.sizename}
                            </button>
                          ))}
                        </div>
                    </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>

            {/* Inventory */}
            <div className="card rounded shadow-lg mb-4">
              <div className="card-header">
                <h5 className="card-title">Inventar</h5>
              </div>
              <div className="card-body">
              <p style={{fontSize: "0.8rem", textAlign: "center"}}>Du kan ændre antal på produkt varianterne her</p>
              <p style={{fontSize: "0.8rem", textAlign: "center"}}>Klik på varianten og ændre antallet</p>
              <p style={{fontSize: "0.8rem", textAlign: "center"}}>Dobbel klik for at slette</p>
              <div className="selected-sizes mt-3">
              {ProductColorSize?.map((colorsizes, index) => (
                <button
                  key={index} // Adding a unique key for each button
                  type="button"
                  aria-label="Delete"
                  onClick={() => handleHoverProductColorSizes(index, colorsizes)}
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: `${colorsizes.colorname}`,
                    color: colorsizes.colorname?.toLowerCase() === 'white' ? 'black' : 'white',
                    border: activeButtonIndex === index ? '2px solid black' : 'none',
                    borderRadius: '4px',
                    marginRight: '5px',
                  }}
                >
                  {colorsizes.sizename}
                </button>
              ))}
            </div>

                <Form>
                  <Row className="mb-3">
                  <Form.Group className="justify-content-center mt-3">
                      <Form.Control
                          type="number"
                          placeholder="Indtast Antal" // Consider changing the placeholder to something more relevant for numerical input
                          className="input-text"
                          min="0" // Optional: sets the minimum value allowed
                          step="1" // Optional: sets the step size for numeric increments
                          value={SelectedProductColorSize?.quantity}
                          onChange={handleQuantityChange} // Update quantity directly in the onChange handler
                      />
                    </Form.Group>
                    <Col md={5}>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>

          {/* Sidebar */}
          <Col md={4}>
            {/* Pricing */}
            <div className="card rounded shadow-lg mb-4">
              <div className="card-header">
                <h5 className="card-title">Pris</h5>
              </div>
              <div className="card-body">
                <Form>
                  <Form.Group className="mb-3">
                  <Form.Control
                        type="number"
                        placeholder="Pris" // Consider changing the placeholder to something more relevant for numerical input
                        className="input-text"
                        min="0" // Optional: sets the minimum value allowed
                        step="1" // Optional: sets the step size for numeric increments
                        value={Number((Number(product.salgpris_ex_moms) + Number(product.udgående_moms)))}
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>

            {/* Organize */}
            <div className="card rounded shadow-lg mb-4">
              <div className="card-header">
                <h5 className="card-title">Originalitet</h5>
              </div>
              <div className="card-body">
                <Form>
                <Form.Group className="mb-3">
                  <Form.Select className="input-select" defaultValue={product.categories[0].categoryname} disabled>
                    <option disabled>Vælg kategori</option>
                    {categories?.map((category) => (
                      <option value={category.categoryid}>
                          {category.categoryname}
                      </option>
                      ))}
                  </Form.Select>
                </Form.Group>
                  <Form.Group>
                    <Form.Label className="form-label">Producent</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Producent"
                      className="input-text"
                      value={product.manufacturer}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="form-label">Tags</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Indtast Tags"
                      className="input-text"
                      value=""
                    />
                    <div className="tags-list mt-3">
                      {productTags.map((tag, index) => (
                        <button
                          type="button"
                          aria-label="Delete"
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: `${import.meta.env.LIGHT_PURPLE}`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            marginRight: "5px",
                            marginBottom: "5px"
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="form-label">Features</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Indtast Features"
                      className="input-text"
                      value=""
                    />
                    <div className="feature-list mt-3">
                      {productFeatures.map((feature, index) => (
                        <button
                          type="button"
                          aria-label="Delete"
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: `${import.meta.env.LIGHT_PURPLE}`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            marginRight: "5px",
                            marginBottom: "5px"
                          }}
                        >
                          {feature}
                        </button>
                      ))}
                    </div>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ViewProduct;