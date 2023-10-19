import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import FormInput from "../Form/input";
import axios from "../../api/axios";
import secureLocalStorage from "react-secure-storage";
import Swal from "sweetalert2";
import FormSelect from "../Form/select";
import { Trash3 } from "react-bootstrap-icons";

const FormMemberBooking = ({ isShow, handleClose, courtProp }) => {
  const [ dataCourt, setDataCourt ] = useState([]);
  const dataDefault = { court: courtProp, start_time: "", finish_time: "" };
  const [ rows, setRows ] = useState([ dataDefault ]);

  const [ errors, setErrors ] = useState([])
  const [ showSendBookingCode, setShowSendBookingCode ] = useState(false);
  const [ transactionResponse, setTransactionResponse ] = useState({});
  const [ totallyHour, setTotallyHour ] = useState(0)
  const [ totallyPrice, setTotallyPrice ] = useState(0)

  useEffect(() => {
    axios.get("/api/court-select").then(({ data }) => {
      setDataCourt(data);
    }).catch((e) => {
      Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    });
  }, [])

  useEffect(() => {
    let totalHour = 0
    let totalPrice = 0
    rows.forEach(row => {
      if (row.start_time && row.finish_time && row.court) {
        const start = new Date(row.start_time).getTime()
        const finish = new Date(row.finish_time).getTime()
        const diffInSeconds = (finish - start) / 1000
        const diffInHours = diffInSeconds / (60 * 60)
        totalHour += Math.round(diffInHours * 100) / 100
        totalPrice += (Math.round(diffInHours * 100) / 100) * row.court.initial_price
        setTotallyHour(totalHour)
        setTotallyPrice(totalPrice)
      }
    })
  }, [ rows ])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (showSendBookingCode) {
      Swal.fire({ icon: "warning", title: "Warning!", html: "you have made a booking!", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
    } else {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const { data } = await axios.post('/api/create-multiple-rental', {
          customer_id: secureLocalStorage.getItem('customer_code') ?? '',
          rentals: rows.map(item => ({
            start: item.start_time,
            finish: item.finish_time,
            court_id: item.court.value
          }))
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
            setRows([ dataDefault ])
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

  const addRowBox = () => {
    setRows([ ...rows, dataDefault ]);
  };
  const BoxRows = ({ rows, onRemove, onUpdate }) => {
    return (
      <>
        {rows.map((row, index) => (
          <BoxRow key={index} row={row} onRemove={() => onRemove(index)} onUpdate={(name, value) => onUpdate(index, name, value)} index={index} />
        ))}
      </>
    );
  };

  const BoxRow = ({ row, onRemove, onUpdate, index }) => {
    const { court, start_time, finish_time } = row;
    const handleChange = (event) => {
      const { name, value } = event.target;
      onUpdate(name, value);
    };
    return (
      <div className="row m-1 p-2 box-border">
        <div className="col-12 column">
          <div className="row">
            <div className="col-12 col-md-4">
              <FormSelect plugin={"react-select"} name="court" label="Court" menuPlacement="top" options={dataCourt} selected={court ? court : courtProp} onChange={(value) => onUpdate("court", value)} isDisabled={showSendBookingCode} />
              {errors[ `rentals.${index}.court_id` ] && <span className="text-danger">{errors[ `rentals.${index}.court_id` ][ 0 ]}</span>}
            </div>
            <div className="col-12 col-md-4">
              <FormInput type="datetime-local" name="start_time" label="Start" value={start_time} onChange={handleChange} disabled={showSendBookingCode} />
              {errors[ `rentals.${index}.start` ] && <span className="text-danger">{errors[ `rentals.${index}.start` ][ 0 ]}</span>}
            </div>
            <div className="col-12 col-md-4">
              <FormInput type="datetime-local" name="finish_time" label="Finish" value={finish_time} onChange={handleChange} disabled={showSendBookingCode} />
              {errors[ `rentals.${index}.finish` ] && <span className="text-danger">{errors[ `rentals.${index}.finish` ][ 0 ]}</span>}
            </div>
            <div className="col-12 mt-3 text-right">
              {index === rows.length - 1 &&
                <>
                  <button type="button" className="btn btn-danger btn-sm me-md-2 text-white" onClick={onRemove} disabled={showSendBookingCode}>
                    <Trash3 className="text-white" style={{ marginTop: -5 }} />
                  </button>
                  <button type="button" className="btn btn-danger btn-sm me-md-2" onClick={addRowBox} disabled={showSendBookingCode}>
                    + Add
                  </button>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (<Modal show={isShow} className="my-5 py-5" size="lg" onHide={() => {
    handleClose()
    setRows([ dataDefault ])
    setErrors([])
    setShowSendBookingCode(false)
    setTransactionResponse({})
    setTotallyHour(0)
    setTotallyPrice(0)
  }}>
    <Modal.Header closeButton>
      <Modal.Title>Booking</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {errors.customer_id && <p className="text-danger">{errors.customer_id[ 0 ]}</p>}
          {errors.court_id && <p className="text-danger">{errors.court_id[ 0 ]}</p>}
          {errors.start && <p className="text-danger">{errors.start[ 0 ]}</p>}
          {errors.finish && <p className="text-danger">{errors.finish[ 0 ]}</p>}
        </div>
        <BoxRows rows={rows}
          onRemove={(index) => {
            const newRowData = [ ...rows ];
            newRowData.splice(index, 1);
            setRows(newRowData);
          }}
          onUpdate={(index, name, value) => {
            const newRowData = [ ...rows ];
            newRowData[ index ][ name ] = value;
            setRows(newRowData);
          }} />
        <div className="row justify-content-center">
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
            <div className="col-md-12 d-flex justify-content-center">
              <div className="card card-barcode mt-2 mb-3 shadow text-white" style={{ background: "#dc3545" }}>
                <img src={process.env.REACT_APP_BACKEND_URL + '/public/storage/' + transactionResponse.qr_code_image} alt="qr-code" />
                <div className="card-body codeqr d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <p>Booking Code : </p>
                    <p className="fw-bold">{transactionResponse.booking_code}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Phone number : </p>
                    <p className="fw-bold">{transactionResponse.phone_number}</p>
                  </div>
                  <div className="d-flex flex-column mt-4">
                    <button onClick={sendBookingCode} className="btn btn-secondary btn-sm mt-2 ">
                      Get booking code Via Whatsapp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>}
    </Modal.Body>
  </Modal>)
}

export default FormMemberBooking;