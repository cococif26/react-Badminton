import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Button  } from "react-bootstrap";
import axios from "../../../api/axios";

const ScheduleModal = ({isShow, handleClose, size="md", rentalId, swal}) => {
    const [rental, setRental] = useState({})

    useEffect(() => {
        if (rentalId > 0) {
            axios.get('/api/rental/' + rentalId)
                .then(({ data }) => {
                    setRental(data)
                })
                .catch((e) => {
                    swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
                })
        }
    }, [rentalId])
    return (
        <>
        <Modal show={isShow} onHide={handleClose} size={size}>
            <Modal.Header closeButton>
                <Modal.Title>Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col className="col-12 col-lg-4">
                        <table id="modalTable" width={'100%'}>
                            <tbody>
                                <tr>
                                    <td width={'10%'}>Customer</td>
                                    <td width={'1%'}>&nbsp;:&nbsp;</td>
                                    <td width={'89%'}>{rental.customer?.name || ''}</td>
                                </tr>
                                <tr>
                                    <td width={'10%'}>Phone&nbsp;number</td>
                                    <td width={'1%'}>&nbsp;:&nbsp;</td>
                                    <td width={'89%'}>{rental.customer?.phone_number || '0'}</td>
                                </tr>
                                <tr>
                                    <td>Member&nbsp;status</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.customer?.membership_status === 'M'?'Member':'Regular'}</td>
                                </tr>
                                <tr>
                                    <td>Booking&nbsp;at</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.created_at || ''}</td>
                                </tr>
                                <tr>
                                    <td>Input&nbsp;by</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.admin?.name || ''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col className="col-12 col-lg-4">
                        <table id="modalTable" width={'100%'}>
                            <tbody>
                                <tr>
                                    <td width={'10%'}>Court</td>
                                    <td width={'1%'}>&nbsp;:&nbsp;</td>
                                    <td width={'89%'}>{rental.court?.label || ''} ({rental.court?.initial_price ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rental.court?.initial_price) : 0})</td>
                                </tr>
                                <tr>
                                    <td>Range&nbsp;date</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.start || ''} - {rental.finish || ''} ({rental.price ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rental.price) : 0})</td>
                                </tr>
                                <tr>
                                    <td>Duration</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.duration_hour ? (rental.duration_hour > 1 ? rental.duration_hour + ' hours' : rental.duration_hour + ' hour') : 0}  ({rental.duration_minute ? (rental.duration_minute > 1 ? rental.duration_minute + ' minutes' : rental.duration_minute + ' minute') : 0})</td>
                                </tr>
                                <tr>
                                    <td>Condition</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.status === "B" ? "Up coming" : rental.status === "O" ? "On progress" : rental.status === "F" ? "Finished" : "Canceled"}</td>
                                </tr>
                                <tr>
                                    <td>Booking&nbsp;code</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.transaction?.booking_code || ''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col className="col-12 col-lg-4">
                        <table id="modalTable" width={'100%'}>
                            <tbody>
                                <tr>
                                    <td width={'10%'}>Total&nbsp;Hour</td>
                                    <td width={'1%'}>&nbsp;:&nbsp;</td>
                                    <td width={'89%'}>{rental.transaction?.total_hour ? (rental.transaction?.total_hour > 1 ? rental.transaction?.total_hour + ' hours' : rental.transaction?.total_hour + ' hour') : 0}</td>
                                </tr>
                                <tr>
                                    <td width={'10%'}>Total&nbsp;Price</td>
                                    <td width={'1%'}>&nbsp;:&nbsp;</td>
                                    <td width={'89%'}>{rental.transaction?.total_price ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rental.transaction?.total_price) : 0}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.transaction?.isPaymentDone?'Payment done':'not paid yet'}</td>
                                </tr>
                                <tr>
                                    <td>Pay</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.transaction?.customer_paid ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rental.transaction?.customer_paid) : 0}</td>
                                </tr>
                                <tr>
                                    <td>Deposit</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.transaction?.customer_deposit ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rental.transaction?.customer_deposit) : 0}</td>
                                </tr>
                                <tr>
                                    <td>Debt</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{rental.transaction?.customer_debt ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(rental.transaction?.customer_debt) : 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}> Close </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default ScheduleModal;