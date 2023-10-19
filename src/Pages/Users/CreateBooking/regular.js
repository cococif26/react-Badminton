import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import FormInput from '../../../Components/Form/input';
import axios from '../../../api/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { useGeneralContext } from "../../../context/generalContext";

const CreateBookingFormRegular = () => {
  const navigate = useNavigate();

  const { setTriggerNotif, triggerNotif } = useGeneralContext()

  const [dataCustomer, setDataCustomer] = useState([]);
  const [dataCourt, setDataCourt] = useState([]);
  const [showSendBookingCode, setShowSendBookingCode] = useState(false);
  const [transactionResponse, setTransactionResponse] = useState({});
  const [errors, setErrors] = useState([]);
  const [totallyHour, setTotallyHour] = useState(0)
  const [totallyPrice, setTotallyPrice] = useState(0)
  const [initialPrice, setInitialPrice] = useState(0)

  useEffect(() => {
    axios.get('/api/regular-select')
    .then(({ data }) => {
      setDataCustomer(data);
    })
    .catch((e) => {
      Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    });
    axios.get('/api/court-select')
    .then(({ data }) => {
      setDataCourt(data);
    })
    .catch((e) => {
      Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    })
  }, [])

  const [values, setValues] = useState({ court: "", customer_id: "", start_time: "", finish_time: "" });
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (values.start_time && values.finish_time) {
      const start = new Date(values.start_time).getTime()
      const finish = new Date(values.finish_time).getTime()
      const diffInSeconds = (finish - start) / 1000
      const diffInHours = diffInSeconds / (60 * 60)
      setTotallyHour(Math.round(diffInHours * 100) / 100)
    }
  }, [values.start_time, values.finish_time])

  useEffect(() => {
    const court = dataCourt.find(court => parseInt(court.value) === parseInt(values.court))
    if (court) {
      setInitialPrice(court.initial_price)
    }
  }, [values.court])

  useEffect(() => {
    if (totallyHour && initialPrice) {
      const totallyPrice = initialPrice *  totallyHour
      setTotallyPrice(totallyPrice)
    }
  }, [initialPrice, totallyHour])

  const onSubmit = async (e) => {
    e.preventDefault();
    if (showSendBookingCode) {
      Swal.fire({ icon: "warning", title: "Warning!", html: "you have made a booking!", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    } else {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const { data } = await axios.post('/api/rental', {
          court_id: values.court,
          customer_id: values.customer_id,
          start: values.start_time,
          finish: values.finish_time,
          user_id: secureLocalStorage.getItem('id') ?? '',
        });
        setErrors("");
        setTriggerNotif(!triggerNotif)
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
      await axios.get('/sanctum/csrf-cookie')
      const { data } = await axios.post('/api/send-booking-code', {
        phone_number: transactionResponse.phone_number,
        booking_code: transactionResponse.booking_code
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
      <Form style={{ marginLeft: "-5px" }}>
        <Row>
          <Col className="col-12 col-md-6">
            <Form.Label>Customer</Form.Label>
            <Form.Select name="customer_id" className="form-select form-select-sm" onChange={onChange} disabled={showSendBookingCode}>
              <option value="">-- Choose Customer --</option>
              {dataCustomer.map((customer) => (
                <option key={customer.customer_code} value={customer.customer_code}>
                  {customer.name} ({customer.phone_number})
                </option>
              ))}
            </Form.Select>
            {errors.customer_id && <span className="text-danger">{errors.customer_id[0]}</span>}
          </Col>
          <Col className="col-12 col-md-6">
            <Form.Label>Court</Form.Label>
            <Form.Select name="court" className="form-select form-select-sm" onChange={onChange} disabled={showSendBookingCode}>
              <option value="">-- Choose Court --</option>
              {dataCourt.map((court) => (
                <option key={court.value} value={court.value}>
                  {court.label}. starting price: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(court.initial_price)}
                </option>
              ))}
            </Form.Select>
            {errors.court_id && <span className="text-danger">{errors.court_id[0]}</span>}
          </Col>
          
          <Col className="col-6 col-md-3 mt-1">
            <FormInput type="datetime-local" name="start_time" label="Start Time Booking" value={values.start_time} onChange={onChange} disabled={showSendBookingCode} />
            {errors.start && <span className="text-danger">{errors.start[0]}</span>}
          </Col>
          <Col className="col-6 col-md-3 mt-1" style={{ marginLeft: "20px" }}>
            <FormInput type="datetime-local" name="finish_time" label="Finish Time Booking" value={values.finish_time} onChange={onChange} disabled={showSendBookingCode} />
            {errors.finish && <span className="text-danger">{errors.finish[0]}</span>}
          </Col>
         
          <Col className="col-12"></Col>
          <Col className="col-12 col-md-6 mt-3 text-center">
            <b>Totally hour booking:</b>
            <br />
            <br />
            <br />
            {transactionResponse.total_hour ? <span>{transactionResponse.total_hour <= 1 ? transactionResponse.total_hour + ' hour' : transactionResponse.total_hour + ' hours'}</span> : <span>{totallyHour ? (totallyHour <= 1 ? totallyHour + ' hour' : totallyHour + ' hours' ) : '...'}</span>}
          </Col>
          <Col className="col-12 col-md-6 mt-3 text-center">
            <b>Totally price booking:</b>
            <br />
            <br />
            <br />
            {transactionResponse.total_price ? <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(transactionResponse.total_price)}</span> : <span>{totallyPrice ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totallyPrice) : '...'}</span>}
          </Col>
          <Col className="col-12 text-right mt-2">
            <button type="button" className="btn btn-sm me-md-4" onClick={onSubmit} disabled={showSendBookingCode} style={{ background: "#B21830", color: "white" }}>
              Booking
            </button>
          </Col>
        </Row>
      </Form>
      {showSendBookingCode === true &&
        <>
          <hr className="my-4 text-dark"></hr>
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
              <div className="card card-barcode mt-2 mb-3 shadow text-white" style={{ background: "#dc3545" }}>
              <img src={process.env.REACT_APP_BACKEND_URL + '/public/storage/' + transactionResponse.qr_code_image} alt="qr-code" />
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
                    <button onClick={sendBookingCode} className="btn btn-secondary btn-sm mt-2 ">
                      Send Via Whatsapp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>}
    </>
  );
};

export default CreateBookingFormRegular;
