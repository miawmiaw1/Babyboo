import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, Modal } from "react-bootstrap";
import OverviewUser from './overviewUser';
import SecurityUser from './securityUser';
import AddressBilling from "./addressBilling";
import UserEditCard from "./popup/editProfile";
import {type User, deleteUser} from "../../../FrontendRequests/Requests-Api/User"
import { FetchOrdersByUserId, type Order } from "../../../FrontendRequests/Requests-Api/Order";

interface Props {
    Userprofile: User,
    isadmin: boolean
}

const UserEdit = ({ Userprofile, isadmin }: Props) => {
    const [activeSection, setActiveSection] = useState<string>("Overview");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showDeleteAccount, setDeleteAccount] = useState<boolean>(false);
    const [Orders, SetOrders] = useState<Order[] | null>(null);
    const [TotalPrice, SetTotalPrice] = useState<number>(0);

    const GetOrdersAndPrices = async (userid: string) => {
        try {
          const result = await FetchOrdersByUserId(userid)
          if (result.result) {
            SetOrders(result.data)
            SetTotalPrice(

                result.data?.reduce((acc: number, order: { totalprice: { toString: () => string; }; }) => 
                    acc + parseFloat(order.totalprice.toString()), 
                    0
                  ) || 0,
            );
          } else {
          }
        } catch (error) {
          console.error('Error Getting products:', error);
        }
      };

      const DeleteAccount = () => {
        deleteUser(Userprofile.userid).then((result) => {
            if (result.result) {
                window.location.href = '/Logud';
            } else {
                alert("Cannot delete account");
                setDeleteAccount(false);
            }
        })
      };


    const renderActiveSection = () => {
        switch (activeSection) {
            case "Overview":
                return <OverviewUser Userprofile={Userprofile} TotalPrice={TotalPrice} />;
            case "SecurityUser":
                return <SecurityUser Userprofile={Userprofile} isadmin={isadmin} />;
            case "AddressBilling":
                return <AddressBilling Userprofile={Userprofile} />;
            default:
                return <OverviewUser Userprofile={Userprofile} TotalPrice={TotalPrice} />;
        }
    };

    const handleSectionClick = (section: string) => {
        setActiveSection(section);
    };

    const handledelete = () => {
        setDeleteAccount(true);
    };

    const handlePopup = () => {
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    useEffect(() => {
        GetOrdersAndPrices(Userprofile.userid.toString());
      }, []);



    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end">
                <Button 
                    variant={"outline-primary"} 
                    onClick={() => handledelete()}
                    className="me-2"
                    style={{
                        backgroundColor:import.meta.env.LIGHT_RED,
                        border: "none",
                        color: "#fff",
                    }}
                >
                    Slet bruger
                </Button>
            </div>
            <Row>
                {/* Customer Info */}
                <Col md={4}>
                    <Card className="p-3" style={{ borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                        {/* Placeholder for image */}
                        <div className="text-center">
                            <img src="images/avatar.jpg" alt="Profile" className="rounded-circle me-2" style={{ width: '80px', height: '80px' }} />
                        </div>
                        <h5 className="mt-3 text-center">{Userprofile.username}</h5>
                        <p className="text-center text-muted">@{Userprofile.member_type}</p>
                        
                        <Row className="text-center mt-4">
                            <Col>
                            <p>
                                <i className="mdi mdi-cart-outline" style={{ fontSize: "30px", color: "#c7b9ff" }}></i>
                            </p>
                            <p>{Orders?.length} Ordrer</p>
                            </Col>
                            <Col>
                            <p>
                                <i className="mdi mdi-cash" style={{ fontSize: "30px", color: "#c7b9ff" }}></i>
                            </p>
                            <p>{TotalPrice} Kr. Brugt</p>
                            </Col>
                        </Row>
                        
                        <div className="mt-4">
                            <h6>Details</h6>
                            <p><strong>Brugernavn:</strong> {Userprofile.firstname} {Userprofile.lastname}</p>
                            <p><strong>Email:</strong> {Userprofile.email}</p>
                            <p><strong>Telefon:</strong> {Userprofile.phonenumber}</p>
                            <p><strong>Land:</strong> {Userprofile.country_name}</p>
                        </div>

                        <Button
                            variant="primary"
                            style={{
                            backgroundColor: import.meta.env.LIGHT_PURPLE || "#7352ff",
                            border: "none",
                            width: "100%",
                            borderRadius: "8px",
                            }}
                            onClick={handlePopup}
                            className="mt-3"
                        >
                            
                        Rediger oplysninger
                        </Button>
                    </Card>
                </Col>

                {/* Customer Account and Information */}
                <Col md={8}>
                    <div className="mb-2 ms-1">
                        {/* Navigation Buttons on top */}
                        <Button 
                            variant={activeSection === "Overview" ? "primary" : "outline-primary"} 
                            onClick={() => handleSectionClick("Overview")}
                            className="me-2"
                            style={{
                                backgroundColor: activeSection === "Overview" ? "#7352ff" : "transparent",
                                border: activeSection === "Overview" ? "none" : "1px solid #7352ff",
                                color: activeSection === "Overview" ? "#fff" : "#7352ff",
                            }}
                        >
                            <i className="mdi mdi-view-dashboard-outline me-2"></i>
                            Oversigt
                        </Button>

                        <Button 
                            variant={activeSection === "SecurityUser" ? "primary" : "outline-primary"} 
                            onClick={() => handleSectionClick("SecurityUser")}
                            className="me-2"
                            style={{
                                backgroundColor: activeSection === "SecurityUser" ? "#7352ff" : "transparent",
                                border: activeSection === "SecurityUser" ? "none" : "1px solid #7352ff",
                                color: activeSection === "SecurityUser" ? "#fff" : "#7352ff",
                            }}
                        >
                            <i className="mdi mdi-shield-lock-outline me-2"></i>
                            Sikkerhed
                        </Button>

                        <Button 
                            variant={activeSection === "AddressBilling" ? "primary" : "outline-primary"} 
                            onClick={() => handleSectionClick("AddressBilling")}
                            className="me-2"
                            style={{
                                backgroundColor: activeSection === "AddressBilling" ? "#7352ff" : "transparent",
                                border: activeSection === "AddressBilling" ? "none" : "1px solid #7352ff",
                                color: activeSection === "AddressBilling" ? "#fff" : "#7352ff",
                            }}
                        >
                            <i className="mdi mdi-map-marker me-2"></i>
                            Address & Billing
                        </Button>
                    </div>
                    <div className="usercontainer">
                        {renderActiveSection()}
                    </div>
                </Col>
            </Row>

            {/* Modal for UserEditCard */}
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Ændre profil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UserEditCard userprofile={Userprofile} />
                </Modal.Body>
            </Modal>
            
            {/* Modal for DeleteAccount */}
            <Modal show={showDeleteAccount} onHide={() => setDeleteAccount(false)} size="lg" centered>
                <Modal.Header closeButton className="text-white" style={{ backgroundColor: "orange" }}>
                    <Modal.Title className="d-flex align-items-center">
                    <i className="mdi mdi-delete-empty-outline me-2" style={{ fontSize: "1.5rem" }}></i>
                    Er du sikker på, at du vil slette kontoen?: {Userprofile.email}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Footer className="d-flex justify-content-center">
                    <button className="btn btn-secondary me-2" onClick={() => setDeleteAccount(false)}>No</button>
                    <button className="btn btn-danger" onClick={DeleteAccount}>Yes</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserEdit;