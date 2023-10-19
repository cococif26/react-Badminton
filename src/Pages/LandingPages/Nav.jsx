import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Nav, Navbar } from "react-bootstrap";
import "./nav.css";
import Loader from "../../Components/Loader/Loading.js";
import Court from "../../Components/Court";
import axios from "../../api/axios";
import Swal from "sweetalert2";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { dirIcon } from "../../Components/Services/config";
import { Link } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/logout");
      secureLocalStorage.clear();
      Swal.fire({ icon: "success", title: "Logged out!", showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 1500 });
      setTimeout(function () {
        navigate("/landing-page", { replace: true });
      }, 1500);
    } catch (e) {
      if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          html: e.response.data.message,
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            secureLocalStorage.clear();
            navigate("/landing-page", { replace: true });
          }
        });
      } else {
        secureLocalStorage.clear();
        navigate("/landing-page", { replace: true });
      }
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href="/#"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ));

  // const [color, setColor] = useState(false);
  // const changeColor = () => {
  //   if (window.scrollY >= 90) {
  //     setColor(true);
  //   } else {
  //     setColor(false);
  //   }
  // };

  const [courts, setCourts] = useState([]);
  const [contact, setContact] = useState({});

  useEffect(() => {
    axios
      .get("/api/landing-page")
      .then(({ data }) => {
        setCourts(data.courts);
        setContact(data.contact);
      })
      .catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      });
  }, []);

  // window.addEventListener("scroll", changeColor);

  return courts.length < 0 ? (
    <Loader />
  ) : (
    <>
      {/* navbar */}
      <Navbar expand="lg" className="nav nav-expand-md nav-bg">
        <Container>
          <Navbar.Brand href="#" className="mt-3">
            {/* <img src="./brand.png" alt=".." style={{ width: "35px" }} /> */}
            <span className="fw-bold text-light mt-3"> Shuttlebook.</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-label="Toggle navigation" className="navbar shadow-none border-0 bg-white" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="mt-3" style={{ maxHeight: "100px", marginLeft: "360px" }}>
              <Nav.Link href="#about" style={{ marginRight: "20px", color: "white" }}>
                About
              </Nav.Link>
              <Nav.Link href="#court" style={{ marginRight: "20px", color: "white" }}>
                Court
              </Nav.Link>
              <Nav.Link href="#servis" style={{ marginRight: "20px", color: "white" }}>
                Services
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {secureLocalStorage.getItem("name") ? (
            <div className="text-white">
              <Dropdown>
                <Dropdown.Menu style={{ marginLeft: "-125px" }}>
                  `{" "}
                  <Dropdown.Item eventKey="1" style={{ marginTop: "-20px" }}>
                    <Link to={"/profile-user"}>Profile</Link>
                  </Dropdown.Item>
                  <Dropdown.Item style={{ marginRight: "10px", color: "black" }}>
                    <Link to={"/dashboard-user"}>Dashboard</Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="2"
                    onClick={() => {
                      const customerExpiration = new Date(secureLocalStorage.getItem("expiration"));
                      const now = new Date();
                      const timeDiff = customerExpiration - now;
                      const minutesRemaining = Math.ceil(timeDiff / 1000 / 60);
                      Swal.fire({
                        icon: "warning",
                        title: "Are you sure?",
                        html: `Are you sure to logout from this web? <br /> ${minutesRemaining > 0 ? `you cannot login again more than once in ${minutesRemaining <= 1 ? minutesRemaining + " minute" : minutesRemaining + " minutes"}` : ""}`,
                        showConfirmButton: true,
                        showCancelButton: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleLogout();
                        }
                      });
                    }}
                  >
                    <span>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                  <div className="mt-3">
                    <img src={`${dirIcon}user-circle.png`} alt="" style={{ width: "35px" }} /> <span className="localstorge">{secureLocalStorage.getItem("name")}</span>
                  </div>
                </Dropdown.Toggle>
              </Dropdown>
            </div>
          ) : (
            <div className="ms-auto mt-3">
              <Link to="/userstep" className="btn me-1 btn-signin" style={{ borderRadius: 40, color: "white", background: "#7F1122" }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-Registrion" style={{ borderRadius: 40, color: "white" }}>
                Registration
              </Link>
            </div>
          )}
        </Container>
      </Navbar>
      {/* akhir navbar */}
      {/* header */}
      <div className="p-5 mb- bg-light jumbotron" style={{ marginBottom: "60px" }}>
        <div className="container py-5">
          <h1 className=" fw-bold" style={{ textAlign: "center", marginTop: "65px", fontWeight: 200, color: "white" }}>
            Top Quality Badminton Sports Venue
          </h1>
          <p style={{ textAlign: "center", color: "white" }}>bfb is an application that allows you to book a court or facility online or offline. </p>
          <a href="#about">
            <div className="scroll-down"></div>
          </a>
        </div>
      </div>
      {/* end header */}
      {/* about */}
      <section id="about" style={{ padding: "70px 0px", marginBottom: "70px" }}>
        <div className="about-area section-padding" id="about">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-mb-12">
                <div className="img-area ">
                  <img src="./assets/img/bg-lan.jpg" alt="..." />
                </div>
              </div>
              <div className="col-12 col-lg-6  text-container">
                <div className="about-text">
                  <h2>
                    Know About <span style={{ color: "#201E37" }}>{contact.gor_name || "..."}</span>
                  </h2>
                  <p className="about-bfb">
                    <strong>{contact.gor_name || "..."}</strong> is a badminton court located in <strong>{contact.address || "..."}</strong>, this court provides a booking place whose facilities are guaranteed. toilets, canteens, prayer
                    rooms and several other facilities. this field also offers affordable prices. if you are interested, please start asking through the whatsapp number <strong>{contact.number || "..."}</strong> or through email{" "}
                    <strong>{contact.email || "..."}.</strong>
                  </p>
                  {/* <button className="btn" style={{ background: "#B21830", color: "white" }}>
                    Learn More
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about */}

      {/* diskon */}
      <section id="diskon" style={{ marginBottom: "70px" }}>
        <div className="container">
          <div className="card-diskon rounded" style={{ backgroundColor: "#201E37" }}>
            <div className="row">
              <div className="col-md-4">
                <img src="../assets/img/people2.jpg" alt="..." className="img-fluid rounded" style={{ width: "100vh", height: "100%" }} />
              </div>
              <div className="col-md-8 text-white p-5">
                <p className="card-title mt-2" style={{ color: "#DADADA" }}>
                  Booking
                </p>
                <h1 className="mt-2" style={{ fontWeight: "bold" }}>
                  Play badminton with special price! <br />
                  Enjoy playing badminton at BFB with a special price.
                </h1>
                {!secureLocalStorage.getItem("name") && (
                  <div className="btn btn-lg btn-light mt-3">
                    <Link to="/userstep" className="text-decoration-none text-dark">
                      Sign In now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Court */}
      <section id="court">
        <div className="container py-5">
          <div className="row cnt2 text-center">
            <div className="col">
              <h2 className="fw-bold" style={{ color: "#201E37" }}>
                Our Courts
              </h2>
              <p className="text-dark">BFB is a sports hall that rents out courts specifically for badminton.</p>
            </div>
          </div>

          {/* card */}
          <div className="row row-cols-1 row-cols-md-3 g-4 py-5">
            {courts.map((court, index) => {
              return <Court key={court.id} id={court.id} label={court.label} image_path={court.image_path} description={court.description} initial_price={court.initial_price} index={index} />;
            })}
            {/* <div className="col">
              <div className="card card-court">
                <img src="./assets/img/court/6.jpg" className="card-img-top" alt="..." />
                <div className="card-body">
                  <div className="rental-prince">
                    <h5 className="card-title fw-bold">Court B</h5>
                    <div className="text">
                      Rental price
                      <h5 className="fw-bold" style={{ color: "#d93221" }}>
                        Rp 25,000/hour
                      </h5>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16" style={{ color: "red" }}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>{" "}
                  <span> Prayer rooms</span>
                  <br />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16" style={{ color: "red" }}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>{" "}
                  <span> Toilets</span>
                  <br />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16" style={{ color: "red" }}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>{" "}
                  <span> Canteens</span>
                  <br />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16" style={{ color: "red" }}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>{" "}
                  <span className="mb-3"> Carpeted court</span>
                  <br />
                </div>
                <a className="btn btn-booking text-center border border-dark" type="button" href="userstep" style={{ fontSize: "24px", width: "100%", padding: "15px" }}>
                  Booking
                </a>
              </div>
            </div>

            <div className="col">
              <div className="card card-court">
                <img src="./assets/img/court/4.jpg" className="card-img-top" alt="..." />
                <div className="card-body">
                  <div className="rental-prince">
                    <h5 className="card-title fw-bold">Court C</h5>
                    <div className="text">
                      Rental price
                      <h5 className="fw-bold" style={{ color: "#d93221" }}>
                        Rp 35,000/hour
                      </h5>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16" style={{ color: "red" }}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>{" "}
                  <span> Prayer rooms</span>
                  <br />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16" style={{ color: "red" }}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>{" "}
                  <span> Toilets</span>
                  <br />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16" style={{ color: "red" }}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>{" "}
                  <span> Canteens</span>
                  <br />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16" style={{ color: "red" }}>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>{" "}
                  <span className="mb-3"> Floor court</span>
                  <br />
                </div>
                <a className=" btn btn-booking text-center border border-dark" type="button" href="userstep" style={{ fontSize: "24px", width: "100%", padding: "15px" }}>
                  Booking
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      {/* end card court */}
      {/* Servicer */}
      <Container id="servis">
        <section className="setup" style={{ padding: "30px 0", marginBottom: "70px" }}>
          <div className="container py-5">
            <div className="row cnt2 text-center">
              <div className="col">
                <h2 className="fw-bold" style={{ color: "#201E37" }}>
                  Our Services
                </h2>
                <p>Services we provide at bfb that can make it easier for you to book the court</p>
              </div>
            </div>
          </div>
          <div className="items text-center">
            <div className="row">
              <div className="col-md-4">
                <div className="icons" style={{ padding: "27px 0" }}>
                  <img src="./assets/icon/document.png" alt="..." />
                </div>
                <div className="desc">
                  <h5 style={{ fontWeight: 700, fontSize: "18px", lineHeight: "24px", paddingBottom: "12px" }}>Registration</h5>
                  <p style={{ fontWeight: 400, fontSize: "13px", lineHeight: "27px", maxWidth: "284px", margin: "0 auto", color: "black" }}>The customer registers, then the customer will receive an OTP code as verification.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="icons" style={{ padding: "27px 0" }}>
                  <img src="./assets/icon/code.png" alt="..." />
                </div>
                <div className="desc">
                  <h5 style={{ fontWeight: 700, fontSize: "18px", lineHeight: "24px", paddingBottom: "12px" }}>QR Code</h5>
                  <p style={{ fontWeight: 400, fontSize: "13px", lineHeight: "27px", maxWidth: "284px", margin: "0 auto", color: "black" }}>Customers will receive a QR Code after placing an order. The QR code is used as proof of order.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="icons" style={{ padding: "27px 0" }}>
                  <img src="./assets/icon/pay.png" alt="..." />
                </div>
                <div className="desc">
                  <h5 style={{ fontWeight: 700, fontSize: "18px", lineHeight: "24px", paddingBottom: "12px" }}>Payment</h5>
                  <p style={{ fontWeight: 400, fontSize: "13px", lineHeight: "27px", maxWidth: "284px", margin: "0 auto", color: "black" }}>Payment is made after the customer has finished playing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
      {/* end about work */}
      {/* footer */}
      <div className="footer lpages text-center text-light p-3 mt-5">
        <div className="last-footer">
          <p className="copyright"> &copy; Copyright 2023 PKL Cibione. All Rights Reserved</p>
        </div>
      </div>
    </>
  );
};

export default Landing;
