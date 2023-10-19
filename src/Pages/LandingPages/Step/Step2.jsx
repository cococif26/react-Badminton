import React, { useState } from "react";
import { Card, Col, Container, Row, Form, Button } from "react-bootstrap";
import { logoApp, namaApp } from "../../../Components/Services/config";
import OTPInput from "otp-input-react";
import Swal from "sweetalert2";
import "../nav.css";
import axios from "../../../api/axios";
import secureLocalStorage from "react-secure-storage";
import { useGeneralContext } from "../../../context/generalContext";

const Step2 = () => {
  const {handleSetExpiration} = useGeneralContext()
  const [OTP, setOTP] = useState('');
  const [errors, setErrors] = useState([])

  const handleResendOTP = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      const { data } = await axios.post("/api/send-otp-login?re-login=true", { phone_number: secureLocalStorage.getItem('resend_ph')});
      setErrors('')
      if (data.response.text === "Success") {
        Swal.fire({ icon: "success", title: "Success!", html: `OTP code has been resent to ${data.response.to} <br/> `, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 1500 });
        handleSetExpiration(data.expiration); // object
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: data.response.text, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    } catch (e) {
      if (e?.response?.status === 422) {
        setErrors(e.response.data.errors);
      } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
        Swal.fire({ icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false, });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
   try {
     await axios.get("/sanctum/csrf-cookie")
     const { data } = await axios.post("/api/verify-otp", { otp_code: OTP })
     setErrors('')
     secureLocalStorage.clear()
     secureLocalStorage.setItem('token', data.token)
     secureLocalStorage.setItem('phone_number', data.customer.phone_number)
     secureLocalStorage.setItem('customer_code', data.customer.customer_code)
     secureLocalStorage.setItem('name', data.customer.name)
     secureLocalStorage.setItem('role', 'user')
     secureLocalStorage.setItem('expiration', data.customer.expiration)
     Swal.fire({ icon: "success", title: "Success!", html: "OTP verified successfully", showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
     setTimeout(function () {
      //  navigate('/landing-page', { replace: true })
       window.location.href = 'landing-page';
     }, 2000);
   } catch (e) {
     if (e?.response?.status === 422) {
       setErrors(e.response.data.errors);
     } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
       Swal.fire({ icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false, });
     } else {
       Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
     }
   }
  };

  return (
    <>
    <div style={{ backgroundColor: "#F5F5F5" }}>
    <Container className="regis pt-5 pb-5 m-auto"  style={{ height: "100vh" }}>
      <Card className="bgRegis">
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
          <Col className="col-12 col-md-6 text-black divRight position-relative p-5">
            <div className="position-relative top-50 start-50 translate-middle p-4">
              <div className="d-md-none d-md-block text-center mb-2">
                <img src={`/${logoApp}`} alt="" width={100} />
              </div>
              <b className="text-heading" style={{ fontSize: 25 }}>
                Check your inbox!
              </b>
              <p style={{fontSize:13}}>We are sending an phone<br/>numberverification code to WhatsApp please enter the code.</p>
              <Form onSubmit={handleVerifyOTP} style={{ width: "100%" }}>
                <Form.Group className="mb-3 mt-2 m-2">
                  <OTPInput value={OTP} onChange={setOTP}  OTPLength={6} otpType="number" />
                  {errors.otp_code && <span className="text-danger">{errors.otp_code[0]}</span>}
                </Form.Group>
                <Button type="submit" className="btn btn-sm btn-block col-12 mt-2 rounded"  style={{ background: "#B21830", color: "white" }}>
                  Submit
                </Button>
                    <div className="mt-2" style={{ float: "right" }}>
                      <small>Didn't get your otp yet? </small>
                      <span style={{ color: 'dodgerblue', textDecoration: "none", cursor: 'pointer' }} onClick={() => {
                        const exp = secureLocalStorage.getItem('exp')
                        Swal.fire({ icon: "warning", title: "Are you sure to resend the code?", html: `You can only resend in ${exp.resend_limit > 1 ? exp.resend_limit + ' times' : exp.resend_limit + ' time'} <br /> You've tried ${exp.recent_resend > 1 ? exp.recent_resend + ' times' : exp.recent_resend + ' time'}`, showConfirmButton: true, showCancelButton: true, allowOutsideClick: false, allowEscapeKey: false }).then(result => {
                          if (result.isConfirmed) {
                            handleResendOTP()
                          }
                        })
                      }}>Resend OTP</span> 
                      <span> {secureLocalStorage.getItem('exp')?.recent_resend}x</span>
                    </div>
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

export default Step2;
