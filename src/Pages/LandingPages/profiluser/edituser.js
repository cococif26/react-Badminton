// import React from "react";
// import { Link, useParams } from "react-router-dom";
// import { Form, Card, Row, Col, Button } from "react-bootstrap";
// import FormInput from "../../../Components/Form/input";
// import { ArrowLeft } from "react-bootstrap-icons";
// import NavbarPublic from "../../../Components/NavbarPublic";

// const FormProfileUser = () => {
//   const { id } = useParams();
//   return (
//     <>
//       <NavbarPublic/>
//       <h4>
//         <b>
//           <Link to="/profile-user" className="btnBack">
//             <ArrowLeft />
//           </Link>
//           {id ? "Edit" : "Edit"} Customer Profile
//         </b>
//       </h4>
//       <Row>
//         <Col className="col-sm-6 m-auto">
//           <Card className="p-4 mt-3" style={{ marginLeft: "-18px" }}>
//             <Form>
//               <Row>
//                 <Col className="col-12">
//                   <Form.Group>
//                     <FormInput type="text" name="Deposit" label="Deposit"/>
//                   </Form.Group>
//                 </Col>
//                 <Col className="col-12">
//                   <Form.Group>
//                     <FormInput type="text" name="Debt" label="Debt" />
//                   </Form.Group>
//                 </Col>
//                 <Col className="col-12 text-right pt-4">
//                   <Button type="submit" className="btn btn-danger btn-sm">
//                     Save Change
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           </Card>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default FormProfileUser;
