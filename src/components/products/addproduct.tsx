import { Form, Button, Col, Row } from "react-bootstrap";
import React, {useEffect, useState } from 'react';
import { FetchAllCateGories } from "../../../FrontendRequests/Requests-Api/Category";
import type { Category } from "../../../FrontendRequests/Requests-Api/Category";
import { GetAllColors } from "../../../FrontendRequests/Requests-Api/Color";
import type { Color } from "../../../FrontendRequests/Requests-Api/Color";
import { GetAllSizes, type Sizes } from "../../../FrontendRequests/Requests-Api/Size";
import { AddProduct, type Product, type ProductColorSize, type ProductImage, DeleteProduct } from "../../../FrontendRequests/Requests-Api/Product";
import { AddProductImage, generateUniqueImageName } from "../../../FrontendRequests/Requests-Api/Images";
import { calculateProductTaxes, type ProductTaxResult } from "../../../FrontendRequests/Accounting/Momscalculator.ts";

const Addproduct = () => {
  const [ProductName, setProductName] = useState<string>("");
  const [Barcode, SetBarCode] = useState<number>();
  const [ProductDescription, setProductDescription] = useState<string>("");
  const [ProductPrice, setProductPrice] = useState<number>(0);
  const [ProductProfitMargin, setProductProfitMargin] = useState<number>(0);
  const [ProductManiFacturer, setProductManiFacturer] = useState<string>("");
  const [ProductCategory, setProductCategory] = useState<number>();
  const [productTags, setProductTags] = useState<string[]>([]);
  const [productFeatures, setproductFeatures] = useState<string[]>([]);
  const [ProductLink, setProductLink] = useState<string>("");
  const [productColor, setProductColor] = useState<Color>();
  const [productSize, setProductSize] = useState<Sizes>();
  const [ProductColorSize, setProductColorSize] = useState<ProductColorSize[]>([]);
  const [categories, Setcategories] = useState<Category[]>();
  const [colors, Setcolors] = useState<Color[]>();
  const [size, Setsize] = useState<Sizes[]>();
  const [activeButtonIndex, setActiveButtonIndex] = useState<number>();
  const [SelectedProductColorSize, setSelectedProductColorSize] = useState<ProductColorSize>();
  const [defaultproduct, setdefaultproduct] = useState<boolean>(false);
  const [Inkl_moms, setInkl_moms] = useState<boolean>(false);

  // State for form fields and image file
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const REQUIRED_WIDTH = 800;
  const REQUIRED_HEIGHT = 800;

  function barcodegen(): number {
    let randomNum = ''; // Initialize as an empty string
    
    for (let i = 0; i < 12; i++) {
        // Append a random digit between 0 and 9
        randomNum += Math.floor(Math.random() * 10).toString();
    }

    return Number(randomNum); // Convert the string to a number before returning
}

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
    setProductCategory(Number(value)); // Update the state
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


  const handleDeleteTag = (tagToDelete: string) => {
    setProductTags(productTags.filter((tag) => tag !== tagToDelete));
  };

  const handleDeleteFeature = (FeatureToDelete: string) => {
    setProductTags(productFeatures.filter((feature) => feature !== FeatureToDelete));
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

  const handleHoverProductColorSizes = (index: number, colorproductsize: ProductColorSize) => {
    setActiveButtonIndex(index)
    setSelectedProductColorSize(colorproductsize)
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
            alert(`Dimensioner (${img.width}x${img.height}) er mindre end påkrævet (${width}x${height}).`)
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
  
  // Handle form submission and validation
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!validateForm()) return;
    if (!selectedImage) {
      alert("Venligst upload et billede.");
      return;
    }
  
    try {
      const croppedFile = await cropAndValidateImage(selectedImage);
      const category = findCategoryById(ProductCategory as number);
      if (!category) {
        alert("Ugyldig kategori.");
        return;
      }

      const imagename = generateUniqueImageName();

      const taxresult = calculateProductTaxes(ProductPrice, ProductProfitMargin, Inkl_moms)
  
      const newProduct = createProductObject(category, imagename, taxresult);
      const productResponse = await AddProduct(newProduct, true);
  
      if (productResponse.result) {
        const imageUploadResult = await uploadProductImage(
          croppedFile,
          category.categoryname,
          productResponse.data.product.productid,
          imagename
        );
  
        if (imageUploadResult.result) {
          window.location.href = "/";
        } else {
          await revertProduct(productResponse.data.product.productid);
          alert("Billedupload fejlede. Produkt fjernet.");
        }
      } else {
        alert("Kunne ikke tilføje produkt.");
      }
    } catch (error) {
      console.error("Fejl:", error);
      alert("Noget gik galt. Prøv igen senere.");
    }
  };
  
  // Helper functions
  const validateForm = () => {
    if (!ProductName.trim()) {
      alert("Produkt navn er påkrævet.");
      return false;
    }
  
    if (!ProductLink.trim()) {
      alert("Produkt link er påkrævet.");
      return false;
    }
  
    if (Barcode === undefined) {
      alert("Barkode navn er påkrævet.");
      return false;
    }
  
    if (!ProductDescription.trim()) {
      alert("Produkt beskrivelse er påkrævet.");
      return false;
    }
  
    if (ProductPrice === 0) {
      alert("Produkt pris er påkrævet.");
      return false;
    }
  
    if (!ProductManiFacturer.trim()) {
      alert("Produkt Producent er påkrævet.");
      return false;
    }
  
    if (ProductCategory === undefined) {
      alert("Produkt Kategori er påkrævet.");
      return false;
    }
  
    if (productTags.length === 0) {
      alert("Mindst én tag er påkrævet.");
      return false;
    }
  
    if (ProductColorSize.length === 0) {
      alert("Mindst én farve/størrelse mulighed er påkrævet.");
      return false;
    }
  
    if (productFeatures.length === 0) {
      alert("Mindst én produktegenskab er påkrævet.");
      return false;
    }

    if (ProductProfitMargin === 0) {
      alert("Produkt fortjenelse er påkrævet.");
      return false;
    }
  
    return true;
  };
  
  const cropAndValidateImage = async (image: File): Promise<File> => {
    const croppedBlob = await cropImageToDimensions(image, REQUIRED_WIDTH, REQUIRED_HEIGHT);
    if (!croppedBlob) {
      throw new Error("Billedet er for lille til at blive uploadet.");
    }
    return new File([croppedBlob], image.name, { type: croppedBlob.type });
  };
  
  const findCategoryById = (categoryId: number) => {
    return categories?.find((cat) => cat.categoryid === categoryId) as Category;
  };
  
  const createProductObject = (category: Category, imagename: string, taxresult: ProductTaxResult): Product => ({
    productid: 0,
    name: ProductName.trim(),
    description: ProductDescription.trim(),
    features: productFeatures.join(","),
    link: ProductLink.trim(),
    købspris_ex_moms: taxresult.købspris_ex_moms,
    salgpris_ex_moms: taxresult.salgpris_ex_moms,
    indgående_moms: taxresult.indgående_moms,
    udgående_moms: taxresult.udgående_moms,
    tags: productTags.join(","),
    barcode: Barcode as number,
    images: [
      {
        imageid: 1,
        productid: 0,
        image_url: imagename,
        description: `${ProductName}`,
        created_at: new Date().toISOString(),
      },
    ] as ProductImage[],
    productcolorsizes: ProductColorSize,
    manufacturer: ProductManiFacturer.trim(),
    categories: [category],
  });
  
  const uploadProductImage = async (
    file: File,
    categoryName: string,
    productId: number,
    imagename: string
  ) => {
    return await AddProductImage(file, categoryName, productId.toString(), imagename, "jpg");
  };
  
  const revertProduct = async (productId: number) => {
    await DeleteProduct(productId);
  };

  // Handle file selection via input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
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

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    } else {
      alert("Venligst upload et gyldigt billede.");
    }
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
    SetBarCode(barcodegen())
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
                          value={Barcode}
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
            <div className="card rounded shadow-lg mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Tilføj billede</h5>
              </div>
              <div className="card-body text-center">
              <div
                  className={`upload-area border rounded p-5 ${dragging ? "dragging" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <p className="text-center">H: {REQUIRED_HEIGHT} x W: {REQUIRED_WIDTH} Pixels</p>
                  <p>Hjemmesiden beskærer automatisk billeder til den rette størrelse</p>

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
        <Col md={6}>
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
        <Col md={6}>
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
              <p style={{fontSize: "0.8rem", textAlign: "center", fontWeight: "bolder"}}>Dobbel klik for at slette</p>
              <div className="selected-sizes mt-3">
              {ProductColorSize?.map((colorsizes, index) => (
                <button
                  key={index} // Adding a unique key for each button
                  type="button"
                  aria-label="Delete"
                  onClick={() => handleHoverProductColorSizes(index as number, colorsizes)}
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
                  <Form.Label className="form-label">Pris på produkt</Form.Label>
                  <Form.Control
                        type="number"
                        placeholder="Pris" // Consider changing the placeholder to something more relevant for numerical input
                        className="input-text"
                        min="0" // Optional: sets the minimum value allowed
                        step="1" // Optional: sets the step size for numeric increments
                        value={Number(ProductPrice)}
                        onChange={(e) => setProductPrice(Number(e.target.value))}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                  <Form.Label className="form-label">Fortjenelse (hvormeget du vil tjene på produktet)</Form.Label>
                  <Form.Control
                        type="number"
                        placeholder="%" // Consider changing the placeholder to something more relevant for numerical input
                        className="input-text"
                        min="0" // Optional: sets the minimum value allowed
                        step="1" // Optional: sets the step size for numeric increments
                        value={Number(ProductProfitMargin)}
                        onChange={(e) =>setProductProfitMargin(Number(e.target.value))}
                    />
                  </Form.Group>
                </Form>
              </div>
            </div>

              {/* Moms */}
              <div className="card rounded shadow-lg mb-4">
              <div className="card-header">
                <h5 className="card-title">Moms informationer</h5>
              </div>
              <div className="card-body">
                <Form>
                  <Form.Group>
                    <Form.Label className="form-label">Indgående moms (købsmoms)</Form.Label>
                    <Form.Check
                      type="switch"
                      id="neutral-product-switch"
                      checked={Inkl_moms}
                      onChange={(e) => setInkl_moms(e.target.checked)}
                      readOnly
                      className="custom-switch"
                      label="Produktet er købt med moms" /* Add the label next to the checkbox */
                      style={{ display: 'flex', alignItems: 'center' }} /* Align label and checkbox */
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
                  <Form.Select className="input-select" onChange={handleCategorySelect} defaultValue="Vælg kategori">
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

export default Addproduct;