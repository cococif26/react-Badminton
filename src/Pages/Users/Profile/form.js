import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import FormInput from "../../../Components/Form/input";
import { ArrowLeft } from "react-bootstrap-icons";
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";
import axios from "../../../api/axios";

const FormProfile = () => {
  const [ selectedStatus, setSelectedStatus ] = useState("");
  const [ values, setValues ] = useState({ full_name: "", phone_number: "", username: "", password: "", role_id: "" });
  const onChange = (e) => {
    setValues({ ...values, [ e.target.name ]: e.target.value });
  };
  const [ errors, setErrors ] = useState([]);
  const [ roles, setRoles ] = useState([]);
  const navigate = useNavigate()

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    const data = {
      name: values.full_name,
      username: values.username,
      phone_number: values.phone_number,
      status: selectedStatus,
      role_id: values.role_id,
      password: values.password,
    };
    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.put("/api/admin/" + secureLocalStorage.getItem('id'), data);
      setErrors("");
      Swal.fire({ icon: "success", title: "Success!", html: response.data.message, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
      setTimeout(function () {
        navigate('/profile', { replace: true })
      }, 2000);
    } catch (e) {
      if (e?.response?.status === 422) {
        setErrors(e.response.data.errors)
      } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
        Swal.fire({
          icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  };

  useEffect(() => {
    axios.get('/api/role-select')
    .then(({ data }) => {
      setRoles(data);
    })
    .catch((e) => {
      Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    })
    .finally(() => {
      axios.get('/api/admin-edit/' + secureLocalStorage.getItem('id'))
        .then(({ data }) => {
          setValues({
            ...values,
            full_name: data.name,
            phone_number: data.phone_number,
            username: data.username,
            role_id: data.role_id
          })
          setSelectedStatus(data.status)
        })
        .catch((e) => {
          Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        });
    })
  }, [])

  return (
    <>
      <h4 className="mt-5">
        <b>
          <Link to="/profile" className="btnBack">
            <ArrowLeft />
          </Link>
          <span className="text-dark">Edit Profile Admin</span>
        </b>
      </h4>
      <Row>
        <Col className="col-sm-6 m-auto">
          <Card className="p-4 mt-3" style={{ marginLeft: "-18px" }}>
            <Form onSubmit={handleSubmitClick}>
              <Row>
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <FormInput type="text" name="full_name" label="Full name" value={values.full_name} onChange={onChange} />
                    {errors.name && <span className="text-danger">{errors.name[ 0 ]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <FormInput type="text" name="phone_number" label="Phone number" value={values.phone_number} onChange={onChange} />
                    {errors.phone_number && <span className="text-danger">{errors.phone_number[ 0 ]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <FormInput type="text" name="username" label="Username" value={values.username} onChange={onChange} />
                    {errors.username && <span className="text-danger">{errors.username[ 0 ]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <FormInput type="password" name="password" label="Password" value={values.password} onChange={onChange} />
                    {errors.password && <span className="text-danger">{errors.password[ 0 ]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-md-6">
                  <Form.Label>User role</Form.Label>
                  <Form.Select name="role_id" className="form-select form-select-sm" onChange={onChange} value={values.role_id}>
                    <option value="">-- roles --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.role_id && <span className="text-danger">{errors.role_id[ 0 ]}</span>}
                </Col>
                <Col className="col-12 col-md-6">
                  <br />
                  <div className="d-flex mt-2">
                    <div className="form-check">
                      <input id="activeId" type="radio" className="form-check-input" name="status" value={selectedStatus} onChange={() => setSelectedStatus('Y')} checked={selectedStatus === 'Y'} />
                      <label htmlFor="activeId">Active</label>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div className="form-check form-check-inline">
                      <input id="inActiveId" type="radio" className="form-check-input" name="status" value={selectedStatus} onChange={() => setSelectedStatus('N')} checked={selectedStatus === 'N'} />
                      <label htmlFor="inActiveId">In active</label>
                    </div>
                  </div>
                  {errors.status && <span className="text-danger">{errors.status[ 0 ]}</span>}
                </Col>
                <Col className="col-12 text-right pt-4">
                  <Button type="submit" className="btn btn-sm" style={{ background: "#B21830", color: "white" }}>
                    Save Change
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FormProfile;
