import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { fetchUserById, type User } from '../../../FrontendRequests/Requests-Api/User';
import { UpdateAddress } from '../../../FrontendRequests/Requests-Api/Address';
import NotificationModal from '../NotifcationSystem/NotificationModal';
import { FetchAllCountry, type Country } from '../../../FrontendRequests/Requests-Api/Country';

interface Props {
  Userprofile: User;
}

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const AddressBilling = ({ Userprofile }: Props) => {
  const [Countries, setCountries] = useState<Country[]>([]);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalFailure, setShowModalFailure] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    postalCode: '',
    city: '',
    country: '',
  });

  const [errors, setErrors] = useState({
    address: false,
    postalCode: false,
    city: false,
    country: false,
  });

  const GetCountries = async () => {
    try {
      const result = await FetchAllCountry();
      setCountries(result.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const validateField = (name: string, value: string) => {
    if (name === 'postalCode') {
      return /^[0-9]+$/.test(value) && value.trim() !== '';
    }
    return value.trim() !== '';
  };

  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !validateField(name, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      address: !validateField('address', formData.address),
      postalCode: !validateField('postalCode', formData.postalCode),
      city: !validateField('city', formData.city),
      country: !validateField('country', formData.country),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      try {
        const result = await fetchUserById(Userprofile.userid);
        if (result.result && result.data?.userid === Userprofile.userid) {
          const updateResult = await UpdateAddress(
            Userprofile.addressid as number,
            formData.address,
            parseInt(formData.postalCode),
            formData.city,
            parseInt(formData.country)
          );

          if (updateResult.result) {
            setShowModalSuccess(true);
            setFormData({ address: formData.address, postalCode: formData.postalCode, city: formData.city, country: formData.country });
          } else {
            setShowModalFailure(true);
          }
        } else {
          setShowModalFailure(true);
        }
      } catch (error) {
        console.error('Error updating address:', error);
        setShowModalFailure(true);
      }
    }
  };

  useEffect(() => {
    GetCountries();
  }, []);

  useEffect(() => {
    if (Countries.length > 0) {
      const country = Countries.find(
        (c) => c.country.toLowerCase() === (Userprofile.country_name as string).toLowerCase()
      );

      setFormData({
        address: Userprofile.user_address || '',
        postalCode: Userprofile.address_postalcode?.toString() || '',
        city: Userprofile.address_city || '',
        country: country ? country.countryid.toString() : '',
      });
    }
  }, [Countries]);

  return (
    <Row>
      <Col md={12}>
        <Card style={{ padding: '20px', width: '100%' }}>
          <Card.Body>
            <Card.Title>Edit User Information</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      isInvalid={errors.address}
                      placeholder="Enter your address"
                    />
                    <Form.Control.Feedback type="invalid">Address is required</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="formPostalCode">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      isInvalid={errors.postalCode}
                      placeholder="Enter your postal code"
                    />
                    <Form.Control.Feedback type="invalid">Postal code must be a number</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      isInvalid={errors.city}
                      placeholder="Enter your city"
                    />
                    <Form.Control.Feedback type="invalid">City is required</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="formCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      as="select"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      isInvalid={errors.country}
                    >
                      <option value="">Select a country</option>
                      {Countries.map((country) => (
                        <option key={country.countryid} value={country.countryid}>
                          {country.country}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">Country is required</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-5">
                <Button type="submit" variant="primary" style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}>
                  Submit
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <NotificationModal
        show={showModalSuccess}
        onHide={() => setShowModalSuccess(false)}
        title="Address Updated"
        textBody="Your address has been successfully updated."
        iconClass="mdi mdi-check-circle-outline"
        iconColor="green"
      />

      <NotificationModal
        show={showModalFailure}
        onHide={() => setShowModalFailure(false)}
        title="Update Failed"
        textBody="Failed to update address. Please try again later."
        iconClass="mdi mdi-alert-circle"
        iconColor="red"
      />
    </Row>
  );
};

export default AddressBilling;