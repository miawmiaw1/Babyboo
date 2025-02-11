import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { type User, fetchUserById, changepassword, UpdateUser } from "../../../FrontendRequests/Requests-Api/User";
import NotificationModal from '../NotifcationSystem/NotificationModal';
import { UserRoles } from "../../../FrontendRequests/Enums/Usertypes";

interface Props {
  Userprofile: User,
  isadmin: boolean
}

const SecurityUser = ({ Userprofile, isadmin }: Props) => {
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalFailure, setShowModalFailure] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(Userprofile.membertypeid as number); // Change to number
  const [formData, setFormData] = useState({
    kodeord: '',
    nykode: '',
    gentagkode: '',
  });

  const [errors, setErrors] = useState({
    kodeord: true,
    nykode: true,
    gentagkode: true,
  });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(Number(event.target.value)); // Ensure the value is parsed as a number
  };

  const validateField = (name: string, value: string) => {
    if (name === 'nykode' || name === 'gentagkode') {
      return value.length >= 10;
    }
    return value.length > 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !validateField(name, value) || (name === 'gentagkode' && value !== formData.nykode),
    }));
  };

    const handlememberchange = () => {
      if (selectedStatus !== null) {
        // Find the key corresponding to the selected status value
        const statusKey = Object.keys(UserRoles).find(
          (key) => UserRoles[key as keyof typeof UserRoles] === selectedStatus
        );
        
        if (statusKey) {
          Userprofile.membertypeid = UserRoles[statusKey as keyof typeof UserRoles];
  
          UpdateUser(Userprofile).then((result) => {
            if (result.result) {
              alert(`Medlem type Ændret til: ${statusKey}`);
            } else {
              alert("Medlem type kunne ikke ændres");
            }
          });
        }
      } else {
        alert('Ingen Medlem type valgt!');
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isFormValid = Object.values(errors).every((error) => !error) &&
      formData.nykode === formData.gentagkode;

    if (isFormValid) {
      fetchUserById(Userprofile.userid).then((result) => {
        if (result.result && result.data.userid === Userprofile.userid) {
          changepassword(result.data.userid, formData.kodeord, formData.nykode).then((result) => {
            if (result.result) {
              setShowModalSuccess(true);
              setFormData({ kodeord: '', nykode: '', gentagkode: '' });
            } else {
              setShowModalFailure(true);
              setFormData({ kodeord: '', nykode: '', gentagkode: '' });
            }
          })
        } else {
          setShowModalFailure(true);
          setFormData({ kodeord: '', nykode: '', gentagkode: '' });
        }
      })

      
    } else {
      setErrors({
        kodeord: formData.kodeord === '',
        nykode: formData.nykode.length < 10,
        gentagkode: formData.nykode !== formData.gentagkode,
      });
    }
  };

  return (
    <div>
      {/* First Card */}
      <div className="card p-2 mt-2">
        <div className="card-body">
          <h4 className="mb-3">Ændre kodeord</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Kodeord</Form.Label>
            <Form.Control
              type="password"
              name="kodeord"
              value={formData.kodeord}
              onChange={handleInputChange}
              isInvalid={errors.kodeord}
              placeholder="Indtast kodeord"
            />
            <Form.Control.Feedback type="invalid">Kodeord er påkrævet</Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-2">
            <Form.Label>Ny kodeord</Form.Label>
            <Form.Control
              type="password"
              name="nykode"
              value={formData.nykode}
              onChange={handleInputChange}
              isInvalid={errors.nykode}
              placeholder="Indtast ny kodeord"
            />
            <Form.Control.Feedback type="invalid">Minimum 10 tegn</Form.Control.Feedback>
          </Form.Group>
  
          <Form.Group className="mb-2">
            <Form.Label>Gentag kodeord</Form.Label>
            <Form.Control
              type="password"
              name="gentagkode"
              value={formData.gentagkode}
              onChange={handleInputChange}
              isInvalid={errors.gentagkode}
              placeholder="Gentag kodeord"
            />
            <Form.Control.Feedback type="invalid">Kodeordene stemmer ikke overens</Form.Control.Feedback>
          </Form.Group>
  
          <div className="text-center">
            <Button type="submit" variant="primary" size="sm">Skift kode</Button>
          </div>
        </form>
  
        <NotificationModal
          show={showModalSuccess}
          onHide={() => setShowModalSuccess(false)}
          title="Kodeord opdateret"
          textBody="Dit kodeord er blevet opdateret med succes."
          iconClass="mdi mdi-check-circle-outline"
          iconColor="green"
        />
  
        <NotificationModal
          show={showModalFailure}
          onHide={() => setShowModalFailure(false)}
          title="Fejl ved opdatering"
          textBody="Kunne ikke opdatere kodeordet. Prøv igen senere."
          iconClass="mdi mdi-alert-circle"
          iconColor="red"
        />
      </div>
  
      {/* Second Card - Render only if isadmin is true */}
      {isadmin && (
        <div className="card p-2 mt-2">
          <div className="card-body">
            <h4 className="mb-3">Medlem Typer</h4>

            <div className="edit-order-container">
                <div className="form-group">
                  <label htmlFor="status-select" className="form-label">
                    Medlem Type
                  </label>
                  <select
                    id="status-select"
                    className="form-control"
                    value={selectedStatus ?? ''} // Ensure selectedStatus is matched with value
                    onChange={handleSelectChange}
                  >
                    <option value="" disabled>Vælg Medlemtype</option>
                    {Object.entries(UserRoles).map(([key, value], index) => (
                      <option key={value} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    className="print-button"
                    onClick={handlememberchange}
                    style={{
                      backgroundColor: 'purple',
                      borderColor: 'purple',
                      color: 'white',
                      marginTop: '10px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'darkviolet';
                      e.currentTarget.style.borderColor = 'darkviolet';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'purple';
                      e.currentTarget.style.borderColor = 'purple';
                    }}
                  >
                    Skift Medlemstype
                  </Button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );   
};

export default SecurityUser;
