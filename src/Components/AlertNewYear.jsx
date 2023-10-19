import React from "react";
import Modal from "react-bootstrap/Modal";

const AlertNewYear = ({ isShow, handleClose }) => {
  return (<Modal show={isShow} onHide={handleClose} size="sm" centered={false}>
    <Modal.Header closeButton>
      <Modal.Title>it's December already</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center">
      <Modal.Dialog>Time to add a new holiday schedule for the next year ({new Date().getFullYear() + 1})`</Modal.Dialog>
      <button className="btn btn-info" onClick={handleClose}>Confirm</button>
    </Modal.Body>
  </Modal>)
}

export default AlertNewYear;