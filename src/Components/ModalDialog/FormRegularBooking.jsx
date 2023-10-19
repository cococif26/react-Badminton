import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import FormInput from "../Form/input";
import axios from "../../api/axios";
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";

const FormRegularBooking = ({ isShow, handleClose, court_id, initialPrice }) => {
  const [ values, setValues ] = useState({ start: "", finish: "" });
  const [ errors, setErrors ] = useState([])
  const [ showSendBookingCode, setShowSendBookingCode ] = useState(false);
  const [ transactionResponse, setTransactionResponse ] = useState({});
  const [ totallyHour, setTotallyHour ] = useState(0)
  const [ totallyPrice, setTotallyPrice ] = useState(0)
  const onChange = (e) => {
    setValues({ ...values, [ e.target.name ]: e.target.value });
  };

  useEffect(() => {
    if (totallyHour && initialPrice) {
      const totallyPrice = initialPrice * totallyHour
      setTotallyPrice(totallyPrice)
    }
  }, [totallyHour])

  useEffect(() => {
    if (values.start && values.finish) {
      const start = new Date(values.start).getTime()
      const finish = new Date(values.finish).getTime()
      const diffInSeconds = (finish - start) / 1000
      const diffInHours = diffInSeconds / (60 * 60)
      setTotallyHour(Math.round(diffInHours * 100) / 100)
    }
  }, [ values.start, values.finish ])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (showSendBookingCode) {
      Swal.fire({ icon: "warning", title: "Warning!", html: "you have made a booking!", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    } else {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const { data } = await axios.post('/api/rental', {
          court_id: court_id,
          customer_id: secureLocalStorage.getItem('customer_code') ?? '',
          start: values.start,
          finish: values.finish
        }, {headers: {Authorization: `Bearer ${secureLocalStorage.getItem('token')}`}});
        setErrors("");
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
            handleClose()
            setValues({start: '', finish: ''})
            setErrors([])
            setShowSendBookingCode(false)
            setTransactionResponse({})
            setTotallyHour(0)
            setTotallyPrice(0)
          }
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: data.text, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    }
  };

  return (<Modal show={isShow} className="my-5 py-5" onHide={() => {
    handleClose()
    setValues({ start: '', finish: '' })
    setErrors([])
    setShowSendBookingCode(false)
    setTransactionResponse({})
    setTotallyHour(0)
    setTotallyPrice(0)
  }}>
    <Modal.Header closeButton>
      <Modal.Title>Booking</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-5">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-6">
            <FormInput type="datetime-local" name="start" label="Time Start Booking" value={values.start} onChange={onChange} disabled={showSendBookingCode} />
            {errors.start && <span className="text-danger">{errors.start[ 0 ]}</span>}
          </div>
          <div className="col-6">
            <FormInput type="datetime-local" name="finish" label="Time Finish Booking" value={values.finish} onChange={onChange} disabled={showSendBookingCode} />
            {errors.finish && <span className="text-danger">{errors.finish[ 0 ]}</span>}
          </div>
        </div>
     
        <div className=" row justify-content-center">
          <div className="col-6 mt-3 text-center">
            <b>Totally hour:</b>
            <br />
            <br />
            {transactionResponse.total_hour ? <span>{transactionResponse.total_hour <= 1 ? transactionResponse.total_hour + ' hour' : transactionResponse.total_hour + ' hours'}</span> : <span>{totallyHour ? (totallyHour <= 1 ? totallyHour + ' hour' : totallyHour + ' hours') : '...'}</span>}
          </div>
          <div className="col-6 mt-3 text-center">
            <b>Totally price:</b>
            <br />
            <br />
            {transactionResponse.total_price ? <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(transactionResponse.total_price)}</span> : <span>{totallyPrice ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totallyPrice) : '...'}</span>}
          </div>
          <div className="row justify-content-center">
            <div className="col-12 text-right mt-5">
              <button type="submit" className="btn btn-danger btn-sm me-md-4" disabled={showSendBookingCode}>
                Booking
              </button>
            </div>
          </div>
        </div>
    
      </form>
      {showSendBookingCode === true &&
        <>
          <hr className="my-4 text-dark"></hr>
          <div className="row">
            <div className="col-md-12">
              <div className="card card-barcode mt-2 mb-3 shadow text-white" style={{ background: "#dc3545" }}>
                <img src={process.env.REACT_APP_BACKEND_URL + '/public/storage/' + transactionResponse.qr_code_image} alt="qr-code" /></div>
                <div className="card-body codeqr d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <p>Booking Code : </p>
                    <p className="fw-bold">{transactionResponse.booking_code}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Phone number : </p>
                    <p className="fw-bold">{transactionResponse.phone_number}</p>
                  </div>
                  <div className=" mt-1 d-flex justify-content-center">
                    <button onClick={sendBookingCode} className="btn btn-success btn-sm mt-2 ">
                      Get booking code Via Whatsapp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          
        </>}
    </Modal.Body>
  </Modal>)
}

export default FormRegularBooking;