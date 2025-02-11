import { Form, Col, Row } from "react-bootstrap";
import React from 'react';
import type { Category } from "../../../FrontendRequests/Requests-Api/Category";

interface Props {
  category: Category;
}

const ViewCategory = ({category}: Props) => {
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
              <h1 className="form-title">Ændre Kategori</h1>
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
                          value={category.categoryname}
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
                      value={category.categorydescription}
                    />
                  </Form.Group>
              </div>
            </div>

            {/* Image upload */}
            <div className="card text-center shadow-sm">
              <div className="card-header bg-light">
                  <h5 className="card-title mb-2">Kategori: {category.categoryname}</h5>
              </div>
              <div className="card-body">
                <img
                  src={category.categoryimage}
                  alt="Category"
                  className="img-fluid rounded-circle mb-3"
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ViewCategory;
