import React, { useState, useEffect } from "react";
import { Button, Table, Form, Pagination, Modal } from 'react-bootstrap';
import { DeleteOrder, FetchAllOrders, FetchOrdersByUserId } from "../../../FrontendRequests/Requests-Api/Order";
import type { Order } from "../../../FrontendRequests/Requests-Api/Order";
import { statusenum } from "../../../FrontendRequests/Enums/status";
import OrderSummaries from "./orderSummaries";
import { generateOrderStatementPDF } from "../FileGenerator/OrderStatement";
import type { CompanyOrderStatement } from "../FileGenerator/OrderStatement";

interface Props {
userid: string | null,
isadmin: boolean
}

const OrderTable = ({ userid, isadmin }: Props) => {
  const [filters, setFilters] = useState({
    status: '',
    date: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [showModalView, setShowModalView] = useState<boolean>(false);
  const [Orders, SetOrders] = useState<Order[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const GetOrders = async (userid: string) => {
    try {
      const result = await FetchOrdersByUserId(userid)
      if (result.result) {
        SetOrders(result.data)
      } else {
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

  const getallorders = async () => {
    try {
      const result = await FetchAllOrders()
      if (result.result) {
        SetOrders(result.data)
      } else {
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

  async function HandleDelete(order: Order) {
    const result = await DeleteOrder(order.orderid);

    if (result.result) {
      alert("Order deleted")

      if (userid !== null) {
        GetOrders(userid);
      } else {
        getallorders();
      }

    } else {
      alert(result.message)

      if (userid !== null) {
        GetOrders(userid);
      } else {
        getallorders();
      }
    }
  }


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
  const filteredorders = Orders?.filter((order) => {
    const fullName = `${order.firstname} ${order.lastname}`.toLowerCase();  // Combine firstname and lastname
    return (
      (filters.status === '' || order.statusname === filters.status) &&
      (order.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      fullName.includes(searchTerm.toLowerCase()) ||
      order.orderid.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const sortedOrders = filteredorders?.sort((a, b) => {
    if (filters.date === 'Oldest') {
      return new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
    } else if (filters.date === 'Newest') {
      return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedOrders?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = sortedOrders ? Math.ceil(sortedOrders.length / itemsPerPage) : 0;


  function handleview(order: Order) {
    setSelectedOrder(order)
    setShowModalView(true)
  }
  const handleCloseView = () => setShowModalView(false);

  useEffect(() => {
    if (userid !== null) {
      GetOrders(userid);
    } else {
      getallorders();
    }
  }, []);

  return (
    <div className="container mt-2 rounded shadow-lg bg-white">
      {/* SECTION: FILTER */}
      <div className="mb-4">
        <p className='mb-2 text-center' style={{fontSize: "1.1rem"}}>Filter</p>
        <div className="d-flex gap-2">
        <Form.Select name="status" onChange={handleFilterChange}>
          <option value="">Select Status</option>
          {Object.entries(statusenum).map(([key]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Form.Select>

        <Form.Select name="date" onChange={handleFilterChange}>
            <option value="">Sort by Date</option>
            <option value="Oldest">Oldest</option>
            <option value="Newest">Newest</option>
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

            // sort orders
            Orders?.sort((a, b) => {
              return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
            });

            const sampleStatement: CompanyOrderStatement = {
              companyName: 'Ordre-erklæring',
              date: (new Date).toLocaleDateString('en-GB'),
              Orders: Orders as Order[],
              totalorders: Orders?.length as number
            };

            const result = await generateOrderStatementPDF(sampleStatement);

              const blob = new Blob([result], { type: 'application/pdf' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'Ordre-erklæring.pdf';
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
            <th>Order</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts?.map((order) => (
            <tr key={order.orderid}>
                {/* TABLE: ORDER */}
              <td>
              <div style={{marginLeft: "18px"}}>
                <span className='text_style_purple'>#{order.orderid}</span>
              </div>
              </td>
              {/* TABLE: DATE */}
              <td>
                <div style={{marginLeft: "18px"}}>
                <span className="text_style">{new Date(order.order_date).toISOString().split('T')[0]}</span>
                </div>
              </td>
              {/* TABLE: CUSTOMERS */}
              <td>
              <div style={{ marginLeft: "18px" }}>
                <span className="text_style" style={{ display: "block" }}>{order.firstname} {order.lastname}</span>
                <span className="text_style" style={{ display: "block" }}>{order.email}</span>
              </div>
              </td>
                {/* TABLE: Payment */}
              <td>
              <div style={{ marginLeft: "20px", display: "flex", alignItems: "center" }}>
                <i
                  className="mdi mdi-circle"
                  style={{
                    fontSize: "10px", // Adjust the size of the dot
                    marginRight: "4px", // Space between the icon and the text
                    marginBottom: "2px",
                    color: order.statusname === 'Inactive' ? `${import.meta.env.LIGHT_RED}` :
                            order.statusname === 'Scheduled' ? `${import.meta.env.LIGHT_ORANGE}` :
                            order.statusname === 'Paid' ? `${import.meta.env.LIGHT_GREEN}` :
                          `${import.meta.env.LIGHT_GREY}` // Default for 'Cancelled' or any other status
                  }}
                ></i>
                <span className='text_style'
                  style={{
                    color: order.statusid === statusenum.Placed ? `${import.meta.env.LIGHT_ORANGE}` :
                          order.statusid === statusenum.Processed ? `${import.meta.env.LIGHT_ORANGE}` :
                          order.statusid === statusenum.Shipped ? `${import.meta.env.LIGHT_GREEN}` :
                          order.statusid === statusenum.Delivered ? `${import.meta.env.LIGHT_GREEN}` :
                          `${import.meta.env.LIGHT_GREY}` // Default for 'Cancelled' or others
                  }}
                >
                  {order.statusid === statusenum.Placed ? 'Placed' :
                  order.statusid === statusenum.Shipped ? 'Shipped' :
                  order.statusid === statusenum.Processed ? 'Processed' :
                  'Delivered'}
                </span>
              </div>
              </td>
              {/* TABLE: ACTIONS */}
              <td>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: "20px" }}>
              <Button
                  size="sm"
                  variant="Secondary"
                  style={{ padding: '4px 8px' }}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="View"
                  onClick={() => handleview(order)}
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
                  onClick={() => HandleDelete(order)}
                  disabled={!isadmin} // Disable the button if isAdmin is false
                >
                  <i
                    className="mdi mdi-delete-restore"
                    style={{ fontSize: '20px' }}
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
      <p className="text_style"> Displaying {indexOfFirstProduct + 1} to{" "} {sortedOrders ? Math.min(indexOfLastProduct, sortedOrders.length) : 0} of{" "}{sortedOrders ? sortedOrders.length : 0} entries</p>
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

          {/* Modal for OrderViewCard */}
          <Modal show={showModalView} onHide={handleCloseView} size="xl" fullscreen="true">
          <Modal.Header closeButton>
            <Modal.Title>View Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <OrderSummaries order={selectedOrder as Order} isadmin={isadmin} />
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
        `}
      </style>
</div>
  );
};

export default OrderTable;