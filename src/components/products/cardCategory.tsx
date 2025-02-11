import React, { useEffect, useState } from 'react';
import { FetchAllCateGories } from '../../../FrontendRequests/Requests-Api/Category';
import type { Category } from '../../../FrontendRequests/Requests-Api/Category';
import { Card, Row, Col, Container } from 'react-bootstrap';

export default function CardCategory({ maxItems = 4 }) {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const uniqueClass = `category-card-${Math.random().toString(36).substring(2, 9)}`; // Unique class name

  const fetchCategories = async () => {
    try {
      const result = await FetchAllCateGories();
      if (result.result) {
        const shuffledCategories: Category[] = result.data.sort(() => Math.random() - 0.5);
        setCategories(shuffledCategories.slice(0, maxItems));
      }
    } catch (error) {
      console.error('Error Fetching Categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [maxItems]);

  return (
    <Container>
      {/* Scoped Styles */}
      <style>
        {`
          .${uniqueClass} {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            height: 180px;
          }

          .${uniqueClass} .category-image {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            transition: transform 0.3s ease-in-out;
          }

          .${uniqueClass}:hover .category-image {
            transform: scale(1.1);
          }

          .${uniqueClass} .card-body {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.6);
            padding: 8px;
          }
        `}
      </style>
      <Row className="justify-content-center mb-4 mt-4">
        {categories?.map((category, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-4">
            <a href={`/?categoryid=${category.categoryid}`} className="text-decoration-none">
              <Card className={`${uniqueClass} border-0`}>
                <div
                  className="category-image"
                  style={{
                    backgroundImage: `url(${category.categoryimage})`,
                  }}
                ></div>
                <Card.Body className="text-center p-2">
                  <Card.Title as="p" className="text-white fw-bold mb-1 small">
                    {category.categoryname}
                  </Card.Title>
                  <a href={`/?categoryid=${category.categoryid}`} className="text-white text-sm fw-semibold">
                    Flere produkter &#62;
                  </a>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
