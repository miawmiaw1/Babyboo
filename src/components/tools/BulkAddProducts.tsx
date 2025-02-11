import React, { useEffect, useRef, useState } from 'react';
import { Button, Alert, Spinner, Card, Row, Col, Form } from 'react-bootstrap';
import { AddProduct, type Product, type ProductColorSize } from "../../../FrontendRequests/Requests-Api/Product";
import type { ProductImage } from '../../../FrontendRequests/Requests-Api/ProductImages';
import { FetchAllCateGories, type Category } from '../../../FrontendRequests/Requests-Api/Category';
import { GetAllColors, type Color } from '../../../FrontendRequests/Requests-Api/Color';

const BulkAddProducts: React.FC = () => {
  const [selectedJson, setSelectedJson] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [Colors, setColors] = useState<Color[]>();
  const [categories, Setcategories] = useState<Category[]>();
  const [selectedcategoryid, Setselectedcategoryid] = useState<number>(0);

    const GetColors = async () => {
      try {
        const result = await GetAllColors();
        if (result.result) {
          setColors(result.data)
        }
      } catch (error) {
        console.error('Error Getting colors:', error);
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

        const handleCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
          const value = event.target.value;
          Setselectedcategoryid(Number(value)); // Update the state
        };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedJson(file);
      setError(null);
      readJsonFile(file);

      if (e.currentTarget) {
        e.currentTarget.value = '';  // Clear the file input value
      }
    } else {
      setError('Please upload a valid JSON file');
    }
  };

  function barcodegen(): number {
    let randomNum = ''; // Initialize as an empty string
    
    for (let i = 0; i < 12; i++) {
        // Append a random digit between 0 and 9
        randomNum += Math.floor(Math.random() * 10).toString();
    }

    return Number(randomNum); // Convert the string to a number before returning
}

  // Read and process the JSON file
  const readJsonFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        if (selectedcategoryid !== 0) {
          await processJsonData(jsonData);
        } else {
          alert("Vælg kategori")
        }
      } catch (e) {
        setError('Invalid JSON file format');
        console.error(e);
      }
    };
    reader.readAsText(file);
  };

  function mapImagesAndColors(images: [{color: string, link: string}]): { colors: ProductColorSize[], images: ProductImage[] } {
    const result: (null | { colors: ProductColorSize[], images: ProductImage[] })[] = images.map((image) => {
      // Find the color ID from the Colors array
      const colorId = Colors?.find(color => image.color === color.colorname)?.colorid;
  
      // Check if the colorId is valid (not null or undefined)
      if (colorId == null) {
        // If the colorId is null or undefined, return null
        return null;
      }
  
      // If colorId is valid, return the combined object
      return {
        colors: [{
          colorid: colorId as number,  // Safely cast to number
          sizeid: 1,
          quantity: 15
        }],
        images: [{
          imageid: 1,
          productid: 0,
          image_url: image.link, // Replace with actual image URL
          description: image.color,
          created_at: new Date().toISOString(),
        }]
      };
    });
  
    // Filter out any null entries (when colorId is invalid)
    const filteredResult = result.filter((item): item is { colors: ProductColorSize[], images: ProductImage[] } => item !== null);
  
    // Return the filtered and flattened arrays
    return {
      colors: filteredResult.flatMap(item => item.colors),  // Flatten the array of ProductColorSize[]
      images: filteredResult.flatMap(item => item.images),  // Flatten the array of ProductImage[]
    };
  }
  

  // Create the product object
  const createProductObject = (item: {name: string, description: string,
    features: string, link: string, købspris_ex_moms: number,  salgpris_ex_moms: number,  indgående_moms: number,  udgående_moms: number, tags: string, images: [{color: string, link: string}]
  }) => {

    const mappedimagesandcolors = mapImagesAndColors(item.images)

    return {
        productid: 0,
        name: item.name,
        description: item.description,
        features: item.features,
        link: item.link,
        købspris_ex_moms: item.købspris_ex_moms,
        salgpris_ex_moms: item.salgpris_ex_moms,
        indgående_moms: item.indgående_moms,
        udgående_moms: item.udgående_moms,
        tags: item.tags,
        barcode: barcodegen(),
        images: mappedimagesandcolors.images,
        productcolorsizes: mappedimagesandcolors.colors,
        manufacturer: "laundryfactory",
        categories: [{
            categoryid: selectedcategoryid,
            categoryname: "dsfsfd",
            categoryimage: "sdfdsf",
            categorydescription: "sdfsdfdf"
        }] as Category[],
      };
  }

  // Process the JSON data and add products
  const processJsonData = async (jsonData: any) => {
    setLoading(true);
    try {
      const newProducts = jsonData.map((item: {name: string, description: string,
        features: string, link: string, købspris_ex_moms: number,  salgpris_ex_moms: number,  indgående_moms: number,  udgående_moms: number, tags: string, images: [{color: string, link: string}]
      }) => {
        return createProductObject(item);
      });

      // Add products using AddProduct API
      for (const product of newProducts) {
        try {
          const response = await AddProduct(product, false);

          if (response.result) {
            console.log("Product added successfully:", response);
            setProducts((prevProducts) => [...prevProducts, response.data.product]);
          }
        } catch (error) {
          console.error("Error adding product:", error);
          setError('Error adding product');
        }
      }
    } catch (error) {
      console.error('Error processing product data:', error);
      setError('Error processing product data');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      GetColors();
      GetCategories();
    }, []);

  return (
    <div className="card rounded shadow-lg mb-4">
  <div className="card-header d-flex justify-content-between align-items-center">
    <h5 className="card-title">Upload JSON File</h5>
  </div>
  <div className="card-body text-center overflow-auto" style={{ maxHeight: '600px' }}>
    <div className="upload-area border rounded p-5">
      <p className="text-center">Upload a .json file</p>
      <p>{selectedJson ? selectedJson.name : 'Drag and drop your JSON file here'}</p>
      <div className="mb-3">
        <i className="mdi mdi-file-json mdi-48px"></i> {/* Material Design Icon for JSON */}
      </div>
      <p>Or</p>
      <input
        id="json-file-input"
        type="file"
        accept=".json"
        className="file-input"
        onChange={handleFileChange}
      />
    </div>

    <Form.Group className="mb-3">
      <Form.Select className="input-select" onChange={handleCategorySelect} defaultValue="Vælg kategori">
        <option disabled>Vælg kategori</option>
        {categories?.map((category) => (
          <option value={category.categoryid} key={category.categoryid}>
            {category.categoryname}
          </option>
        ))}
      </Form.Select>
    </Form.Group>

    {error && <Alert variant="danger">{error}</Alert>}
    {loading && <Spinner animation="border" />}

    {products.length > 0 && (
      <>
        <h3 className="mt-4">Uploaded Products</h3>
        <Row className="mt-4 flex-wrap">
          {products.map((product, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                <i className="mdi mdi-package mdi-48px"></i>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.productid}</Card.Text>
                  <Card.Text>{product.description}</Card.Text>
                  <Button variant="success">Product Added</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    )}
  </div>
</div>
  );
};

export default BulkAddProducts;
