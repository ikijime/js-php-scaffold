import React from 'react';
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({target, handleClose, method}) => {
    return (
        <Modal show={target} onHide={handleClose}>
        <Modal.Body>Save changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={method}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
};

export default ConfirmModal;
