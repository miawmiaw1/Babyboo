import React, {useEffect, useState } from 'react';
import { Button, Table, Form, Pagination, Modal } from 'react-bootstrap';
import { FetchAllCateGories, type Category } from "../../../FrontendRequests/Requests-Api/Category";
import { GetAllProducts, type Product, DeleteProduct, DeleteProducts } from '../../../FrontendRequests/Requests-Api/Product';
import EditProduct from '../products/editProduct';
import ViewProduct from './viewproduct';
import { type CompanyProductStatement, generateProductStatementPDF } from '../FileGenerator/ProductStatement';
import { DeleteAllImages, isValidLink } from '../../../FrontendRequests/Requests-Api/Images';
const ProductTable = () => {

  interface ProductsTable extends Product {
    stock?: boolean;
    totalquantity?: number;
  }

  const [selectedProduct, setSelectedProduct] = useState<ProductsTable>();
  const [showModalView, setShowModalView] = useState<boolean>(false);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [GetProducts, SetProducts] = useState<ProductsTable[] | null>(null);
  const [categories, Setcategories] = useState<Category[]>();
  const [Selectedcategoryid, Setselectedcategoryid] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    stock: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

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
        const products = MakeProductStocks(result.data)
        SetProducts(products)
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));

    if (name == "category") {
      Setselectedcategoryid(categories?.find(c => c.categoryname === value)?.categoryid as number || null)
    }
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  function MakeProductStocks(products: ProductsTable[]): ProductsTable[] {


    return products.map(product => {
        // Calculate total quantity of all color-size combinations
        const totalQuantity = product.productcolorsizes.reduce((sum, colorSize) => sum + colorSize.quantity, 0);
        
        // Set stock based on total quantity
        return {
            ...product,
            stock: totalQuantity > 0, // Set stock to true if total quantity is greater than 0, else false
            totalquantity: totalQuantity
        };
    });
  }

  // Filtering logic
  const filteredProducts = GetProducts?.filter((product) => {
    return (
      (filters.category === '' || product.categories[0].categoryname === filters.category) &&
      (filters.stock === '' || product.stock === (filters.stock === 'In Stock')) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.productid.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.salgpris_ex_moms.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }) || [];

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);


  //modal functions
  function handleedit(product: ProductsTable) {
    setSelectedProduct(product);
    setShowModalEdit(true);
  }
  
  function handleview(product: ProductsTable) {
    setSelectedProduct(product);
    setShowModalView(true);
  }

  const handleCloseView = () => setShowModalView(false);
  const handleCloseEdit = () => setShowModalEdit(false);

  async function HandleDeleteProduct(product: ProductsTable) {
    const result = await DeleteProduct(product.productid);

    if (result.result) {
      if (isValidLink(product.images[0].image_url)) {

        const allImagesDeleted = await DeleteAllImages(`${product.categories[0].categoryname}/${product.productid}`);
        if (allImagesDeleted.result) {
          console.log("All images were successfully deleted.");
          alert("Produkt slettet")
          await GetProcuts();
        } else {
          console.log("Some images failed to delete or an error occurred.");
          alert(allImagesDeleted.data)
          await GetProcuts();
        }
      } else {
        alert("Produkt slettet")
        await GetProcuts();
      }

    } else {
      alert(result.message)
      await GetProcuts();
    }
  }

  useEffect(() => {
    GetCategories();
    GetProcuts();
  }, []);

  return (
    <div className="container mt-2 rounded shadow-lg">
      {/* SECTION: FILTER */}
      <div className="mb-4">
        <p className='mb-2 text-center' style={{fontSize: "1.1rem"}}>Filter</p>
        <div className="d-flex gap-2">
          <Form.Select name="category" onChange={handleFilterChange}>
            <option value="">Category</option>
            {categories?.map((category) => (
                  <option key={category.categoryid} value={category.categoryname}>
                      {category.categoryname}
                  </option>
              ))}
          </Form.Select>
          <Form.Select name="stock" onChange={handleFilterChange}>
            <option value="">Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </Form.Select>
        </div>
      </div>

      {/* SECTION: INSTRUMENT BOARD */}
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="w-25 h-25"
        />
        <div className="d-flex gap-2">
          <Form.Select
            style={{width: "100px"}}
            className="mb-3"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={2}>7</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Form.Select>
      <Button 
        className="custom-dropdown-toggle text_style" 
        variant="warning" 
        onClick={async () => {

        const sampleStatement: CompanyProductStatement = {
          companyName: 'Produkt-erklæring',
          date: (new Date).toLocaleDateString('en-GB'),
          products: GetProducts as Product[],
          totalproducts: GetProducts?.length as number
        };

         const result = await generateProductStatementPDF(sampleStatement);

          const blob = new Blob([result], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'Produkt-erklæring.pdf';
          link.click();

          console.log('Rapport hentet!');
        }}
      >
        Download PDF
      </Button>
      <Button 
        className="custom-dropdown-toggle text_style" 
        variant="danger" 
        onClick={async () => {
          if (Selectedcategoryid != null) {

            const filteredProducts = GetProducts?.filter((product) => {
              return (
                (product.categories[0].categoryid === Selectedcategoryid));
            }) || [];

            if (filteredProducts && filteredProducts.length > 0) {
              const deleteresult =  await DeleteProducts(filteredProducts[0].productid as number, filteredProducts[filteredProducts.length - 1].productid)

              if (deleteresult.result) {
                alert(`Alle produkter er slettet: ${deleteresult.data}`)
              }
            }
          } else {
            alert("Vælg kategori først")
          }
        }}
      >
        Slet alle produkter
      </Button>
        </div>
      </div>

      {/* SECTION: TABLE */}
      <Table hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>ID</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.productid}>
                {/* TABLE: PRODUCT */}
              <td>
                <div className="d-flex align-items-center">
                  <img src={product.images[0].image_url} alt={product.name} width="50" height="50" className="me-2" />
                  <div>
                    <strong className='text_style_purple'>{product.name}</strong>
                    <p className='text_style' style={{ marginBottom: 0 }}>
                      {product.description.length > 20 ? `${product.description.slice(0, 20)}...` : product.description}
                    </p>
                  </div>
                </div>
              </td>
              {/* TABLE: CATEGORY */}
              <td>
              <p className='d-flex align-items-center mb-0 text_style'>
                    <span
                      className='badge rounded-circle d-flex justify-content-center align-items-center bg-label-info me-2'
                      style={{
                        color: `${import.meta.env.LIGHT_PURPLE}`
                      }}
                    >
                      <i className="mdi mdi-monitor-dashboard" style={{ fontSize: '1.2rem' }}></i>
                    </span>
                  {product.categories[0].categoryname}
                  </p>
              </td>
              {/* TABLE: STOCK */}
              <td>
              <>
                <style>
                    {`
                    .custom-switch .form-check-input:checked {
                        background-color: ${import.meta.env.LIGHT_PURPLE};
                        border-color: ${import.meta.env.LIGHT_PURPLE};
                    }

                    .custom-switch .form-check-input:focus {
                        box-shadow: 0 0 0 0.2rem rgba(128, 0, 128, 0.25);
                    }
                    `}
                </style>
                <div style={{marginLeft: "20px"}}>
                  <Form.Check 
                      type="switch"
                      checked={product.stock} 
                      readOnly 
                      className="custom-switch"
                  />
                </div>
                </>
              </td>
                {/* TABLE: ID */}
              <td>
                <div className='text_style' style={{marginLeft: "20px"}}>
                  {product.productid}
                </div>
              </td>
                {/* TABLE: PRICE */}
              <td>
                <div className='text_style' style={{marginLeft: "20px"}}>
                  <p style={{}}>{(Number(product.salgpris_ex_moms) + Number(product.udgående_moms))} DKK</p>
                </div>
              </td>
                {/* TABLE: QUANTITY */}
              <td>
                <div className='text_style' style={{marginLeft: "20px"}}>
                  {product.totalquantity}
                </div>
              </td>
              {/* TABLE: ACTIONS */}
              <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: "20px" }}>
                      <Button
                        size="sm"
                        variant="Secondary"
                        style={{ padding: '4px 8px' }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Edit"
                        onClick={() => handleedit(product)}
                      >
                        <i
                          className="mdi mdi-pencil-box-outline"
                          style={{ fontSize: '20px', color: `${import.meta.env.LIGHT_PURPLE}` }}
                        ></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="Secondary"
                        style={{ padding: '4px 8px' }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="View"
                        onClick={() => handleview(product)}
                      >
                        <i
                          className="mdi mdi-eye"
                          style={{ fontSize: '20px', color: `${import.meta.env.LIGHT_PURPLE}` }}
                        ></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="Secondary"
                        style={{ padding: '4px 8px' }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Delete"
                        onClick={() => HandleDeleteProduct(product)}
                      >
                        <i
                          className="mdi mdi-close-thick"
                          style={{ fontSize: '20px', color: `${import.meta.env.LIGHT_RED}` }}
                        ></i>
                      </Button>
                    </div>
                </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* SECTION: PAGING */}
      <div className="d-flex justify-content-between">
        <p className='text_style'>Displaying {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} entries</p>
        <Pagination className="custom-pagination">
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Pagination.Prev>
          
          {currentPage > 1 && (
            <>
              <Pagination.Item onClick={() => setCurrentPage(1)}>1</Pagination.Item>
              {currentPage > 2 && <Pagination.Ellipsis />}
            </>
          )}
          {Array.from({ length: totalPages }, (_, index) => {
            if (
              index + 1 === currentPage || // Active page
              index + 1 === currentPage - 1 || // Previous page
              index + 1 === currentPage + 1 // Next page
            ) {
              return (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              );
            }
            return null;
          })}

          {currentPage < totalPages && (
            <>
              {currentPage < totalPages - 1 && <Pagination.Ellipsis />}
              <Pagination.Item onClick={() => setCurrentPage(totalPages)}>{totalPages}</Pagination.Item>
            </>
          )}
          <Pagination.Next
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Pagination.Next>
        </Pagination>

              {/* Modal for Editproduct */}
            <Modal show={showModalEdit} onHide={handleCloseEdit} className="custom-modal">
              <Modal.Header closeButton>
                  <Modal.Title>Edit Product</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <EditProduct product={selectedProduct as Product} />
              </Modal.Body>
              </Modal>

              {/* Modal for Viewproduct */}
            <Modal show={showModalView} onHide={handleCloseView} className="custom-modal">
              <Modal.Header closeButton>
                  <Modal.Title>View Product</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <ViewProduct product={selectedProduct as ProductsTable} />
              </Modal.Body>
              </Modal>
      </div>

      <style>
        {`
          .custom-pagination .page-item {
            border-radius: 50%; /* Make the pagination buttons circular */
            margin: 0 5px;
          }
          .custom-pagination .page-item.active .page-link {
            background-color: #7e57c2; /* Purple background for active page */
            color: white;
            border-radius: 50%;
          }
          .custom-pagination .page-link {
            border: none;
            color: #6c757d; /* Default button color */
          }
          .custom-pagination .page-link:hover {
            background-color: #e9ecef; /* Hover state */
          }
          .custom-modal .modal-dialog {
              max-width: 90%; /* Adjust the width as needed */
          }
        `}
      </style>
</div>
  );
};

export default ProductTable;