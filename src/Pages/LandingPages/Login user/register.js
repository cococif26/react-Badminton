import PhoneInput from "react-phone-input-2";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { useGeneralContext } from "../../../context/generalContext";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import Swal from "sweetalert2";
import { Alert } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";

const Register = () => {

  const {defaultPhone, setDefaultPhone, handleSetResendPh, handleSetExpiration} = useGeneralContext()
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState([])
  const [ isShowAlert, setIsShowAlert ] = useState(false)

  useEffect(() => {
    setPhoneNumber(defaultPhone)
  }, [defaultPhone])

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/sanctum/csrf-cookie");
      const { data } = await axios.post("/api/send-otp-register", { 
        phone_number: phoneNumber.substring(0, 2) === "62" ? "0" + phoneNumber.slice(2) : phoneNumber,
        name: name
      });
      setErrors("");
      if (data.response.text === "Success") {
        Swal.fire({ icon: "success", title: "Success!", html: `OTP code has been sent to ${data.response.to}`, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false }).then((result) => {
          if (result.isConfirmed) {
            secureLocalStorage.clear();
            handleSetResendPh(data.phone_number); // string
            handleSetExpiration(data.expiration); // object
            navigate("/step2", { replace: true });
          }
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: data.response.text, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    } catch (e) {
      if (e?.response?.status === 422) {
        if (e.response.data.errors.phone_number[0] === 'phone_number_has_been_taken') {
          setIsShowAlert(true)
        } else {
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
      <section className="vh-100" style={{ background: "rgb(245, 245, 245)" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black">
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="back">
                      <Link to="/landing-page" className="btnBack">
                        <ArrowLeft className="rounded-circle"style={{ background: "#7F1122", color: "white", width: "30px", height: "30px" }}/>
                      </Link>
                      Back Home
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Registration</p>
                      <div className="d-flex justify-content-center">
                        {isShowAlert && <Alert variant="warning" style={{ width: "300px", fontSize: "13px" }} onClose={() => setIsShowAlert(false)} dismissible>
                          Your number is available <br /> you may go to the sign in page. <br />
                          <Link to='/userstep'>Go Sign In</Link>
                        </Alert>}
                      </div>
                      <form className="mx-1 mx-md-4" onSubmit={handleSendOTP}>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="form3Example1c">
                              Your Name
                            </label>
                            <input type="text" id="form3Example1c" placeholder="Example: John Doe"
                              className="form-control" name="name" label="Full name" value={name} onChange={(e) => {
                                setName(e.target.value)
                                setErrors([{name: []}])
                              }}
                              required minLength={3} maxLength={60}
                              />
                            {errors.name && <span className="text-danger">{errors.name[ 0 ]}</span>}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <label className="form-label">
                              Your Phone Number
                            </label>
                            <PhoneInput 
                              placeholder="input phone number" specialLabel={""} country={"id"}
                              value={phoneNumber.substring(0, 1) === "0" ? "62" + phoneNumber.slice(1) : phoneNumber ? phoneNumber : defaultPhone } 
                              onChange={(phone) => {
                                setDefaultPhone(phone)
                                setPhoneNumber(phone)
                                setErrors([{phone_number: []}])
                              }}
                              />
                              {errors.phone_number && <span className="text-danger">{errors.phone_number[ 0 ]}</span>}
                          </div>
                        </div>

                        <div className="mx-3 mb-3 mb-lg-4">
                          <button type="submit" className="btn btn-sm" style={{ background: "#7F1122", color: "white" }}>
                            Next
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img src="./assets/img/sigup.png" className="img-fluid" alt="Sample image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
