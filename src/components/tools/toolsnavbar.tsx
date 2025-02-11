import React, { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import Calculator from "./calculator";
import BulkAddProducts from "./BulkAddProducts";

const Toolnavbar = () => {
    const [activeSection, setActiveSection] = useState<string>("Calculator");

    const renderActiveSection = () => {
        switch (activeSection) {
            case "Calculator":
                return <Calculator />;
            case "BulkAddProducts":
                return <BulkAddProducts />;
            case "AddressBilling":
                return <div>Address & Billing Section</div>;
            default:
                return null;
        }
    };

    const handleSectionClick = (section: string) => {
        setActiveSection(section);
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            {/* Buttons row */}
            <Row className="justify-content-center">
                <Col md="auto">
                    <div className="mb-2">
                        {/* Navigation Buttons on top */}
                        <Button
                            variant={activeSection === "Calculator" ? "primary" : "outline-primary"}
                            onClick={() => handleSectionClick("Calculator")}
                            className="me-2"
                            style={{
                                backgroundColor: activeSection === "Calculator" ? "#7352ff" : "transparent",
                                border: activeSection === "Calculator" ? "none" : "1px solid #7352ff",
                                color: activeSection === "Calculator" ? "#fff" : "#7352ff",
                            }}
                        >
                            <i className="mdi mdi-calculator me-2"></i>
                            Calculator
                        </Button>

                        <Button
                            variant={activeSection === "BulkAddProducts" ? "primary" : "outline-primary"}
                            onClick={() => handleSectionClick("BulkAddProducts")}
                            className="me-2"
                            style={{
                                backgroundColor: activeSection === "BulkAddProducts" ? "#7352ff" : "transparent",
                                border: activeSection === "BulkAddProducts" ? "none" : "1px solid #7352ff",
                                color: activeSection === "BulkAddProducts" ? "#fff" : "#7352ff",
                            }}
                        >
                            <i className="mdi mdi-plus me-2"></i>
                            BulkAddProducts
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
                </Col>
            </Row>

            {/* Active Section */}
            <div
                className="usercontainer flex-grow-1"
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    marginTop: "10px",
                }}
            >
                {renderActiveSection()}
            </div>
        </div>
    );
};

export default Toolnavbar;
