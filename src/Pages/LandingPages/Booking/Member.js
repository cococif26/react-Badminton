// import React, { useState } from "react";
// import { Form, Row, Col } from "react-bootstrap";
// import FormInput from "../../../Components/Form/input";
// import { Trash3 } from "react-bootstrap-icons";
// import "../../Users/CreateBooking/form.css";

// const CreateBookingFormMember = () => {
//   const BoxRows = ({ rows, boxRowRemove, onValUpdate }) => {
//     return rows.map((rowsData, index) => {
//       const { start_time, end_time } = rowsData;
//       return (
//         <Row className="m-1 p-2 box-border mt-2" key={index}>
//           <Col className="col-12 col-md-8 column">
//             <Row>
//               <Col className="col-12 col-md-6">
//                 <b>Court</b>
//                 <br />
//                 <br />
//                 &nbsp;&nbsp;&nbsp;&nbsp;...
//               </Col>
//             </Row>
//           </Col>
//           <Col className="col-12 col-md-4 column">
//             <Row>
//               <Col className="col-6">
//                 <FormInput type="time" name="start_time" label="Start" value={start_time} onChange={(event) => onValUpdate(index, event)} />
//               </Col>
//               <Col className="col-6">
//                 <FormInput type="time" name="end_time" label="End" value={end_time} onChange={(event) => onValUpdate(index, event)} />
//               </Col>
//               <Col className="col-12 mt-3 text-right">
//                 <button type="button" className="btn btn-danger btn-sm me-md-2 text-white" onClick={() => boxRowRemove(index)}>
//                   <Trash3 className="text-white" style={{ marginTop: -5 }} />
//                 </button>
//                 <button type="button" className="btn btn-danger btn-sm me-md-2" onClick={addRowBox}>
//                   + Add
//                 </button>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       );
//     });
//   };

//   const dataDefault = { court: "", customer: "", start_time: "", end_time: "" };
//   const [rows, initRow] = useState([dataDefault]);
//   const addRowBox = () => {
//     initRow([...rows, dataDefault]);
//   };
//   const boxRowRemove = (index) => {
//     const dataRow = [...rows];
//     dataRow.splice(index, 1);
//     initRow(dataRow);
//   };
//   const onValUpdate = (i, event, valueSel = []) => {
//     if (valueSel.value) {
//       const name = event.name;
//       const value = valueSel;
//       const data = [...rows];
//       data[i][name] = value;
//       initRow(data);
//     } else {
//       const { name, value } = event.target;
//       const data = [...rows];
//       data[i][name] = value;
//       initRow(data);
//     }
//   };

//   return (
//     <>
//       <Form style={{ marginBottom: "15%" }}>
//         <Col className="col-12 col-md-6">
//           <b>Customer</b>
//           <br />
//           <br />
//           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...
//         </Col>
//         <BoxRows rows={rows} boxRowRemove={boxRowRemove} onValUpdate={onValUpdate} />
//         <Row>
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
//         </Row>
//         <Col className="col-12 text-right mt-5">
//           <button type="button" className="btn btn-danger btn-sm me-md-4">
//             Booking
//           </button>
//         </Col>
//       </Form>
//     </>
//   );
// };

// export default CreateBookingFormMember;
