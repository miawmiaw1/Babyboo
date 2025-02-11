import { Form, Button, Col, Row } from "react-bootstrap";
import React, { useState } from "react";
import { AddCategorY } from "../../../FrontendRequests/Requests-Api/Category";
import { AddCategoryImage } from "../../../FrontendRequests/Requests-Api/Images";
import { Folders } from "../../../FrontendRequests/Enums/Images";
const AddCategory = () => {
  // State for form fields and image file
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const REQUIRED_WIDTH = 515;
  const REQUIRED_HEIGHT = 468;

  const cropImageToDimensions = (file: File, width: number, height: number): Promise<Blob | false> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = (event) => {
        if (event.target) {
          img.src = event.target.result as string;
        }
      };
  
      img.onload = () => {
        // Check if the image dimensions are smaller than the required dimensions
        if (img.width < width || img.height < height) {
          console.log("Image dimensions are smaller than the required dimensions.");
          resolve(false); // Return false if the dimensions are smaller
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
  
        console.log(`Image dimensions: ${img.width}x${img.height}. Adjusting to ${width}x${height}.`);
  
        // Process the image if dimensions do not match
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
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!categoryName.trim() || !categoryDescription.trim()) {
      alert("Venligst udfyld alle felter");
      return;
    }
  
    if (!selectedImage) {
      alert("Venligst upload et billede.");
      return;
    }
  
    cropImageToDimensions(selectedImage, REQUIRED_WIDTH, REQUIRED_HEIGHT)
      .then((croppedBlob) => {
        if (!croppedBlob) {
          alert("Billedet er for lille til at blive beskåret. Upload venligst et større billede.");
          return;
        }
  
        const croppedFile = new File([croppedBlob], selectedImage.name, {
          type: croppedBlob.type,
        });
  
        AddCategoryImage(
          croppedFile,
          Folders.CATEGORY,
          categoryName,
          "jpg",
        ).then((result) => {
          if (result.result) {
            AddCategorY(
              categoryName.trim(),
              result.data as string,
              categoryDescription.trim()
            ).then((result) => {
              if (result.result) {
                alert("Kategori tilføjet med succes!");
                window.location.href = "/"
              } else {
                alert("Kategori exsistere allerede");
              }
            });
          } else {
            alert(result.message);
          }
        });
      })
      .catch((err) => alert(`Fejl ved beskæring af billede: ${err.message}`));
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
            cursor: pointer;
            position: relative;
            padding: 1.5rem;
          }

          .upload-area.dragging {
            background-color: #e0f7fa;
            border-color: #6366f1;
          }

          .upload-area i {
            color: ${import.meta.env.LIGHT_PURPLE};
          }

          .upload-area p {
            font-size: 0.8rem;
            color: #666;
          }

          /* Hidden file input */
          .file-input {
            display: none;
          }
        `}
      </style>

      <div className="product-form container mt-4">
        {/* Header */}
        <Row>
          {/* Product Information */}
          <Col md={14}>
            <div className="text-center">
              <h1 className="form-title">Tilføj Kategori</h1>
            </div>
            <div className="card rounded shadow-lg mb-4">
              <div className="card-header">
                <h5 className="card-title">Kategori Information</h5>
              </div>
              <div className="card-body">
              <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="Navn"
                          className="input-text"
                          value={categoryName}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only letters and numbers, with max length of 15
                            setCategoryName(value);
                          }}
                          maxLength={15}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Beskrivelse</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Kategori Beskrivelse"
                      className="input-text"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                    />
                  </Form.Group>
              </div>
            </div>

            {/* Image upload */}
            <div className="card-body text-center">
              <div className="card-header">
                <h5 className="card-title">Tilføj billede</h5>

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

            {/* Publish button */}
            <div className="text-center">
            <Form onSubmit={handleSubmit}>
              <Button type="submit" className="rounded-btn">
                Gem kategori
              </Button>
            </Form>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AddCategory;
