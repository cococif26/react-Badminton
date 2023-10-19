import React, { useState } from "react";
import { Card, Col, Container, Row, Form, Button} from "react-bootstrap";
import { logoApp, namaApp } from "../../../Components/Services/config";
import FormInput from "../../../Components/Form/input";

const LoginCustomer = () => {
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const inputs = [
    {
      id: 1,
      label: "User name",
      name: "phonenumber",
      type: "text",
    },
    {
      id: 2,
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "input password",
      errorMessage: errors.password,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!values.phonenumber.trim()) validationErrors.phonenumber = "Phone number required";
    if (!values.password.trim()) validationErrors.password = "Password required";

    // console.log(validationErrors);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      localStorage.setItem("token", "abcd12345");
      localStorage.setItem("phonenumber", values.phonenumber);
      setTimeout(function () {
        window.location.href = "/";
      }, 2000);
    }
  };

  const onChange = (e) => {
    setErrors({});
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Container className="login pt-5 pb-5">
      <Card className="bgLogin shadow ">
        <Row>
          <Col className="col-sm-6 px-0 d-none d-md-block divLeft position-relative">
            <div className="position-relative top-50 start-50 translate-middle p-4">
              <img src={`/${logoApp}`} alt="" width={30} style={{ marginTop: -10 }} />
              <b style={{ paddingLeft: 5, fontSize: 20 }}>{namaApp}</b>
              <div className="text-danger mt-4 text-heading">Management Booking</div>
              <div className="mb-3 text-heading">Court Badminton</div>
              <div style={{ fontSize: 12 }}>
                BFB provides various features that support the operational
                <br />
                management of yout Badminton sport facility
              </div>
            </div>
          </Col>
          <Col className="col-12 col-md-6 text-white divRight position-relative p-5">
            <div className="position-relative top-50 start-50 translate-middle p-4">
              <div className="d-md-none d-md-block text-center mb-2">
                <img src={`/${logoApp}`} alt="" width={100} />
              </div>
              <p style={{ fontSize: 20 }}>Let's login to your BFB account first</p>
              <br />
              <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                {inputs.map((input) => (
                  <Form.Group key={input.id} className="mb-0">
                    <FormInput key={input.id} {...input} value={values[input.phonenumber]} onChange={onChange} icon={input.icon} />
                  </Form.Group>
                ))}
                <Button type="submit" className="btn-danger btn-sm btn-block col-12 mt-2 rounded" href="dashboard-user">
                  Login
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default LoginCustomer;
