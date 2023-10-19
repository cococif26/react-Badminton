import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalConfirmDelete = ({show, handleYes, handleClose}) => {
    return (<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Sure to be removed?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
            <Button variant="danger" onClick={handleYes}>
                Yes
            </Button>
            <Button variant="secondary" className="ms-2" onClick={handleClose}>
                No
            </Button>
        </Modal.Body>
    </Modal>)
}

export default ModalConfirmDelete;