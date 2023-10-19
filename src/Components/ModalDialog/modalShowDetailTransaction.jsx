import React from "react";
import { Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

const ModalShowDetailTransaction = ({ show, handleClose, data }) => {
  return (<Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Detail Transaction</Modal.Title>
    </Modal.Header>
    <Modal.Body className="text-center">
      <h2>{data.booking_code}</h2>
      <label>Total price : <span>{new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.total_price)}</span></label>
      <hr />
      <Table>
        <thead>
          <tr>
            <th>Paid</th>
            <th>Debt</th>
            <th>Deposit</th>
            <th>Play Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.customer_paid)}</td>
            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.customer_debt)}</td>
            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.customer_deposit)}</td>
            <td>{data.total_hour > 1 ? data.total_hour + ' hours' : data.total_hour + ' hour'}</td>
          </tr>
        </tbody>
      </Table>
    </Modal.Body>
  </Modal>)
}

export default ModalShowDetailTransaction;