import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { UpdateUser, type User } from "../../../../FrontendRequests/Requests-Api/User";
import NotificationModal from '../../NotifcationSystem/NotificationModal';

interface Props {
  userprofile: User;
}

const UserEditCard = ({ userprofile }: Props) => {
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalFailure, setShowModalFailure] = useState(false);

  const [formData, setFormData] = useState({
    firstname: userprofile.firstname || '',
    lastname: userprofile.lastname || '',
    username: userprofile.username || '',
    email: userprofile.email || '',
    phonenumber: userprofile.phonenumber || '',
    country: userprofile.country_name || ''
  });

  const [errors, setErrors] = useState({
    firstname: false,
    lastname: false,
    username: false,
    email: false,
    phonenumber: false,
    country: false,
  });

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone number regex (8 digits)
  const phoneRegex = /^[0-9]{8}$/;

  // Validation functions
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstname':
        // Length should be between 5 and 10
        return value.length >= 2 && value.length <= 15;
      case 'lastname':
        // Length should be between 5 and 10
        return value.length >= 2 && value.length <= 15;
      case 'username':
        // Length should be between 5 and 10
        return value.length >= 5 && value.length <= 10;
      case 'email':
        return emailRegex.test(value);
      case 'phonenumber':
        // Validate phone number with regex
        return phoneRegex.test(value);
      case 'country':
        return value.length > 0;
      default:
        return true;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Validate field
    const isValid = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !isValid
    }));
  };

  const handlesubmit = () => {
    // Check if all fields are valid
    const isFormValid = Object.keys(errors).every(
      (key) => !errors[key as keyof typeof errors]
    );

    if (isFormValid) {
      const updateUser: User = userprofile;
      updateUser.username = formData.username;
      updateUser.firstname = formData.firstname;
      updateUser.lastname = formData.lastname;
      updateUser.email = formData.email;
      updateUser.phonenumber = formData.phonenumber as number;

      UpdateUser(updateUser).then(result => {
        if (result.result) {
          setShowModalSuccess(true);
        } else {
          setShowModalFailure(true);
        }
      })
    } else {
      // Handle form submission failure
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ padding: '20px', width: '100%' }}>
        <Card.Body>
          <Card.Title>Rediger brugeroplysninger</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            Opdatering af brugeroplysninger vil gennemgå en privatlivsrevision
          </Card.Subtitle>

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>Navn</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    placeholder={userprofile.firstname}
                    className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                  />
                  {errors.firstname && <small className="text-danger">Navn skal være mellem 2 og 15 tegn</small>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Efternavn</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    placeholder={userprofile.lastname}
                    className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                  />
                  {errors.lastname && <small className="text-danger">Efternavn skal være mellem 2 og 15 tegn</small>}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Brugernavn</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={userprofile.username}
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  />
                  {errors.username && <small className="text-danger">Brugernavn skal være mellem 5 og 10 tegn</small>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={userprofile.email}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && <small className="text-danger">Ugyldig email</small>}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPhoneNumber">
                  <Form.Label>Telefon nummer</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    placeholder={userprofile.phonenumber?.toString()}
                    className={`form-control ${errors.phonenumber ? 'is-invalid' : ''}`}
                  />
                  {errors.phonenumber && <small className="text-danger">Telefonnummer skal være 8 cifre</small>}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formCountry">
                  <Form.Label>Land</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    placeholder={userprofile.country_name}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button variant="primary" style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }} onClick={handlesubmit}>
                Indsend
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <NotificationModal show={showModalSuccess}
       onHide={() => setShowModalSuccess(false)}
       title="Bruger opdateret"
       textBody=""
       textFooter=""
       iconClass="mdi mdi-check-circle-outline"
       iconColor="green"/>

      <NotificationModal show={showModalFailure}
       onHide={() => setShowModalFailure(false)}
       title="Bruger ikke opdateret"
       textBody=""
       textFooter=""
       iconClass="mdi mdi-alert-circle"
       iconColor="red"/>
    </div>
  );
};

export default UserEditCard;
