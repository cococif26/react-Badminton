import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import FormInput from "../../../../Components/Form/input";
import axios from "../../../../api/axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import CurrencyInput from "react-currency-input-field";

const Rush = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({ start: "", finish: "", day_name: "" });
  const [courts, setCourts] = useState([]);
  const [errors, setErrors] = useState([]);

  const [courtId, setCourtId] = useState("");
  const [initialPrice, setInitialPrice] = useState("");
  const [priceIncrease, setPriceIncrease] = useState("");

  const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const onChangeSelectCourt = (e) => {
    const selected = e.target.value;
    if (selected) {
      const [cid, ip] = selected.split(":");
      setCourtId(cid);
      setInitialPrice(ip);
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios
      .get("/api/court-select")
      .then(({ data }) => {
        setCourts(data);
      })
      .catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      });
      if (id > 0) {
        axios.get('/api/peak-time-edit/' + id).then(({data}) => {
          setValues({
            start: data.start,
            finish: data.finish,
            day_name: data.day_name
          })
          setPriceIncrease(data.price_increase)
          setCourtId(data.court_id)
          setInitialPrice(data.initial_price)
        })
      }
  }, []);

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    const data = {
      court_id: courtId,
      start: values.start,
      finish: values.finish,
      day_name: values.day_name.toLowerCase(),
      price_increase: priceIncrease,
    };

    try {
      await axios.get("/sanctum/csrf-cookie");
      let response;
      if (id > 0) {
        response = await axios.put("/api/peak-time/" + id, data);
      } else {
        response = await axios.post("/api/peak-time", data);
      }
      setErrors("");
      Swal.fire({ icon: "success", title: "Success!", html: response.data.message, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
      setTimeout(function () {
        navigate('/data-master/peaktime', { replace: true })
      }, 2000);
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
          allowEscapeKey: false
        });
        Swal.fire({
          icon: "error", title: "Error!", html: e.response.data, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  };

  return (
    <>
      <h4 className="mt-5"> 
        <b>
          <Link to="/data-master/peaktime" className="btnBack">
            <ArrowLeft />
          </Link>
          {id ? "Edit" : "Create"} Peak Time
        </b>
      </h4>
      <Row>
        <Col className="col-sm-6 m-auto">
          <Card className="p-4 mt-3">
            <Form>
              <Row>
                <Col className="col-12">
                  <Form.Label>Court</Form.Label>
                  <Form.Select name="court" className="form-select form-select-sm" value={`${courtId}:${initialPrice}`} onChange={onChangeSelectCourt}>
                    <option value="">-- courts --</option>
                    {courts.map((court) => (
                      <option key={court.value} value={`${court.value}:${court.initial_price}`}>
                        {court.label}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.court_id && <span className="text-danger">{errors.court_id[0]}</span>}
                </Col>
                <Col className="col-12">
                  <Form.Label>Select day</Form.Label>
                  <Form.Select name="day_name" className="form-select form-select-sm" value={values.day_name} onChange={onChange}>
                    <option value="">-- days --</option>
                    {dayNames.map((name) => (
                      <option key={name} value={name}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.day_name && <span className="text-danger">{errors.day_name[0]}</span>}
                </Col>
                <Col className="col-12">
                  <label>Price Time</label>
                  <CurrencyInput className="form-control" prefix="Rp" name="price_increase" decimalsLimit={2} value={priceIncrease} onValueChange={(value) => setPriceIncrease(value)} />
                  
                  {initialPrice && <span className="d-block mt-2 text-success">Price { new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0}).format(initialPrice) }{}</span>}
                  {errors.price_increase && <span className="text-danger">{errors.price_increase[0]}</span>}
                </Col>
                <Col className="col-6 col-md-3">
                  <FormInput type="time" name="start" label="Start" value={values.start} onChange={onChange} />
                  {errors.start && <span className="text-danger">{errors.start[0]}</span>}
                </Col>
                <Col className="col-6 col-md-3">
                  <FormInput type="time" name="finish" label="End" value={values.finish} onChange={onChange} />
                  {errors.finish && <span className="text-danger">{errors.finish[0]}</span>}
                </Col>
                <Col className="col-12 col-sm-12 col-md-12 m-auto text-right pt-3">
                  <button onClick={handleSubmitClick} type="button" className="btn btn-sm" style={{ background: "#B21830", color: "white" }}>
                    Save
                  </button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Rush;
