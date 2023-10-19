import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import NavbarPublic from "../../../Components/NavbarPublic";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form, Row, Col } from "react-bootstrap";
import FormInput from "../../../Components/Form/input";
import secureLocalStorage from "react-secure-storage";
import axios from "../../../api/axios";
import Swal from "sweetalert2";
import Loader from "../../../Components/Loader/Loading";
const ProfilUser = () => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState([]);
  const [customer, setCustomer] = useState({});

  const [effectTrigger, setEffectTrigger] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    axios
      .get("/api/me")
      .then(({ data }) => {
        setCustomer(data);
        setName(data.name);
      })
      .catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      });
  }, [effectTrigger]);

  const handleUpdate = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/api/update-customer-name", { name: name, customer_code: secureLocalStorage.getItem("customer_code") });
      setErrors("");
      Swal.fire({ icon: "success", title: "Success!", html: response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false }).then((result) => {
        if (result.isConfirmed) {
          handleClose();
          setName("");
          setEffectTrigger(!effectTrigger);
          secureLocalStorage.setItem("name", name);
        }
      });
    } catch (e) {
      if (e?.response?.status === 422) {
        setErrors(e.response.data.errors);
      } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          html: e.response.data.message,
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  };

  const TableRows = ({ rows }) => {
    return rows.map((val, index) => {
      return (
        <tr key={val.id}>
          <td>{index + 1}</td>
          <td>{val.start}</td>
          <td>{val.finish}</td>
          <td>{val.status}</td>
          <td>{val.price}</td>
          <td>{val.court}</td>
          <td>{val.booking_code}</td>
          <td>{val.created_at}</td>
        </tr>
      );
    });
  };

  return customer && customer.rentals ? (
    <>
      <NavbarPublic />
      <div className="container py-5" style={{ marginTop: "50px", marginBottom: "172px" }}>
        <div className="row m-auto">
          <div className="col-lg-3">
            <div className="card text-center p-5">
              <div className="card-body">
                <img src="./assets/icon/user-circle.png" alt="user" className="img img-thumbnail rounded-circle w-50" />
                <h2 className="mt-2">{customer.name}</h2>
                <Button variant="danger" className="btn btn-sm" onClick={handleShow}>
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="col-lg-8 mt-2">
            <div className="row">
              <div className="shadow border rounder p-5 mb-4 bg-white ">
                <h5>Details</h5>
                <b className="mb-2">Full Name</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp; {customer.name}
                <br />
                <b className="mb-2">Phone number</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp; {customer.phone_number}
                <br />
                <b className="mb-2">Membership status</b>&nbsp;:&nbsp;{customer.membership_status === "R" ? "Regular" : "Member"}
                <br />
                <b className="mb-2">Active period</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp; {customer.membership_status === "M" && customer.member_active_period}
                <br />
                {/* <b className="mb-2">Status: </b>{customer.status === 'Y' ? 'active' : 'in active'}
                <br /> */}
                <b className="mt-3">Deposit</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{" "}
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(customer.deposit)}
                <br />
                <b className="mt-3">Debt</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{" "}
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(customer.debt)}
                <br />
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="row">
              <div className="table-responsive">
                <table className="table table-hover mt-4" border={1}>
                  <thead>
                    <tr>
                      <th width={"2%"}>No</th>
                      <th width={"15%"}>start</th>
                      <th width={"15%"}>finish</th>
                      <th width={"10%"}>status</th>
                      <th width={"15%"}>price</th>
                      <th width={"15%"}>court</th>
                      <th width={"15%"}>booking code</th>
                      <th width={"15%"}>booked at</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableRows rows={customer.rentals} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modall */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="col-12 col-md-12">
              <Form.Group>
                <FormInput type="text" name="name" label="Change name" placeholder={customer.name} value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <span className="text-danger">{errors.name[0]}</span>}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" className="btn-sm" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="footer lpages text-center text-light p-3 mt-5">
        <div className="last-footer">
          <p className="copyright"> &copy; Copyright 2023 PKL Cibione. All Rights Reserved</p>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default ProfilUser;
