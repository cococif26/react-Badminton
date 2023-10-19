// import React, { useState } from "react";
// import { Form, Row, Col } from "react-bootstrap";
// import FormInput from "../../../Components/Form/input";

// const CreateBookingFormRegular = ({court_id}) => {
//   const [values, setValues] = useState({ customer: "", court: "", start_time: "", end_time: "" });
//   const onChange = (e) => {
//     // console.log(e.target.value);
//     setValues({ ...values, [e.target.name]: e.target.value });
//   };

//   return (
//     <>
//       <Form className="mt-3" style={{ marginBottom: "10%" }}>
//         <Row>
//           <Col className="col-12 col-md-3 col-lg-3"></Col>
//           <Col className="col-12 col-md-3 col-lg-3 text-center mb-4">
//             <b>Customer</b>
//             <br />
//             <br />
//             ...
//           </Col>
//           <Col className="col-12 col-md-3 col-lg-3"></Col>
//           <Col className="col-12 col-md-3 col-lg-3 text-center">
//             <b>Court</b>
//             <br />
//             <br />
//             ...
//           </Col>
//           <Col className="col-12"></Col>
//           <Col className="col-12 col-md-1 col-lg-1"></Col>
//           <Col className="col-6 col-md-2">
//             <FormInput type="time" name="start_time" label="Start" value={values.start_time} onChange={onChange} />
//           </Col>
//           <Col className="col-6 col-md-2">
//             <FormInput type="time" name="end_time" label="End" value={values.end_time} onChange={onChange} />
//           </Col>
//           <Col className="col-12 col-md-3 mt-3 text-center">
//             <b>Totally hour:</b>
//             <br />
//             <br />
//             ...
//           </Col>
//           <Col className="col-12 col-md-3 mt-3 text-center">
//             <b>Totally price:</b>
//             <br />
//             <br />
//             ...
//           </Col>
//           <Col className="col-12 text-right mt-5">
//             <button type="button" className="btn btn-danger btn-sm me-md-4">
//               Booking
//             </button>
//           </Col>
//         </Row>
//       </Form>
//     </>
//   );
// };

// export default CreateBookingFormRegular;
