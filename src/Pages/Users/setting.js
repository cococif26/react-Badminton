import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Form, Card, Row, Col } from "react-bootstrap";
import { Trash3 } from "react-bootstrap-icons";
import FormInput from "../../Components/Form/input";
import FormTextarea from "../../Components/Form/textarea";
import FormSelect from "../../Components/Form/select";
import { dayData } from "../../Components/settingData";
import axios from "../../api/axios";
import Swal from "sweetalert2";
import { useGeneralContext } from "../../context/generalContext";

const Setting = () => {
  const [values, setValues] = useState({ name:"", phone_number:"", email:"", address:"", otp_expiration: 0, member_discount: 0, resend_limit: 0 });
  const [rows, initRow] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false)
  const {handleSetGorName, handleSetContact} = useGeneralContext()
  const [errors, setErrors] = useState([])

  useEffect(() => {
    axios.get('/api/get-config')
      .then(({data}) => {
        const contactParsed = JSON.parse(data.contact)
        setValues({name: data.name, 
          phone_number: contactParsed.number, 
          email: contactParsed.email, 
          address: contactParsed.address, 
          otp_expiration: data.expire_duration,
          member_discount: data.member_discount,
          resend_limit: data.resend_limit
        })
        initRow(JSON.parse(data.open_time))
        handleSetGorName(data.name)
        handleSetContact(contactParsed)
      })
      .catch((e) => {
        if (e.response?.status === 404 || e.response?.status === 403 || e?.response?.status === 401) {
          Swal.fire({
            icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false
          });
        } else {
          Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        }
      })
  }, [triggerFetch]);


  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  function validateSchedule(schedule) {
    const validDays = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ];
    const errors = [];

    schedule.forEach((item) => {
      const { day, start, finish } = item;

      if (!values.name || !values.phone_number || !values.email || !values.address || !values.otp_expiration || !values.member_discount || !values.resend_limit || schedule.length <= 0) {
        errors.push('38569de2-6078-11ee-8c99-0242ac120002'); // Company data is incomplete.
      }

      if (!day || !validDays.includes(day.toLowerCase())) {
        errors.push('3fc8d328-6079-11ee-8c99-0242ac120002'); // Invalid day
      }

      if (!start || !finish) {
        errors.push('7a789d1e-6079-11ee-8c99-0242ac120002'); // Start and finish times are required
      } else {
        const minDuration = 60;
        const multipleOf = 30;
        const startTime = new Date(`2000-01-01T${start}`);
        const finishTime = new Date(`2000-01-01T${finish}`);

        if (startTime >= finishTime) {
          errors.push('93a80a18-6079-11ee-8c99-0242ac120002'); // Finish time must be after start time
        }

        if (start === finish) {
          errors.push('ae004b00-6079-11ee-8c99-0242ac120002'); // Start and finish times cannot be the same
        }

        if ((finishTime - startTime) / (1000 * 60) < minDuration) {
          errors.push('faeac55a-68ab-11ee-8c99-0242ac120002'); // Start and Finish must be more than 1 hour
        }

        const minutesDiff = (finishTime - startTime) / (1000 * 60);
        if (minutesDiff % multipleOf !== 0 || startTime.getMinutes() % multipleOf !== 0 || finishTime.getMinutes() % multipleOf !== 0) {
          errors.push('2421810c-68ac-11ee-8c99-0242ac120002'); // Start and Finish must be multiplied by 30 minutes
        }
      }
    });

    return errors;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const data = {
      invalid_input: '',
      configs: [
        {
          slug: 'open_time',
          description: 'Jam buka kami atau operational time adalah waktu kami untuk menerima pesanan booking selain dari waktu ini kami tidak menerima pesanan tersebut.',
          value: JSON.stringify(rows)
        },
        {
          slug: 'name',
          description: 'Nama perusahaan kami akan ditampilkan pada navbar dan tempat informasi yang lainnya.',
          value: values.name
        },
        {
          slug: 'contact',
          description: 'Berisikan nomor Whatsapp, Email, dan Alamat yang sedia untuk dihubungi.',
          value: JSON.stringify({
              number: values.phone_number,
              email: values.email,
              address: values.address
          })
        },
        {
          slug: 'expire_duration',
          description: 'Expire duration OTP code in minutes after request it. (in minutes)',
          value: values.otp_expiration
        },
        {
          slug: 'member_discount',
          description: 'Potongan harga untuk booking member / multiple booking. (in percent)',
          value: values.member_discount
        },
        {
          slug: 'resend_limit',
          description: 'Batasan ketika melakukan kirim ulang OTP code ke nomor pelanggan.',
          value: values.resend_limit
        }
      ]
    }

    const scheduleErrors = validateSchedule(rows);
    if (scheduleErrors.length > 0) {
      data.invalid_input = scheduleErrors[0]
    }else{
      data.invalid_input = '';
      setErrors([])
    }
    try {
      await axios.get('/sanctum/csrf-cookie')
      const response = await axios.post('/api/change-config', data)
      Swal.fire({ icon: "success", title: "Success!", html: response.data.message, showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
      setTimeout(() => { setTriggerFetch(!triggerFetch) }, 2000);
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

  const TableRows = ({ rows, onRemove, onUpdate }) => {
    return rows.map((row, index) => {
        const { day, start, finish } = row;
        return (
            <tr key={index}>
                <td>
                  <FormSelect
                    name="day"
                    className="form-select form-select-sm"
                    options={dayData}
                    selected={day}
                    onChange={(e) => onUpdate(index, e.target.name, e.target.value)}
                  />
                </td>
                <td>
                  <FormInput type="time" name="start" value={start} onChange={(e) => onUpdate(index, "start", e.target.value)} />
                </td>
                <td>
                  <FormInput type="time" name="finish" value={finish} onChange={(e) => onUpdate(index, "finish", e.target.value)} />
                </td>
                <td className="text-center">
                    <a href="#delete" onClick={() => onRemove(index)}>
                        <Trash3 className="material-icons" color="dark" title="Delete" />
                    </a>
                </td>
            </tr>
        );
    });
  };
  
  const dataDefault = { day:"", start: "", finish: "" };
  const addRowTable = () => {
      initRow([...rows, dataDefault]);
  };
  const removeRow = (index) => {
    const dataRow = [...rows];
    dataRow.splice(index, 1);
    initRow(dataRow);
  };
  const updateRow = (index, name, value) => {
    const updatedRow = [...rows];
    updatedRow[index][name] = value;
    initRow(updatedRow);
  }

  return (
    <>
      <h4 className="mb-2 mt-5">
        <b>Setting</b>
      </h4>
      <Row>
      <Form onSubmit={handleSubmit}>
        <Col className="col-12 col-sm-10 col-md-10 m-auto">
          <Card className="p-3 mt-2">
            <Container>
              <Row className="px-2 my-1">
                <Col>
                  <Col className="col-12 col-sm-8 col-md-12 m-auto">
                    <Form.Group>
                      <label style={{ fontSize: "18px" }}>Name</label>
                      <FormInput type="text" name="name" value={values.name} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col className="col-12 col-sm-8 col-md-12 m-auto">
                    <Form.Group>
                      <label style={{ fontSize: "18px" }}>Number WhatsApp</label>
                      <FormInput type="text" name="phone_number" value={values.phone_number} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col className="col-12 col-sm-8 col-md-12 m-auto mt-2">
                    <Form.Group>
                      <label style={{ fontSize: "18px" }}>Email</label>
                      <FormInput type="text" name="email" value={values.email} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col className="col-12 col-sm-8 col-md-12 m-auto mt-2">
                    <Form.Group>
                      <label style={{ fontSize: "18px" }}>Address</label>
                      <FormTextarea name="address" value={values.address} onChange={onChange} style={{ height: "65px" }} />
                    </Form.Group>
                  </Col>
                  <Col className="col-12 col-sm-8 col-md-12 m-auto">
                    <Form.Group>
                      <label style={{ fontSize: "18px" }}>OTP code Expiration (in minutes)</label>
                      <FormInput type="number" name="otp_expiration" value={values.otp_expiration} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col className="col-12 col-sm-8 col-md-12 m-auto">
                    <Form.Group>
                      <label style={{ fontSize: "18px" }}>Member discount (in percent)</label>
                      <FormInput type="number" name="member_discount" value={values.member_discount} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <Col className="col-12 col-sm-8 col-md-12 m-auto">
                    <Form.Group>
                      <label style={{ fontSize: "18px" }}>Resend limit</label>
                      <FormInput type="number" name="resend_limit" value={values.resend_limit} onChange={onChange} />
                    </Form.Group>
                  </Col>
                  <div className="table-responsive">
                    <table className="table table-hover mt-3" border={1}>
                        <thead>
                            <tr>
                                <th width={'45%'}>Open Days</th>
                                <th width={'25%'}>Start</th>
                                <th width={'25%'}>Finish</th>
                                <th width={'5%'}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRows
                                rows={rows}
                                onRemove={removeRow}
                                onUpdate={updateRow}
                            />
                        </tbody>
                    </table>
                </div>
                {errors.invalid_input &&
                    <span className="text-danger">{errors.invalid_input[ 0 ]}</span>}
                <center>
                    <button type="button" className="btn btn-sm" onClick={addRowTable} style={{ background: "#B21830", color: "white" }}>
                        Add
                    </button>
                </center>
                  <Col className="col-12 text-right mt-4">
                    <button type="submit" className="btn btn-sm me-md-6" style={{ background: "#B21830", color: "white" }}>
                      Save
                    </button>
                  </Col>
                </Col>
              </Row>
            </Container>
          </Card>
        </Col>
        </Form>
      </Row>
    </>
  );
};

export default Setting;
