import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import FormSelect from "../../../Components/Form/select";
import FormInput from "../../../Components/Form/input";
// import { Trash3 } from "react-bootstrap-icons";
import "./form.css";
import axios from "../../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useGeneralContext } from "../../../context/generalContext";

const CreateBookingFormMember = () => {
  const navigate = useNavigate();

  const { setTriggerNotif, triggerNotif } = useGeneralContext();

  const [dataCustomer, setDataCustomer] = useState([]);
  const [dataCourt, setDataCourt] = useState([]);

  const [errors, setErrors] = useState([]);

  const [showSendBookingCode, setShowSendBookingCode] = useState(false);
  const [transactionResponse, setTransactionResponse] = useState({});
  const [customerCode, setCustomerCode] = useState("");

  const [totallyHour, setTotallyHour] = useState(0);
  const [totallyPrice, setTotallyPrice] = useState(0);

  const onChangeSelectCustomer = (e) => {
    setCustomerCode(e.target.value);
  };

  useEffect(() => {
    axios
      .get("/api/member-select")
      .then(({ data }) => {
        setDataCustomer(data);
      })
      .catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      });
    axios
      .get("/api/court-select")
      .then(({ data }) => {
        setDataCourt(data);
      })
      .catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      });
  }, []);

  const pluginSelect = "react-select";

  const BoxRow = ({ row, onRemove, onUpdate, index }) => {
    const { court, start_time, finish_time } = row;
    const handleChange = (event) => {
      const { name, value } = event.target;
      onUpdate(name, value);
    };
    return (
      <div>
        <Row className="m-1 p-2 box-border">
          <Col className="col-12 column">
            <Row>
              <Col className="col-12 col-md-4">
                <FormSelect plugin={pluginSelect} name="court" label="Court" menuPlacement="top" options={dataCourt} selected={court} onChange={(value) => onUpdate("court", value)} isDisabled={showSendBookingCode} />
                {errors[`rentals.${index}.court_id`] && <span className="text-danger">{errors[`rentals.${index}.court_id`][0]}</span>}
              </Col>
              <Col className="col-12 col-md-4">
                <FormInput type="datetime-local" name="start_time" label="Start Time Booking" value={start_time} onChange={handleChange} disabled={showSendBookingCode} />
                {errors[`rentals.${index}.start`] && <span className="text-danger">{errors[`rentals.${index}.start`][0]}</span>}
              </Col>
              <Col className="col-12 col-md-4">
                <FormInput type="datetime-local" name="finish_time" label="Finish Time Booking" value={finish_time} onChange={handleChange} disabled={showSendBookingCode} />
                {errors[`rentals.${index}.finish`] && <span className="text-danger">{errors[`rentals.${index}.finish`][0]}</span>}
              </Col>
              <Col className="col-12 mt-3 text-right">
                {index === rows.length - 1 && (
                  <>
                    <button type="button" className="btn btn-sm me-md-2 text-white" onClick={onRemove} disabled={showSendBookingCode} style={{ background: "#B21830", color: "white" }}>
                      {/* <Trash3 className="text-white" style={{ marginTop: -5 }} /> */}
                      Delete
                    </button>
                    <button type="button" className="btn btn-sm me-md-2" onClick={addRowBox} disabled={showSendBookingCode} style={{ background: "#B21830", color: "white" }}>
                      Add
                    </button>
                  </>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  const dataDefault = { court: "", start_time: "", finish_time: "" };
  const [rows, setRows] = useState([dataDefault]);

  const addRowBox = () => {
    setRows([...rows, dataDefault]);
  };

  const removeRowBox = (index) => {
    const newRowData = [...rows];
    newRowData.splice(index, 1);
    setRows(newRowData);
  };

  const updateRow = (index, name, value) => {
    const newRowData = [...rows];
    newRowData[index][name] = value;
    setRows(newRowData);
  };

  useEffect(() => {
    let totalHour = 0;
    let totalPrice = 0;
    rows.forEach((row) => {
      if (row.start_time && row.finish_time && row.court) {
        const start = new Date(row.start_time).getTime();
        const finish = new Date(row.finish_time).getTime();
        const diffInSeconds = (finish - start) / 1000;
        const diffInHours = diffInSeconds / (60 * 60);
        totalHour += Math.round(diffInHours * 100) / 100;
        totalPrice += (Math.round(diffInHours * 100) / 100) * row.court.initial_price;
        setTotallyHour(totalHour);
        setTotallyPrice(totalPrice);
      }
    });
  }, [rows]);

  const BoxRows = ({ rows, onRemove, onUpdate }) => {
    return (
      <>
        {rows.map((row, index) => (
          <BoxRow key={index} row={row} onRemove={() => onRemove(index)} onUpdate={(name, value) => onUpdate(index, name, value)} index={index} />
        ))}
      </>
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (showSendBookingCode) {
      Swal.fire({ icon: "warning", title: "Warning!", html: "you have made a booking!", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    } else {
      try {
        await axios.get("/sanctum/csrf-cookie");
        const { data } = await axios.post("/api/create-multiple-rental", {
          customer_id: customerCode,
          user_id: secureLocalStorage.getItem("id") ?? "",
          rentals: rows.map((item) => ({
            start: item.start_time,
            finish: item.finish_time,
            court_id: item.court.value,
          })),
        });
        setErrors("");
        setTriggerNotif(!triggerNotif);
        Swal.fire({ icon: "success", title: "Success!", html: data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false }).then((result) => {
          if (result.isConfirmed) {
            setTransactionResponse(data.transaction);
            setShowSendBookingCode(true);
          }
        });
      } catch (e) {
        if (e?.response?.status === 422) {
          setErrors(e.response.data.errors);
        } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            html: e.response.data.message,
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        } else {
          Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        }
      }
    }
  };

  const sendBookingCode = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/sanctum/csrf-cookie");
      const { data } = await axios.post("/api/send-booking-code", {
        phone_number: transactionResponse.phone_number,
        booking_code: transactionResponse.booking_code,
      });
      if (data.text === "Success") {
        Swal.fire({ icon: "success", title: "Success!", html: `Booking code has been sent to ${data.to}`, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false }).then((result) => {
          if (result.isConfirmed) {
            navigate("/verification", { replace: true });
          }
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: data.text, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    }
  };

  return (
    <>
      <Form>
        <Col className="m-2 col-12 col-md-9 mb-3">
          <Form.Label>Customer</Form.Label>
          <Form.Select name="customer" className="form-select form-select-sm" onChange={onChangeSelectCustomer} disabled={showSendBookingCode}>
            <option value="">-- Choose Customer --</option>
            {dataCustomer.map((customer, index) => (
              <option key={customer.customer_code} value={customer.customer_code}>
                {customer.name} ({customer.phone_number})
              </option>
            ))}
          </Form.Select>
          {errors.customer_id && <span className="text-danger">{errors.customer_id[0]}</span>}
          {errors.court_id && <span className="text-danger">{errors.court_id[0]}</span>}
          {errors.start && <span className="text-danger">{errors.start[0]}</span>}
          {errors.finish && <span className="text-danger">{errors.finish[0]}</span>}
        </Col>
        <BoxRows rows={rows} onRemove={removeRowBox} onUpdate={updateRow} />
        <Row>
          <Col className="col-12 col-md-1"></Col>
          <Col className="col-12 col-md-4 mt-3 text-center">
            <b>Totally hour booking:</b>
            <br />
            <br />
            <br />
            {transactionResponse.total_hour ? (
              <span>{transactionResponse.total_hour <= 1 ? transactionResponse.total_hour + " hour" : transactionResponse.total_hour + " hours"}</span>
            ) : (
              <span>{totallyHour ? (totallyHour <= 1 ? totallyHour + " hour" : totallyHour + " hours") : "..."}</span>
            )}
          </Col>
          <Col className="col-12 col-md-4 mt-3 text-center">
            <b>Totally price booking:</b>
            <br />
            <br />
            {transactionResponse.total_price ? (
              <div>
                <del>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totallyPrice)}</del>
              </div>
            ) : (
              <br />
            )}
            {transactionResponse.total_price ? (
              <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(transactionResponse.total_price)}</span>
            ) : (
              <span>{totallyPrice ? "starting price: " + new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totallyPrice) : "..."}</span>
            )}
          </Col>
          <Col className="col-12 text-right mt-4">
            <button type="button" className="btn btn-sm me-md-4" onClick={onSubmit} disabled={showSendBookingCode} style={{ background: "#B21830", color: "white" }}>
              Booking
            </button>
          </Col>
        </Row>
        {/* card qrcode */}
        
      </Form>
      <div className="col-lg-6">
          {showSendBookingCode === true && (
            <>
              <hr className="my-4 text-dark"></hr>
              <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                  <div className="card card-barcode mt-2 mb-3 shadow text-white" style={{ background: "#dc3545" }}>
                    <img src={process.env.REACT_APP_BACKEND_URL + "/public/storage/" + transactionResponse.qr_code_image} alt="qr-code" />
                    <div className="card-body codeqr d-flex flex-column">
                      <div className="d-flex justify-content-between">
                        <p>Booking Code : </p>
                        <p className="fw-bold">&nbsp;{transactionResponse.booking_code}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>Phone number : </p>
                        <p className="fw-bold">&nbsp;{transactionResponse.phone_number}</p>
                      </div>
                      <div className="d-flex flex-column mt-4">
                        <button onClick={sendBookingCode} className="btn btn-warning btn-sm mt-2 ">
                          Send Via Whatsapp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
    </>
  );
};

export default CreateBookingFormMember;
