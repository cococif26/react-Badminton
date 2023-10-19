import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Form, Button } from "react-bootstrap";
import { logoApp, namaApp } from "../../../Components/Services/config";
import PhoneInput from "react-phone-input-2";
import axios from "../../../api/axios";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
// import NavbarPublic from "../../../Components/NavbarPublic";
// import FooterPublic from "../../../Components/FooterPublic";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGeneralContext } from "../../../context/generalContext";
import Alert from "react-bootstrap/Alert";
import secureLocalStorage from "react-secure-storage";

const FormStep = () => {
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const { handleSetResendPh, handleSetExpiration, setDefaultPhone, defaultPhone } = useGeneralContext();
  const [isShowAlert, setIsShowAlert] = useState(false)

  useEffect(() => {
    setPhoneNumber(defaultPhone)
  }, [defaultPhone])

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/sanctum/csrf-cookie");
      const { data } = await axios.post("/api/send-otp-login?normal-login=true", { phone_number: phoneNumber.substring(0, 2) === "62" ? "0" + phoneNumber.slice(2) : phoneNumber });
      setErrors("");
      if (data.response.text === "Success") {
        Swal.fire({ icon: "success", title: "Success!", html: `OTP code has been sent to ${data.response.to}`, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false }).then((result) => {
          if (result.isConfirmed) {
            secureLocalStorage.clear();
            handleSetResendPh(data.phone_number); // str
            handleSetExpiration(data.expiration); // obj
            navigate("/step2", { replace: true });
          }
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: data.response.text, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    } catch (e) {
      if (e?.response?.status === 422) {
        if (e.response.data.errors.phone_number[0] === 'invalid_phone_number') {
          setIsShowAlert(true)
        }else{
          setErrors(e.response.data.errors);
        }
      } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
        Swal.fire({ icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "#F5F5F5" }}>
        <Container className="regis pt-5 pb-5" style={{ height: "100vh", borderRadius: "30px" }}>
          <Card className="bgRegis">
            <Row>
              <Col className="col-sm-6 px-0 d-none d-md-block divLeft position-relative">
                <div className="position-relative top-50 start-50 translate-middle p-4">
                  <img src={`/${logoApp}`} alt="" width={30} style={{ marginTop: -10 }} />
                  <b style={{ paddingLeft: 5, fontSize: 20 }}>{namaApp}</b>
                  <div className="text-danger mt-4 text-heading fw-bold">Management Booking</div>
                  <div className="mb-3 text-heading">Court Badminton</div>
                  <div style={{ fontSize: 10 }}>
                    Shuttlebook provides various features that support the operational
                    <br />
                    management of yout Badminton sport facility
                  </div>
                </div>
              </Col>
              <Col className="col-12 col-md-6 text-black divRight position-relative p-5">
                <div className="position-relative top-50 start-50 translate-middle p-5">
                  <div className="d-md-none d-md-block text-center">
                    <img src={`/${logoApp}`} alt="" width={100} />
                  </div>
                  <div className="back" style={{ width: "50px" }}>
                    <Link to="/landing-page" className="btnBack">
                      <ArrowLeft />
                    </Link>
                  </div>
                  <b className="text-heading" style={{ fontSize: 20 }}>
                    New Sport Experience.
                  </b>
                  <br />
                  {isShowAlert ? <Alert variant="warning" style={{ width: "300px", fontSize: "13px" }} onClose={() => setIsShowAlert(false)} dismissible>
                      Your account is new <br/> you may go to the registration page to fill the name. <br />
                      <Link to='/register'>Go Register</Link>
                    </Alert>
                  : <sub>There are thousands of people who love to exercise just like you. Let's start our exercise journey together.</sub>}
                  <Form onSubmit={handleSendOTP} style={{ width: "120%" }}>
                    <Form.Group className="mb-2 mt-3 col-12">
                      <label>Phone Number</label>
                      <PhoneInput
                        placeholder="input phone number"
                        specialLabel={""}
                        country={"id"}
                        value={phoneNumber.substring(0, 1) === "0" ? "62" + phoneNumber.slice(1) : phoneNumber ? phoneNumber : defaultPhone}
                        onChange={(phone) => {
                          setDefaultPhone(phone); // str
                          setPhoneNumber(phone);
                          setErrors([]);
                        }}
                      />
                      {errors.phone_number && <span className="text-danger">{errors.phone_number[0]}</span>}
                    </Form.Group>
                    <Button type="submit" className="btn col-12 mt-2 rounded" style={{ background: "#B21830", color: "white" }}>
                      Next
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default FormStep;
