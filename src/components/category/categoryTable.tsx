import React, {useEffect, useState } from 'react';
import { Button, Dropdown, Table, Form, Pagination, Modal } from 'react-bootstrap';
import EditCategory from '../category/editCategory';
import ViewCategory from '../category/viewcategory';
import { FetchAllCateGories, DeleteCategoryById } from "../../../FrontendRequests/Requests-Api/Category";
import type {Category} from "../../../FrontendRequests/Requests-Api/Category";
import { GetProductCategoriesByCategoryId } from '../../../FrontendRequests/Requests-Api/ProductCategory';
import { DeleteCategoryImage, isValidLink } from '../../../FrontendRequests/Requests-Api/Images';
import {generateCategoryStatementPDF } from '../FileGenerator/CategoryStatement';
import type { CompanyCategoryStatement } from '../FileGenerator/CategoryStatement';
import { Folders } from '../../../FrontendRequests/Enums/Images';

const CategoryTable = () => {
  const [categories, Setcategories] = useState<Category[]>();
  const [showModalView, setShowModalView] = useState<boolean>(false);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [showDeleteCategoryModal, setDeleteCategoryModal] = useState<boolean>(false);
  const [showWarningCategoryModal, setWarnigCategoryModal] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    category: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

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

  async function HandleDeleteCategory() {
    if (selectedCategory) {
      const result = await DeleteCategoryById(selectedCategory.categoryid);

      if (result.result) {
        if (isValidLink(selectedCategory.categoryimage)) {
          const imageresult = await DeleteCategoryImage(selectedCategory.categoryname, Folders.CATEGORY);
  
          if (imageresult.result) {
  
            alert("Kategori slettet")
            await GetCategories();
          } else {
            alert(imageresult.message)
            await GetCategories();
          } 
        } else {
          alert("Kategori slettet")
          await GetCategories();
        }
      } else {
        alert(result.message)
        await GetCategories();
      }

        setDeleteCategoryModal(false);
    } else {
      console.log("Cannot delete category. Not found")
      setDeleteCategoryModal(false);
    }
  }

  function handleedit(category: Category) {
    setSelectedCategory(category);
    setShowModalEdit(true);
  }
  
  function handleview(category: Category) {
    setSelectedCategory(category);
    setShowModalView(true);
  }

  async function HandleDelete(category: Category) {
    GetProductCategoriesByCategoryId(category.categoryid).then((result) => {
      if (result.data && result.data.length > 0) {
        setSelectedCategory(category)
        setWarnigCategoryModal(true);
      } else {
        setSelectedCategory(category)
        setDeleteCategoryModal(true);
      }
    })
  }

  const handleCloseView = () => setShowModalView(false);
  const handleCloseEdit = () => setShowModalEdit(false);

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filtering logic
  const filteredProducts = categories?.filter((category) => {
    return (
      (filters.category === '' || category.categoryname === filters.category) &&
      (category.categoryname.toLowerCase().includes(searchTerm.toLowerCase()) || category.categoryid.toString().includes(searchTerm))
    );
  }) || [];

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

      useEffect(() => {
        GetCategories();
      }, []);
    

  return (
    <div id='container'>

            <div className="mb-4 p-4 bg-white rounded shadow-lg">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3>Tilykke 🎉</h3>
                  <p>Du har {categories?.length} Kategorier tilsammen</p>
                </div>
                <div>
                  {/* Placeholder for profile image */}
                  <img src='images/avatar.jpg' style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', borderRadius: '50%' }}></img>
                </div>
              </div>
            </div>

        <div className="container mt-2 rounded shadow-lg bg-white mt-7">
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

            const sampleStatement: CompanyCategoryStatement = {
              companyName: 'Kategori-erklæring',
              date: (new Date).toLocaleDateString('en-GB'),
              Categories: categories as Category[],
              totalCategories: categories?.length as number
            };

            const result = await generateCategoryStatementPDF(sampleStatement);

              const blob = new Blob([result], { type: 'application/pdf' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'Kategori-erklæring.pdf';
              link.click();

              console.log('Rapport hentet!');
            }}
          >
            Download PDF
          </Button>
          </div>
        </div>

        {/* SECTION: TABLE */}
        <Table hover>
          <thead>
            <tr>
              <th>Category</th>
              <th>Category Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts?.map((category) => (
              <tr key={category.categoryid}>
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
                  {category.categoryname}
                  </p>
                </td>
                  {/* TABLE: Total Products */}
                <td>
                  <p className='text_style' style={{marginLeft: "50px"}}>
                    {category.categoryid}
                  </p>
                </td>
                  <td>
                    {/* TABLE: STATUS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: "20px" }}>
                      <Button
                        size="sm"
                        variant="Secondary"
                        style={{ padding: '4px 8px' }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Edit"
                        onClick={() => handleedit(category)}
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
                        onClick={() => handleview(category)}
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
                        onClick={() => HandleDelete(category)}
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

            {/* Modal for EditCategory */}
            <Modal show={showModalEdit} onHide={handleCloseEdit} size="lg">
              <Modal.Header closeButton>
                  <Modal.Title>Ændre Profil</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <EditCategory category={selectedCategory as Category} />
              </Modal.Body>
              </Modal>

              {/* Modal for ViewCategory */}
            <Modal show={showModalView} onHide={handleCloseView} size="lg">
              <Modal.Header closeButton>
                  <Modal.Title>Se Profil</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <ViewCategory category={selectedCategory as Category} />
              </Modal.Body>
              </Modal>

            {/* Modal for DeleteCategory Warning */}
            <Modal show={showWarningCategoryModal} onHide={() => setWarnigCategoryModal(false)} size="lg" centered>
              <Modal.Header closeButton className="text-white" style={{ backgroundColor: "red" }}>
                  <Modal.Title className="d-flex flex-column">
                      <div className="d-flex align-items-center">
                          <i className="mdi mdi-delete-empty-outline me-2" style={{ fontSize: "1.5rem" }}></i>
                         {selectedCategory?.categoryname} : Er knyttet til produkter
                      </div>
                      <div className="mt-2 fw-bold" style={{ fontSize: "0.9rem" }}>
                        Slet venligst alle produkter, før du forsøger at slette kategorien.
                      </div>
                  </Modal.Title>
              </Modal.Header>

              <Modal.Footer className="d-flex justify-content-center">
                  <button className="btn btn-secondary me-2" onClick={() => setWarnigCategoryModal(false)}>OK</button>
              </Modal.Footer>
            </Modal>

            {/* Modal for DeleteCategory */}
            <Modal show={showDeleteCategoryModal} onHide={() => setDeleteCategoryModal(false)} size="lg" centered>
              <Modal.Header closeButton className="text-white" style={{ backgroundColor: "red" }}>
                  <Modal.Title className="d-flex flex-column">
                      <div className="d-flex align-items-center">
                          <i className="mdi mdi-delete-empty-outline me-2" style={{ fontSize: "1.5rem" }}></i>
                          {selectedCategory?.categoryname} : Er ved at blive slettet
                      </div>
                      <div className="mt-2 fw-bold" style={{ fontSize: "0.9rem" }}>
                        Er du sikker på, at du vil slette kategorien?
                      </div>
                  </Modal.Title>
              </Modal.Header>

              <Modal.Footer className="d-flex justify-content-center">
                  <button className="btn btn-secondary me-2" onClick={() => setDeleteCategoryModal(false)}>No</button>
                  <button className="btn btn-danger" onClick={HandleDeleteCategory}>Yes</button>
              </Modal.Footer>
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
          `}
        </style>
      </div>

    </div>
  );
};

export default CategoryTable;