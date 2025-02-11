import React from 'react';
import { Modal } from 'react-bootstrap';

interface CustomModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  textBody: string;
  textFooter?: string;
  iconClass?: string;
  iconColor?: string;
}

const NotificationModal: React.FC<CustomModalProps> = ({
  show,
  onHide,
  title,
  textBody,
  textFooter,
  iconClass,
  iconColor,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="text-white" style={{backgroundColor: iconColor}}>
        <Modal.Title className="d-flex align-items-center">
          <i className={`${iconClass} me-2`} style={{ fontSize: "1.5rem" }}></i>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center p-4">
        <i className={`${iconClass} me-2`} style={{ fontSize: "4rem" }}></i>
        <p className="mt-3 fs-5">{textBody}</p>
        {textFooter && <p className="mt-3 fs-5">{textFooter}</p>}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center"></Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
