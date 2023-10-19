import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import FormInput from "../../../../Components/Form/input";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import CurrencyInput from "react-currency-input-field";
import PhoneInput from "react-phone-input-2";
import axios from "../../../../api/axios";
import Swal from "sweetalert2";

const CustomerMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isChange, setIsChange] = useState(false);
  const [values, setValues] = useState({ name: "", member_active_period: "" });
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [errors, setErrors] = useState([]);

  const [debt, setDebt] = useState("");
  const [deposit, setDeposit] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    const data = {
      name: values.name,
      phone_number: phoneNumber.substring(0, 2) === "62" ? "0" + phoneNumber.slice(2) : phoneNumber,
      deposit: deposit,
      debt: debt,
      status: selectedStatus,
      isChangeToRegular: isChange,
      member_active_period: values.member_active_period,
    };

    try {
      await axios.get("/sanctum/csrf-cookie");
      let response;
      if (id) {
        response = await axios.put("/api/customer/member/" + id, data);
      } else {
        response = await axios.post("/api/customer/member", data);
      }
      setErrors("");
      Swal.fire({ icon: "success", title: "Success!", html: response.data.message, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
      setTimeout(function () {
        navigate("/data-master/member", { replace: true });
      }, 2000);
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
        Swal.fire({
          icon: "error",
          title: "Error!",
          html: e.response.data,
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get("/api/customer/member/" + id + "/edit")
        .then(({ data }) => {
          setValues({ ...values, name: data.name, member_active_period: data.member_active_period.substring(0, 10) });
          setPhoneNumber(data.phone_number);
          setDebt(data.debt);
          setDeposit(data.deposit);
          setSelectedStatus(data.status);
        })
        .catch((e) => {
          Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        });
    }
  }, []);

  return (
    <>
      <h4 className="mt-5">
        <b>
          <Link to="/data-master/member" className="btnBack">
            <ArrowLeft />
          </Link>
          {id ? "Edit" : "Create"} Customer Member
        </b>
      </h4>
      <Row>
        <Col className="col-12 col-md-12 m-auto">
          <Card className="p-3 mt-3 mb-2" style={{ marginLeft: "-18px" }}>
            <Form>
              <Row>
                <Col className="col-12 col-sm-8 col-md-8 m-auto">
                  <Form.Group>
                    <FormInput type="text" name="name" label="Name" value={values.name} onChange={onChange} />
                    {errors.name && <span className="text-danger">{errors.name[0]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-sm-8 col-md-8 m-auto">
                  <Form.Group>
                    <label>Phone Number</label>
                    <PhoneInput specialLabel={""} country={"id"} value={phoneNumber.substring(0, 1) === "0" ? "62" + phoneNumber.slice(1) : phoneNumber} onChange={(phone) => setPhoneNumber(phone)} />
                    {errors.phone_number && <span className="text-danger">{errors.phone_number[0]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-sm-8 col-md-8 m-auto">
                  <Form.Group>
                    <label>Deposit</label>
                    <CurrencyInput className="form-control" prefix="Rp" value={deposit} id="deposit" name="deposit" onValueChange={(value) => setDeposit(value)} />
                    {errors.deposit && <span className="text-danger">{errors.deposit[0]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-sm-8 col-md-8 m-auto">
                  <Form.Group>
                    <label>Debt</label>
                    <CurrencyInput className="form-control" prefix="Rp" value={debt} id="debt" name="debt" onValueChange={(value) => setDebt(value)} />
                    {errors.debt && <span className="text-danger">{errors.debt[0]}</span>}
                  </Form.Group>
                </Col>
                {id && (
                  <Col className="col-12 col-sm-8 m-auto">
                    <label className="mt-2">change membership status</label>
                    <div className="d-flex">
                      <div className="form-check">
                        <button type="button" className="btn btn-warning btn-sm text-white" onClick={() => setIsChange(!isChange)} label="Change">
                          Change
                        </button>
                      </div>
                    </div>
                  </Col>
                )}
                {isChange === false && (
                  <Col className="col-12 col-sm-8 m-auto">
                    <Form.Group>
                      <FormInput type="date" name="member_active_period" label="Active Period" value={values.member_active_period} onChange={onChange} />
                      {errors.member_active_period && <span className="text-danger">{errors.member_active_period[0]}</span>}
                    </Form.Group>
                  </Col>
                )}
                <Col className="col-12 col-sm-8 m-auto">
                  <label>Status</label>
                  <div className="d-flex">
                    <div className="form-check">
                      <input id="activeId" type="radio" className="form-check-input" name="status" value={selectedStatus} onChange={() => setSelectedStatus("Y")} checked={selectedStatus === "Y"} />
                      <label htmlFor="activeId">Active</label>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div className="form-check form-check-inline">
                      <input id="inActiveId" type="radio" className="form-check-input" name="status" value={selectedStatus} onChange={() => setSelectedStatus("N")} checked={selectedStatus === "N"} />
                      <label htmlFor="inActiveId">In active</label>
                    </div>
                  </div>
                  {errors.status && <span className="text-danger">{errors.status[0]}</span>}
                </Col>
                <Col className="col-12 col-sm-8 col-md-8 m-auto text-right pt-3">
                  <button onClick={handleSubmitClick} type="button" className="btn mt-2" style={{ background: "#B21830", color: "white" }}>
                    Save
                  </button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CustomerMember;
