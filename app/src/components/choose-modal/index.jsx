import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

const ChooseModal = ({ target, handleClose, redirect, data }) => {
  const handleLinkClick = (e, item) => {
    redirect(e, item);
    handleClose();
  }

  const list = data.map((item, idx) => {
    // If item is backup
    if (item.time) {
      return (
        <ListGroup.Item action href="#" key={idx} onClick={(e) => handleLinkClick(e, item)}>
          {item.path} {item.time}
        </ListGroup.Item>
      )
    } else {
      return (
        <ListGroup.Item action href="#" key={idx} onClick={(e) => handleLinkClick(e, item)}>
          {item}
        </ListGroup.Item>
        )
    }
  })

  return (
    <Modal show={target} onHide={handleClose}>
      <Modal.Body>
        <ListGroup variant="flush">
          {list}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {/* <Button variant="primary" onClick={method}>
            Save Changes
          </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default ChooseModal;
