import React from "react";
import { Button } from "react-bootstrap";

const Panel = () => {
  return (
    <div className="panel">
      
      <Button
        variant="primary"
        onClick={() => this.handleShow("showModalChoose")}
      >
        Open
      </Button>
      <Button
        variant="primary"
        onClick={() => this.handleShow("showModalConfirm")}
      >
        Save
      </Button>
    </div>
  );
};

export default Panel