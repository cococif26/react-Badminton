import React, {useEffect, useState} from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import { Pencil, Trash3, Search, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import FormInput from "../../../../Components/Form/input";
import HolidaysModal from "./modal";
import FormatDate from "../../../../Components/Services/formatDate";
import ModalConfirmDelete from "../../../../Components/ModalDialog/modalConfirmDelete";
import Swal from "sweetalert2";
import axios from "../../../../api/axios";
import secureLocalStorage from "react-secure-storage";

const Holidays = () => {
    const [values, setValues] = useState({ search: "" });
    const onChange = (e) => { 
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const [holidays, setHolidays] = useState([]);
    const [originalHolidays, setOriginalHolidays] = useState([])
    
    useEffect(() => {
        axios.get('/api/holiday', {
            headers: {
                Authorization: `Bearer ${secureLocalStorage.getItem('token')}`
            }
        })
        .then(({data}) => {
            setHolidays(data);
            setOriginalHolidays(data);
        })
        .catch((e) => {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        });
    }, []);

    // let listData = [
    //     {id:1, label:"Friday", start:"2023-12-25", finish:"2023-12-25"},
    //     {id:2, label:"", start:"", finish:""},
    // ];

    const [show, setShow] = useState(false);
    const [detailData, setDetailData] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDetail = (data=[]) => {
        // console.log(data);
        setDetailData(data);
        handleShow();
    }

    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [item_id, set_item_id] = useState("");
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = (index, id) => {
        setDeleteId(index);
        set_item_id(id)
        setShowDelete(true)
    };

    const handleYes = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const { data } = await axios.delete('/api/holiday/' + item_id, {
                headers: {
                    Authorization: `Bearer ${secureLocalStorage.getItem('token')}`
                }
            });
            tableRowRemove(deleteId);
            Swal.fire({
                icon: "success", title: "Success!", html: data.message,
                showConfirmButton: false, allowOutsideClick: false,
                allowEscapeKey: false, timer: 2000
            });
            setShowDelete(false);
        } catch (e) {
            if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
                Swal.fire({
                    icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false
                });
            } else {
                Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get('/api/holiday?keyword=' + values.search,{
                headers: {
                    Authorization: `Bearer ${secureLocalStorage.getItem('token')}`
                }
            });
            setHolidays(data)
            if (data.length < 1) {
                Swal.fire({ icon: "warning", title: "Not found!", html: `'${values.search}' in holiday not found`, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false })
                .then((result) => {
                    if (result.isConfirmed) {
                        setHolidays(originalHolidays)
                    }
                })
            }
        } catch (e) {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        }
    }

    const TableRows = ({ rows }) => {
        return rows.map((val, index) => {
          return (
            <tr key={val.id}>
                <td>{index + 1}</td>
                <td>{val.label}</td>
                <td>{FormatDate(val.date)}</td>
                {/* <td>{FormatDate(val.finish)}</td> */}
                <td className="text-center">
                    <a href="#edit" className="edit" onClick={()=>handleDetail(val)}>
                        <Pencil className="material-icons ms-1" color="dark" title="Edit"/>
                    </a>
                    &nbsp;&nbsp;
                    <a href="#delete" onClick={()=>handleShowDelete(index, val.id)}>
                        <Trash3 className="material-icons" color="dark" title="Delete" />
                    </a>
                </td>
            </tr>
          )
        });
    }

    const tableRowRemove = (index) => {
        const dataRow = [...holidays];
        dataRow.splice(index, 1);
        setHolidays(dataRow);
    };
    
    return (
    <>
        <h4><b>Holidays</b></h4>
        <Row>
            <Col>
            <Card className="p-3 mt-5" style={{ marginLeft: "-18px" }}>
                <Row>
                    <Col className="col-12 col-md-6" style={{marginTop:-20}}>
                        <Form.Group className="inputSearch" >
                            <Form onSubmit={handleSearch}>
                                <FormInput type="text" name="search" value={values.search} icon={<Search/>} onChange={onChange} placeholder="Enter to search"/>
                            </Form>
                        </Form.Group>
                    </Col>
                    <Col className="col-12 col-md-6 pt-1 text-right">
                        <button className="btn btn-danger btn-sm add" onClick={()=>handleDetail()}>
                            + Add Holidays
                        </button>
                    </Col>
                </Row>
                <div className="table-responsive">
                    <table className="table table-hover mt-3" border={1}>
                        <thead>
                            <tr>
                                <th width={'1%'}>No</th>
                                <th width={'30%'}>Label</th>
                                <th width={'30%'} className="text-center">Date</th>
                                {/* <th width={'30%'} className="text-center">Finish</th> */}
                                <th width={'9%'} className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRows
                                rows={holidays}
                                // tableRowRemove={tableRowRemove}
                            />
                        </tbody>
                    </table>

                    {/* paginasi */}
                    <div className="clearfix">
                        <ul className="pagination ms-2">
                            <li className="page-item">
                                <a href="#previrius" className="page-link prev"><ChevronLeft/></a>
                            </li>
                            <li className="page-item">
                                <a href="#1" className="page-link">1</a>
                            </li>
                            <li className="page-item">
                                <a href="#2" className="page-link">2</a>
                            </li>
                            <li className="page-item">
                                <a href="#3" className="page-link">3</a>
                            </li>
                            <li className="page-item">
                                <a href="#next" className="page-link next"><ChevronRight/></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>
        <HolidaysModal 
            show={show} 
            handleClose={handleClose} 
            data={detailData}
        />
        <ModalConfirmDelete show={showDelete} handleClose={handleCloseDelete} handleYes={handleYes}/>
    </>
    )
}

export default Holidays;