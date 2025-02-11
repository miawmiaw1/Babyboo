import React, {useEffect, useState } from 'react';
import { Button, Table, Form, Pagination, Modal} from 'react-bootstrap';
import { type User, fetchUsers, deleteUser } from '../../../FrontendRequests/Requests-Api/User';
import { UserRoles } from '../../../FrontendRequests/Enums/Usertypes';
import UserEdit from './profile';
import { type CompanyUserStatement, generateUserStatementPDF } from '../FileGenerator/UserStatement';

interface Props {
  Userprofile: User;
}

const UserTable = ({ Userprofile }: Props) => {
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [Users, setUsers] = useState<User[] | null>(null);
  const [showDeleteAccount, setDeleteAccount] = useState<boolean>(false);

        const DeleteAccount = () => {
          if (Userprofile.userid === selectedUser?.userid) {
            alert("Du kan ikke slette din egen profil her")
          } else {
            deleteUser(selectedUser?.userid as number).then((result) => {
              if (result.result) {
                  GetUsers().then((result) => {
                    setDeleteAccount(false);
                  })
              } else {
                  alert("Cannot delete account");
                  setDeleteAccount(false);
              }
          })
          }
        };

    const GetUsers = async () => {
      try {
        const result = await fetchUsers();
        if (result.result) {
          setUsers(result.data)
        }
      } catch (error) {
        console.error('Error Getting products:', error);
      }
    };

  const [filters, setFilters] = useState({
    username: '',
    email: '',
    member_type: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

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
  const filteredusers = Users?.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();  // Combine firstname and lastname
    return (
      (filters.member_type === '' || user.member_type === filters.member_type) &&
      (fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.member_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phonenumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentUsers = filteredusers?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil((filteredusers?.length || 0) / itemsPerPage);

    //modal functions
    function handleedit(user: User) {
      setSelectedUser(user);
      setShowModalEdit(true);
    }

    const handleCloseEdit = () => setShowModalEdit(false);
  
    async function HandleDelete(user: User) {
      setSelectedUser(user)
      setDeleteAccount(true);
    }

    useEffect(() => {
      GetUsers();
    }, []);

  return (
    <div className="container mt-2 rounded shadow-lg bg-white mt-8">
      {/* SECTION: FILTER */}
      <div className="mb-4">
        <p className='mb-2 text-center' style={{fontSize: "1.1rem"}}>Filter</p>
        <div className="d-flex gap-2">
          <Form.Select name="status" onChange={handleFilterChange}>
            <option value="">Role</option>
              {/* Iterate through UserRoles to create options */}
              {Object.entries(UserRoles).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()} {/* Format role names to capitalize first letter */}
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

            const sampleStatement: CompanyUserStatement = {
              companyName: 'Bruger-erklæring',
              date: (new Date).toLocaleDateString('en-GB'),
              Users: Users as User[],
              totalusers: Users?.length as number
            };

            const result = await generateUserStatementPDF(sampleStatement);

              const blob = new Blob([result], { type: 'application/pdf' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'Bruger-erklæring.pdf';
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
            <th>User</th>
            <th>Email</th>
            <th>PhoneNumber</th>
            <th>Role</th>
            <th>UserId</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers?.map((user) => (
            <tr key={user.userid}>
                {/* TABLE: User */}
              <td>
              <div style={{ marginLeft: "18px" }}>
                <span className="text_style" style={{ display: "block", fontWeight: "bolder" }}>{user.firstname} {user.lastname}</span>
              </div>
              </td>
              {/* TABLE: Email */}
              <td>
                <div style={{marginLeft: "20px"}}>
                <span className="text_style" style={{ display: "block" }}>{user.email}</span>
                </div>
              </td>
              {/* TABLE: PhoneNumber */}
              <td>
                <div style={{marginLeft: "35px"}}>
                  <span className='text_style'>{user.phonenumber}</span>
                </div>
              </td>
              {/* TABLE: Role */}
              <td>
              <div style={{ marginLeft: "18px" }}>
                <span className="text_style">{user.member_type}</span>
              </div>
              </td>
              <td>
                {/* TABLE: UserId */}
                <div style={{marginLeft: "18px"}}>
                <span className='text_style_purple'>{user.userid}</span>
              </div>
              </td>
                {/* TABLE: Country */}
              <td>
              <div style={{ marginLeft: "18px" }}>
                <span className="text_style">{user.country_name}</span>
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
                        onClick={() => handleedit(user)}
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
                        title="Delete"
                        onClick={() => HandleDelete(user)}
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
        <p className='text_style'>Displaying {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredusers?.length || 0)} of {filteredusers?.length || 0} entries</p>
        <Pagination className="custom-pagination ">
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

        {/* Modal for ViewUser */}
        <Modal show={showModalEdit} onHide={handleCloseEdit} className="custom-modal" size="xl" fullscreen="true">
          <Modal.Header closeButton>
              <Modal.Title>View User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UserEdit Userprofile={selectedUser as User} isadmin={Userprofile.membertypeid === UserRoles.ADMIN} />
          </Modal.Body>
        </Modal>

        {/* Modal for DeleteAccount */}
        <Modal show={showDeleteAccount} onHide={() => setDeleteAccount(false)} size="lg" centered>
            <Modal.Header closeButton className="text-white" style={{ backgroundColor: "orange" }}>
                <Modal.Title className="d-flex align-items-center">
                <i className="mdi mdi-delete-empty-outline me-2" style={{ fontSize: "1.5rem" }}></i>
                Are you sure you want to delete account: {selectedUser?.email}
                </Modal.Title>
            </Modal.Header>

            <Modal.Footer className="d-flex justify-content-center">
                <button className="btn btn-secondary me-2" onClick={() => setDeleteAccount(false)}>No</button>
                <button className="btn btn-danger" onClick={DeleteAccount}>Yes</button>
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
  );
};

export default UserTable;