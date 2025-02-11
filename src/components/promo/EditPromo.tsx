import { Button, Col, Row } from "react-bootstrap";
import React, {useState } from 'react';
import { Folders, Identifier } from "../../../FrontendRequests/Enums/Images";
import { AddMediaImage } from "../../../FrontendRequests/Requests-Api/Images";

interface Props {
  identifier: string
}

const Editpromo = ({identifier}: Props) => {
  // State for form fields and image file
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  // Handle file selection via input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)

      if (identifier === Identifier.BANNER1) {
        AddMediaImage(file, Folders.MEDIA, Identifier.BANNER1, "jpg").then((result => {
          if (result.result) {
            alert("Banner billede er uploaded")
          } else {
            alert(result.message)
          }
        }))
      } else if (identifier === Identifier.BANNER2) {
          AddMediaImage(file, Folders.MEDIA, Identifier.BANNER2, "jpg").then((result => {
            if (result.result) {
              alert("Banner billede er uploaded")
            } else {
              alert(result.message)
            }
          }))
      } else if (identifier === Identifier.NAVBAR) {

        AddMediaImage(file, Folders.MEDIA, Identifier.NAVBAR, "jpg").then((result => {
          if (result.result) {
            alert("Navigation bar billede er uploaded")
          } else {
            alert(result.message)
          }
        }))

      } else if (identifier === Identifier.FAVICON) {
        const fileExtension = file.name?.split('.').pop()?.toLowerCase();

        if (fileExtension == "svg") {
          AddMediaImage(file, Folders.MEDIA, Identifier.FAVICON, "svg").then((result => {
            if (result.result) {
              alert("FavIcon billede er uploaded")
            } else {
              alert(result.message)
            }
          }))
        } else {
          alert("Uploaded billede er ikke i .svg format")
        }
      } else if (identifier === Identifier.DELIVERY) {
        AddMediaImage(file, Folders.MEDIA, Identifier.DELIVERY, "jpg").then((result => {
          if (result.result) {
            alert("Delivery billede er uploaded")
          } else {
            alert(result.message)
          }
        }))
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

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)

      if (identifier === Identifier.BANNER1) {
        AddMediaImage(file, Folders.MEDIA, Identifier.BANNER1, "jpg").then((result => {
          if (result.result) {
            alert("Banner billede er uploaded")
          } else {
            alert(result.message)
          }
        }))
      } else if (identifier === Identifier.BANNER2) {
          AddMediaImage(file, Folders.MEDIA, Identifier.BANNER2, "jpg").then((result => {
            if (result.result) {
              alert("Banner billede er uploaded")
            } else {
              alert(result.message)
            }
          }))
      } else if (identifier === Identifier.NAVBAR) {

        AddMediaImage(file, Folders.MEDIA, Identifier.NAVBAR, "jpg").then((result => {
          if (result.result) {
            alert("Navigation bar billede er uploaded")
          } else {
            alert(result.message)
          }
        }))

      } else if (identifier === Identifier.FAVICON) {
        const fileExtension = file.name?.split('.').pop()?.toLowerCase();

        if (fileExtension == "svg") {
          AddMediaImage(file, Folders.MEDIA, Identifier.FAVICON, "svg").then((result => {
            if (result.result) {
              alert("FavIcon billede er uploaded")
            } else {
              alert(result.message)
            }
          }))
        } else {
          alert("Uploaded billede er ikke i .svg format")
        }
      } else if (identifier === Identifier.DELIVERY) {
        AddMediaImage(file, Folders.MEDIA, Identifier.DELIVERY, "jpg").then((result => {
          if (result.result) {
            alert("Delivery billede er uploaded")
          } else {
            alert(result.message)
          }
        }))
      }
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
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Editpromo;
