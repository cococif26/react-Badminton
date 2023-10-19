import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col  } from "react-bootstrap";
import FormInput from "../../../../Components/Form/input";
import axios from "../../../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const HolidaysModal = ({show="", handleClose, size="md", data=[]}) => {

    const navigate = useNavigate();
    const [values, setValues] = useState({ label:"", date:"" });
    const [errors, setErrors] = useState([])
    const onChange = (e) => { 
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    useEffect(()=>{
        setValues({ label:data.label?data.label:"", date:data.date?data.date:"" });
    }, [setValues, data]);

    const handleClickSubmit = async (e) => {
        e.preventDefault()
        const dataToReq = {
            label: values.label,
            date: values.date
        }
        const config = {
            headers: {
                Authorization: `Bearer ${secureLocalStorage.getItem('token')}`
            }
        }
        try {
            await axios.get('/sanctum/csrf-cookie')
            let response
            if (data.id > 0) {
                response = await axios.put('/api/holiday/' + data.id, dataToReq, config)
            } else {
                response = await axios.post('/api/holiday', dataToReq, config);
            }
            setErrors('');
            Swal.fire({ icon: "success", title: "Success!", html: response.data.message, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
            setTimeout(function () { navigate('/data-master/holidays', { replace: true }) }, 2000);
        } catch (e) {
            if (e?.response?.status === 422) {
                setErrors(e.response.data.errors)
            } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
                Swal.fire({
                    icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false
                });
            } else {
                Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
            }
        }
    }

    return (
        <>
        <Modal show={show} onHide={handleClose} size={size}>
            <Modal.Header closeButton>
                <Modal.Title>{ data.length!==0 ? "Edit":"Create" } Holidays</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <FormInput type="text" name="label" label="Label" value={values.label} onChange={onChange}/>
                        {errors.label &&
                            <span className="text-danger">{errors.label[ 0 ]}</span>}
                    </Form.Group>
                    <Row>
                        <Col className="col-12 col-md-12">
                            <Form.Group>
                            <FormInput type="date" name="date" label="Date" value={values.date} onChange={onChange}/>
                            {errors.date &&
                            <span className="text-danger">{errors.date[ 0 ]}</span>}
                            </Form.Group>
                        </Col>
                        {/* <Col className="col-12 col-md-6">
                            <Form.Group>
                                <FormInput type="date" name="finish" label="finish" value={values.finish} onChange={onChange}/>
                                {errors.finish &&
                                    <span className="text-danger">{errors.finish[ 0 ]}</span>}
                            </Form.Group>
                        </Col> */}
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}> Close </Button>
                <Button onClick={handleClickSubmit} variant="danger"> Save </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default HolidaysModal;