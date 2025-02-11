import { Form, Button, Col, Row } from "react-bootstrap";
import React, {useEffect, useState } from 'react';
import { FetchAllCateGories, type Category } from "../../../FrontendRequests/Requests-Api/Category";
import { GetAllColors, type Color } from "../../../FrontendRequests/Requests-Api/Color";
import { GetAllSizes, type Sizes } from "../../../FrontendRequests/Requests-Api/Size";
import {type Product, type ProductColorSize, type ProductImage, UpdateProduct, GetProduct } from "../../../FrontendRequests/Requests-Api/Product";
import {DeleteProductImages, AddProductImages} from "../../../FrontendRequests/Requests-Api/ProductImages";
import { AddProductImage, DeleteProductImage, generateUniqueImageName } from "../../../FrontendRequests/Requests-Api/Images";
import _ from 'lodash';

interface Props {
  product: Product;
}

const EditProduct = ({product}: Props) => {
  const [ProductName, setProductName] = useState<string>("");
  const [ProductDescription, setProductDescription] = useState<string>("");
  const [ProductPrice, setProductPrice] = useState<number>();
  const [ProductManiFacturer, setProductManiFacturer] = useState<string>("");
  const [ProductCategory, setProductCategory] = useState<Category>();
  const [productTags, setProductTags] = useState<string[]>([]);
  const [productFeatures, setproductFeatures] = useState<string[]>([]);
  const [ProductLink, setProductLink] = useState<string>("");
  const [productColor, setProductColor] = useState<Color>();
  const [productSize, setProductSize] = useState<Sizes>();
  const [ProductColorSize, setProductColorSize] = useState<ProductColorSize[]>([]);
  const [ProductImages, setProductImages] = useState<ProductImage[]>();
  const [categories, Setcategories] = useState<Category[]>();
  const [colors, Setcolors] = useState<Color[]>();
  const [size, Setsize] = useState<Sizes[]>();
  const [activeButtonIndex, setActiveButtonIndex] = useState<number>();
  const [SelectedProductColorSize, setSelectedProductColorSize] = useState<ProductColorSize>();
  const [defaultproduct, setdefaultproduct] = useState<boolean>(false);

  // State for form fields and image file
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const REQUIRED_WIDTH = 800;
  const REQUIRED_HEIGHT = 800;

  async function handleDeleteImage(image: ProductImage) {
    DeleteProductImage(image.image_url).then(result => {
      if(result.result) {
        DeleteProductImages(image.imageid).then(databaseimageresult => {
          if (databaseimageresult.result) {
            GetProductImages(product.productid.toString())
          } else {
            alert("image cannot be deleted from database")
          }
        })  
      } else {
        alert("Image cannot be deleted from server")
      }
    })
  }

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

    const HandleFormCheck = async (checked: boolean) => {
      try {
        setdefaultproduct(checked)
        if (checked) {
          setProductColorSize([])
          checkAndAddProductColorSize(colors?.find(color => color.colorname === "Default") as Color, size?.find(size => size.sizename === "Default") as Sizes)
        } else {
          setProductColorSize([])
        }
      } catch (error) {
        console.error('Error Setting Product variant:', error);
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

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      const input = event.target as HTMLInputElement;
      const newTag = input.value.trim();

      if (newTag && !productTags.includes(newTag)) {
        setProductTags([...productTags, newTag]); // Append new tag
        input.value = ''; // Clear input
      }
    }
  };

  const handleAddFeature = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      const input = event.target as HTMLInputElement;
      const newFeature = input.value.trim();

      if (newFeature && !productFeatures.includes(newFeature)) {
        setproductFeatures([...productFeatures, newFeature]); // Append new tag
        input.value = ''; // Clear input
      }
    }
  };

  const handleCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const category = categories?.find(cat => cat.categoryid == Number(value)) as Category
    setProductCategory(category); // Update the state
  };

  const handleColorSelect = (e: { target: { value: any; }; }) => {
    const color = colors?.find((color) => color.colorid === Number(e.target.value)) || null;
    setProductColor(color as Color);
    checkAndAddProductColorSize(color as Color, productSize as Sizes);
  };

  const handleSizeSelect = (e: { target: { value: any; }; }) => {
    const sizes = size?.find((sizes) => sizes?.sizeid === Number(e.target.value)) || null;
    setProductSize(sizes as Sizes);
    checkAndAddProductColorSize(productColor as Color, sizes as Sizes);
  };


  const handleDeleteTag = (tagToDelete: string) => {
    setProductTags(productTags.filter((tag) => tag !== tagToDelete));
  };

  const handleDeleteFeature = (FeatureToDelete: string) => {
    setproductFeatures(productFeatures.filter((feature) => feature !== FeatureToDelete));
  };

  const handleDeleteColor = (colorid: number) => {
    setProductColorSize((prev) => prev.filter((productColorSize) => productColorSize.colorid !== colorid));
  };

  const handleDeletesizes = (sizeid: Number) => {
    setProductColorSize((prev) => prev.filter((productColorSize) => productColorSize.sizeid !== sizeid));
  };

  const handleDeleteProductColorSizes = (ProductColorSizeDelete: ProductColorSize) => {
    setProductColorSize(ProductColorSize.filter((productcolorsize) => productcolorsize !== ProductColorSizeDelete));
  };

  const handleHoverProductColorSizes = (index : number, colorproductsize: ProductColorSize) => {
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

  const checkAndAddProductColorSize = (color: Color, size: Sizes) => {
    if (color && size) {
      const newEntry: ProductColorSize = {
        colorid: color.colorid,  
        colorname: color.colorname,
        sizeid: size.sizeid,
        sizename: size.sizename,    
        quantity: 0            
      };

      const exists = ProductColorSize.some(
        (item) => item.colorid === newEntry.colorid && item.sizeid === newEntry.sizeid
      );

      if (!exists) {
        setProductColorSize((prev) => [...prev, newEntry]);
      }

      // Reset the selections
      setProductColor;
      setProductSize;
    }
  };

    // Function to check image dimensions
    const cropImageToDimensions = (
      file: File,
      width: number,
      height: number
    ): Promise<Blob | false> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
    
        reader.onload = (event) => {
          if (event.target) {
            img.src = event.target.result as string;
          }
        };
    
        img.onload = () => {
          // Check if the image is smaller than the required dimensions
          if (img.width < width || img.height < height) {
            console.log(
              `Image dimensions (${img.width}x${img.height}) are smaller than required (${width}x${height}).`
            );
            resolve(false);
            return;
          }
    
          // Check if the image already matches the required dimensions
          if (img.width === width && img.height === height) {
            console.log(`Image is already at the required dimensions: ${width}x${height}`);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
    
            if (!ctx) {
              reject(new Error("Canvas context not found."));
              return;
            }
    
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to convert canvas to Blob."));
              }
            }, "image/jpeg");
            return;
          }
    
          console.log(
            `Image dimensions: ${img.width}x${img.height}. Adjusting to ${width}x${height}.`
          );
    
          // Process the image if dimensions are larger
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
    
          if (!ctx) {
            reject(new Error("Canvas context not found."));
            return;
          }
    
          // Set canvas dimensions to the required size
          canvas.width = width;
          canvas.height = height;
    
          // Calculate the cropping region
          const cropWidth = Math.min(img.width, img.height * (width / height));
          const cropHeight = Math.min(img.height, img.width * (height / width));
          const cropX = (img.width - cropWidth) / 2;
          const cropY = (img.height - cropHeight) / 2;
    
          // Draw the cropped image to the canvas
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            width,
            height
          );
    
          // Convert the canvas to a Blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert canvas to Blob."));
            }
          }, "image/jpeg");
        };
    
        img.onerror = () => reject(new Error("Failed to load image."));
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
      });
    };

    const cropAndValidateImage = async (image: File): Promise<File> => {
      const croppedBlob = await cropImageToDimensions(image, REQUIRED_WIDTH, REQUIRED_HEIGHT);
      if (!croppedBlob) {
        throw new Error("Billedet er for lille til at blive uploadet.");
      }
      return new File([croppedBlob], image.name, { type: croppedBlob.type });
    };
  
  // Handle form submission and validation
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Simple validation: Check if fields are empty
    if (!ProductName.trim() || 
        !ProductLink.trim() ||
        !ProductDescription.trim() ||  
        !ProductManiFacturer.trim() || 
        ProductCategory === undefined || 
        productTags.length === 0 || 
        ProductColorSize.length === 0 || 
        productFeatures.length === 0) {
        
        alert("Venligst udfyld alle felter");
        return;
    }

    let objectresult = {
      result: false,
      category: null as Category | null,
      newproduct: null as Product | null // or any other type if known
    };

    let NewProduct: Product = _.cloneDeep(product);

    NewProduct.name = ProductName.trim();
    NewProduct.description = ProductDescription.trim();
    NewProduct.manufacturer = ProductManiFacturer.trim();
    NewProduct.categories[0] = ProductCategory; 
    NewProduct.tags = productTags.join(',');
    NewProduct.productcolorsizes = ProductColorSize;
    NewProduct.features = productFeatures.join(',');
    NewProduct.link = ProductLink.trim();
    try {
      if (!_.isEqual(NewProduct, product)) {

        objectresult.result = true,
        objectresult.category = NewProduct.categories[0];
        objectresult.newproduct = NewProduct;
      } else {
        objectresult.result = false,
        objectresult.category = null;
        objectresult.newproduct = null;
      }

    } catch {
      objectresult.result = false,
      objectresult.category = null;
      objectresult.newproduct = null;
    }

    if (objectresult.result) {
      UpdateProduct(objectresult.newproduct as Product).then(result => {
        alert("Produkt er opdateret")
      })
    }
  };

  // Handle file selection via input
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      
      const croppedFile = await cropAndValidateImage(file as File);

      if (ProductImages && ProductImages?.length < 5) {

        const uniquename = generateUniqueImageName();
        AddProductImage(croppedFile, product.categories[0].categoryname, product.productid.toString(), uniquename, "jpg").then((result => {
          if (result.result) {
            const newProductImage: ProductImage = {
              imageid: 1,
              productid: product.productid,
              image_url: result.data as string,
              description: "Sample product image",
              created_at: new Date().toISOString() // use current timestamp
            };
            AddProductImages(newProductImage).then(result => {
                if (result.result) {
                  GetProductImages(product.productid.toString());
                } else {
                  alert("Kunne ikke uploade billede")
                }
            })
          } else {
            alert(result.message)
          }
        }))
      } else {
        alert("Maksimumgrænsen på 5 billeder er nået")
      }
    } else {
      alert("Venligst upload et gyldigt billede.");
    }
  };

  // Handle drag-and-drop functionality
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);

      const croppedFile = await cropAndValidateImage(file as File);

      if (ProductImages && ProductImages?.length < 5) {

        const uniquename = generateUniqueImageName();
        AddProductImage(croppedFile, product.categories[0].categoryname, product.productid.toString(), uniquename, "jpg").then((result => {
          if (result.result) {
            const newProductImage: ProductImage = {
              imageid: 1,
              productid: product.productid,
              image_url: result.data as string,
              description: "Sample product image",
              created_at: new Date().toISOString() // use current timestamp
            };
            AddProductImages(newProductImage).then(result => {
                if (result.result) {
                  GetProductImages(product.productid.toString());
                } else {
                  alert("Kunne ikke uploade billede")
                }
            })
          } else {
            alert(result.message)
          }
        }))
      } else {
        alert("Maksimumgrænsen på 5 billeder er nået")
      }
    } else {
      alert("Venligst upload et gyldigt billede.");
    }
  };

  const setformcheck = (productcolorsizes : ProductColorSize[]) => {
    const result = productcolorsizes?.find(productcolorsizes => productcolorsizes.colorname === "Default");

    if (result !== undefined) {
      setdefaultproduct(true)
    } else {
      setdefaultproduct(false)
    }
  };

  useEffect(() => {
    GetCategories();
    GetColors();
    Getsizes();
    GetProductImages(product.productid.toString());
    setProductName(product.name)
    setProductLink(product.link)
    setProductDescription(product.description)
    setproductFeatures(product.features.split(","))
    setProductPrice((Number(product.salgpris_ex_moms) + Number(product.udgående_moms)))
    setProductTags(product.tags.split(","))
    setProductManiFacturer(product.manufacturer)
    setProductCategory(product.categories[0])
    setProductColorSize(JSON.parse(JSON.stringify(product.productcolorsizes)));
    setformcheck(JSON.parse(JSON.stringify(product.productcolorsizes)));
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
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="form-title">Tilføj produkt</h1>
          <div>
          <Form onSubmit={handleSubmit}>
              <Button type="submit" className="rounded-btn">
                Gem Produkt
              </Button>
            </Form>
          </div>
        </div>

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
                          value={ProductName}
                          onChange={(e) => {
                            const value = e.target.value;
                            setProductName(value);
                          }}
                          maxLength={25}
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
                          value={ProductDescription.toString()}
                          onChange={(e) => setProductDescription(e.target.value)}
                        />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Link</Form.Label>
                    <Form.Control
                          type="text"
                          placeholder="Produkt Link"
                          className="input-text"
                          value={ProductLink.toString()}
                          onChange={(e) => setProductLink(e.target.value)}
                        />
                  </Form.Group>
                </Form>
              </div>
            </div>

            {/* Product Image */}
            <div className="card-body text-center">
              <div className="card-header position-relative">
                <h5 className="card-title">Tilføj billede</h5>
                
                {/* Button for uploading image */}
                <div
                  className={`upload-area border rounded p-5 ${dragging ? "dragging" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <p className="text-center">H: {REQUIRED_HEIGHT} x W: {REQUIRED_WIDTH} Pixels</p>
                  <div className="mb-3">
                    <i className="mdi mdi-upload mdi-48px"></i>
                  </div>
                  <p>{selectedImage ? selectedImage.name : "Træk og slip dit billede her"}</p>
                  <p>Eller</p>
                  <Button className="rounded-btn" onClick={() => document.getElementById('file-input')?.click()}>
                    Gennemse billede
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Placeholder images section */}
              <div className="image-placeholders d-flex justify-content-start gap-2 mt-2">
                <div className="d-flex mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="position-relative">
                    {/* Delete Icon */}
                    {ProductImages && ProductImages?.length > 1 && ProductImages?.[index] && (
                      <i
                        className="mdi mdi-delete position-absolute top-0" 
                        style={{
                          fontSize: '16px',
                          color: 'red',
                          cursor: 'pointer',
                          right: '5px', 
                          zIndex: 2
                        }}
                        onClick={() => handleDeleteImage(ProductImages[index])} // Function to handle delete action
                      ></i>
                    )}

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
                    <style>
                      {`
                        .custom-switch .form-check-input:checked {
                          background-color: ${import.meta.env.LIGHT_PURPLE};
                          border-color: ${import.meta.env.LIGHT_PURPLE};
                        }
                
                        .custom-switch .form-check-input {
                          height: 20px; /* Increase height of the checkbox */
                        }
                
                        .custom-switch .form-check-label {
                          margin-left: 10px; /* Space between checkbox and label */
                          margin-top: 8px;
                          font-size: 16px; /* Adjust font size */
                        }
                      `}
                    </style>
                
                    <Form.Check
                      type="switch"
                      id="neutral-product-switch"
                      checked={defaultproduct}
                      onChange={(e) => HandleFormCheck(e.target.checked)}
                      readOnly
                      className="custom-switch"
                      label="Produktet er Neutral" /* Add the label next to the checkbox */
                      style={{ display: 'flex', alignItems: 'center' }} /* Align label and checkbox */
                    />
              </div>
              <div className="card-body">
                <Form>
                  <Row className="mb-3">
                    <Col md={5}>
                    <Form.Group>
                    <Form.Select className="input-select" onChange={handleColorSelect} defaultValue="Vælg farver" disabled={defaultproduct}>
                    <option disabled>Vælg farver</option>
                    {colors?.filter((color) => color.colorname !== "Default").map((color) => (
                      <option value={color.colorid}>
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
                            onClick={() => handleDeleteColor(color.colorid)}
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
                      <Form.Select className="input-select" onChange={handleSizeSelect} defaultValue="Vælg størrelse" disabled={defaultproduct}>
                        <option disabled>Vælg størrelse</option>
                        {size?.filter((sizes) => sizes.sizename !== "Default").map((sizes) => (
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
                                onClick={() => handleDeletesizes(size.sizeid)}
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
                  onDoubleClick={() => handleDeleteProductColorSizes(colorsizes)}
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
                        value={Number(ProductPrice)}
                        disabled
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
                  <Form.Select className="input-select" onChange={handleCategorySelect} value={ProductCategory?.categoryid}>
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
                      value={ProductManiFacturer.toString()}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only letters and numbers, with max length of 15
                        if (/^[a-zA-Z0-9]*$/.test(value) && value.length <= 15) {
                          setProductManiFacturer(value);
                        }
                      }}
                      maxLength={15}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="form-label">Tags</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Indtast Tags"
                      className="input-text"
                      onKeyDown={handleAddTag} // Add tag on Enter
                      maxLength={10}
                    />
                    <div className="tags-list mt-3">
                      {productTags.map((tag, index) => (
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => handleDeleteTag(tag)}
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
                      onKeyDown={handleAddFeature} // Add tag on Enter
                    />
                    <div className="feature-list mt-3">
                      {productFeatures.map((feature, index) => (
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => handleDeleteFeature(feature)}
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

export default EditProduct;