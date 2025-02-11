import React, { useEffect, useState } from 'react';
import { GetAllProducts, type Product } from '../../../FrontendRequests/Requests-Api/Product';
import { FetchAllCateGories, type Category } from '../../../FrontendRequests/Requests-Api/Category';
import CardProduct from '../products/cardProduct';
import { Card, ListGroup, Row, Col } from "react-bootstrap";

function ProductDisplay() {
  const [GetProducts, SetProducts] = useState<Product[] | null>(null);
  const [GetCategories, SetCategories] = useState<Category[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<string>('Pris: Lav til Høj');

  function filterProductsWithQuantity(products: Product[]): Product[] {
    return products.filter(product => {
      const totalQuantity = product.productcolorsizes.reduce((sum, colorSize) => sum + colorSize.quantity, 0);
      return totalQuantity > 0;
    });
  }

  const SetupFilterByUrl = (GetCategories: Category[]) => {
    // Extract categoryid from URL if present
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.categoryid) {
      const categoryId = Number(params.categoryid);
      if (GetCategories) {
        const categoryExists = GetCategories.some(category => category.categoryid === categoryId);
        if (categoryExists) {
          setSelectedCategory(categoryId);

          const componentElement = document.getElementById("productsection");
          if (componentElement) {
            componentElement.scrollIntoView({
              behavior: "smooth", // Optional: Smooth scroll animation
              block: "center",
            });
          }
        }
      }
    }
  }

  const filteredProducts = GetProducts?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? product.categories.some((category) => category.categoryid === selectedCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected sorting option
  const sortedProducts = () => {
    if (selectedSort === 'Pris: Lav til Høj') {
      return filteredProducts?.sort((a, b) => a.salgpris_ex_moms - b.salgpris_ex_moms);
    } else if (selectedSort === 'Pris: Høj til Lav') {
      return filteredProducts?.sort((a, b) => b.salgpris_ex_moms - a.salgpris_ex_moms);
    } else if (selectedSort === 'Navn') {
      return filteredProducts?.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'Producent') {
      return filteredProducts?.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
    }
    return filteredProducts;
  };

  const GetProcuts = async () => {
    try {
      const result = await GetAllProducts();
      if (result.result) {
        const products = filterProductsWithQuantity(result.data as Product[]);
        SetProducts(products);
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

  // Fetch all categories from the API
  const GetCategory = async () => {
    try {
      const result = await FetchAllCateGories();
      if (result.result) {
        SetCategories(result.data);
        SetupFilterByUrl(result.data);
      }
    } catch (error) {
      console.error('Error Getting Category:', error);
    }
  };

  // UseEffect to load data on component mount
  useEffect(() => {
    GetProcuts();
    GetCategory();
  }, []);  // Re-run effect if location.search changes or categories change

  return (
    <div className="container py-4">
      <Row>
        {/* Sidebar */}
        <Col md={2}>
          <Card className="shadow-sm border-0 mt-6">
            <Card.Body>
              <h5 className="fw-bold mb-4">Kategorier</h5>
              <ListGroup variant="flush">
                {GetCategories?.map((category) => (
                  <ListGroup.Item
                    key={category.categoryid}
                    className={`d-flex justify-content-between align-items-center border-0 py-2 ${selectedCategory === category.categoryid ? 'bg-success text-white' : 'hoverable-category'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedCategory(category.categoryid === selectedCategory ? null : category.categoryid)}
                  >
                    {category.categoryname} <i className="mdi mdi-star ms-2"></i>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col md={10}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="text-muted">Viser {sortedProducts()?.length} Produkter</span>
            <div className="d-flex align-items-center">
              {/* Sorting Dropdown */}
              <li className="nav-item dropdown pe-2 d-flex align-items-center">
                <a
                  href="#"
                  className="p-0 nav-link"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i
                    className="mdi mdi-sort-variant"
                    style={{
                      fontSize: '24px',
                      color: 'currentColor',
                      marginBottom: '4px',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                  ></i>
                </a>
                  <ul
                    className="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li className="mb-2">
                      <a
                        className="dropdown-item border-radius-md"
                        onClick={() => setSelectedSort('Navn')}
                      >
                        <div className="py-1 d-flex">
                          <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                          <div className="d-flex flex-column justify-content-center">
                            <span className="font-weight-bold ps-2 fg-dark"
                              onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                              >Navn</span>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        className="dropdown-item border-radius-md"
                        onClick={() => setSelectedSort('Producent')}
                      >
                        <div className="py-1 d-flex">
                          <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          <div className="d-flex flex-column justify-content-center">
                            <span className="font-weight-bold ps-2 fg-dark"
                              onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                              >Producent</span>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        className="dropdown-item border-radius-md"
                        onClick={() => setSelectedSort('Pris: Lav til Høj')}
                      >
                        <div className="py-1 d-flex">
                          <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                          <div className="d-flex flex-column justify-content-center">
                            <span className="font-weight-bold ps-2 fg-dark"
                              onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                              >Pris: Lav til Høj</span>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="mb-2">
                      <a
                        className="dropdown-item border-radius-md"
                        onClick={() => setSelectedSort('Pris: Høj til Lav')}
                      >
                        <div className="py-1 d-flex">
                          <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                          <div className="d-flex flex-column justify-content-center">
                            <span className="font-weight-bold ps-2 fg-dark"
                              onMouseEnter={(e) => e.currentTarget.style.color = 'green'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'currentColor'}
                              >Pris: Høj til Lav</span>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
              </li>
              {/* Search Bar */}
              <input
                type="text"
                className="form-control ms-2"
                placeholder="Søg produkter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Sorting Dropdown end */}
          </div>

          {/* Placeholder for product grid */}
          <div className="border border-dashed p-4 text-center text-muted">
            <div className="row">
              {sortedProducts()?.map((product) => (
                <div className="col-md-6 col-lg-3" key={product.productid}>
                  <CardProduct Product={product} />
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ProductDisplay;
