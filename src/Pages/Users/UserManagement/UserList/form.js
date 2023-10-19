import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import FormInput from "../../../../Components/Form/input";
import { ArrowLeft } from "react-bootstrap-icons";
import axios from "../../../../api/axios";
import Swal from "sweetalert2";

const UserListForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [values, setValues] = useState({ full_name: "", phone_number: "", username: "", password: "", role_id: "" });
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const [errors, setErrors] = useState([]);
  const [roles, setRoles] = useState([]);

    useEffect(() => {
        axios.get('/api/role-select')
        .then(({ data }) => {
            setRoles(data);
        })
        .catch((e) => {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        });
        if (id > 0) {
            axios.get('/api/admin-edit/' + id)
            .then(({data}) => {
                setValues({
                    ...values,
                    full_name: data.name,
                    phone_number: data.phone_number,
                    username: data.username,
                    password: data.password,
                    role_id: data.role_id
                })
                setSelectedStatus(data.status)
            })
            .catch((e) => {
               Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false }); 
            });
        }
    }, [])

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
      let response;
      if (id > 0) {
        response = await axios.put("/api/admin/" + id, data);
      } else {
        response = await axios.post("/api/admin", data);
      }
      setErrors("");
      Swal.fire({ icon: "success", title: "Success!", html: response.data.message, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
      setTimeout(function () {
        navigate('/user-management/user-list', { replace: true })
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

  return (
    <>
      <h4 className="mt-5">
        <b>
          <Link to="/user-management/user-list" className="btnBack">
            <ArrowLeft />
          </Link>
          {id ? "Edit" : "Create"} user list
        </b>
      </h4>
      <Row>
        <Col>
          <Card className="p-3 mt-3" style={{ marginLeft: "-18px" }}>
            <Form>
              <Row>
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <FormInput type="text" name="full_name" label="Full name" value={values.full_name} onChange={onChange} />
                    {errors.name && <span className="text-danger">{errors.name[0]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <FormInput type="text" name="phone_number" label="Phone number" value={values.phone_number} onChange={onChange} />
                    {errors.phone_number && <span className="text-danger">{errors.phone_number[0]}</span>}
                  </Form.Group>
                </Col>
                <Col className="col-12 col-md-6">
                  <Form.Group>
                    <FormInput type="text" name="username" label="Username" value={values.username} onChange={onChange} />
                    {errors.username && <span className="text-danger">{errors.username[0]}</span>}
                  </Form.Group>
                </Col>
                {!id && 
                  <Col className="col-12 col-md-6">
                    <Form.Group>
                      {/* <FormInput  type="text" name="password" label="Password" value={values.password} onChange={onChange} icon={input.icon} /> */}
                      <FormInput type="password" name="password" label="Password" value={values.password} onChange={onChange} />
                      {errors.password && <span className="text-danger">{errors.password[0]}</span>}
                    </Form.Group>
                  </Col>}
                <Col className="col-12 col-md-6">
                  {/* <FormSelect
                            name="role_id"
                            label="User role"
                            defaultValue={values.role_id}
                            className="form-select form-select-sm"
                            options={roles}
                            onChange={onChange}
                        /> */}
                  <Form.Label>User role</Form.Label>
                  <Form.Select name="role_id" className="form-select form-select-sm" onChange={onChange} value={values.role_id}>
                    <option value="">-- roles --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.role_id && <span className="text-danger">{errors.role_id[0]}</span>}
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
                  {errors.status && <span className="text-danger">{errors.status[0]}</span>}
                </Col>
                <Col className="col-12 text-right pt-3">
                  <Button type="submit" onClick={handleSubmitClick} className="btn" style={{ background: "#B21830", color: "white" }}>
                    Save
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

export default UserListForm;
