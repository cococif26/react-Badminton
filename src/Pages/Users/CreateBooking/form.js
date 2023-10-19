import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import CreateBookingFormRegular from "./regular";
import CreateBookingFormMember from "./member";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const CreateBookingForm = () => {
  const [checkedRegular, setCheckedRegular] = useState(true);
  const [checkedMember, setCheckedMember] = useState(false);

  const handleRadioBtn = (aksi = "") => {
    // console.log(aksi);
    if (aksi === "member") {
      setCheckedRegular(!checkedRegular);
      setCheckedMember(!checkedMember);
    } else {
      setCheckedRegular(!checkedRegular);
      setCheckedMember(!checkedMember);
    }
  };

  return (
    <>
      <h4 className="mt-5">
        <b>
          <Link to={-1} className="btnBack">
            <ArrowLeft />
          </Link>
          Create booking
        </b>
      </h4>
      <Row>
        <Col>
          <Card className="p-3 mt-3">
            <div className="d-flex">
              <div className="form-check">
                <input id="regId" type="radio" className="form-check-input" value="regular" checked={checkedRegular} onChange={() => handleRadioBtn("regular")} />
                <label htmlFor="regId" style={{ fontSize: "16px" }}>
                  Regular
                </label>
              </div>
              &nbsp;&nbsp;&nbsp;
              <div className="form-check form-check-inline">
                <input id="memId" type="radio" className="form-check-input" value="member" checked={checkedMember} onChange={() => handleRadioBtn("member")} />
                <label htmlFor="memId" style={{ fontSize: "16px" }}>
                  Member
                </label>
              </div>
            </div>
            {checkedRegular ? <CreateBookingFormRegular /> : <CreateBookingFormMember />}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateBookingForm;
