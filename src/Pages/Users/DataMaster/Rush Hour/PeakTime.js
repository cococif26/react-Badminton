import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Form, Card, Row, Col } from "react-bootstrap";
import { Pencil, Trash3, Search} from "react-bootstrap-icons";
import FormInput from "../../../../Components/Form/input";
import ModalConfirmDelete from "../../../../Components/ModalDialog/modalConfirmDelete";
import Swal from "sweetalert2";
import axios from "../../../../api/axios";
import ReactPaginate from 'react-paginate';
import { useGeneralContext } from "../../../../context/generalContext";

const PeakTime = () => {
    const { setTriggerNotif, triggerNotif } = useGeneralContext()
    const [show, setShow] = useState(false);
    const [peaktimeCode, setPeaktimeCode] = useState('')
    const [deleteId, setDeleteId] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = (index, code) => {
        setPeaktimeCode(code)
        setDeleteId(index);
        setShow(true)
    };

    const [ currentPage, setCurrentPage ] = useState(0)
    const [ pageCount, setPageCount ] = useState(0)
    const [ originalCount, setOriginalCount ] = useState(0)
    const [ originalCurrent, setOriginalCurrent ] = useState(0)

    const handleYes = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie')
            const { data } = await axios.delete('/api/peak-time/' + peaktimeCode)
            tableRowRemove(deleteId);
            Swal.fire({icon:"success", title:"Success!", html: data.message,
            showConfirmButton: false, allowOutsideClick: false,
            allowEscapeKey:false, timer: 2000});
            setShow(false);
        } catch(e) {
            if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
                Swal.fire({
                    icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false
                });
            } else {
                Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
            }
        }
    };

    const [peakTimes, setPeakTimes] = useState([])
    const [original, setOriginal] = useState([])

    useEffect(() => {
        axios.get('/api/peak-time?page=' + currentPage).then(({ data }) => {
            setPeakTimes(data.data)
            setOriginal(data.data)
            setPageCount(data.meta.last_page)
            setOriginalCount(data.meta.last_page)
            setCurrentPage(data.meta.current_page)
            setOriginalCurrent(data.meta.current_page)
            setTriggerNotif(!triggerNotif)
        }).catch((e) => {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        })
    }, [currentPage])

    const [values, setValues] = useState({ search: "" });
    const onChange = (e) => { 
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get('/api/peak-time?keyword=' + values.search);
            setPeakTimes(data.data)
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
            setTriggerNotif(!triggerNotif)
            if (data.data.length < 1) {
                Swal.fire({ icon: "warning", title: "Not found!", html: `'${values.search}' in peak time not found`, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false })
                .then((result) => {
                    if (result.isConfirmed) {
                        setPeakTimes(original)
                        setPageCount(originalCount)
                        setCurrentPage(originalCurrent)
                    }
                })
            }
        } catch (e) {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        }
    }

    const handlePageClick = (e) => {
        const number = e.selected + 1
        setCurrentPage(number)
    }

    const TableRows = ({ rows }) => {
        return rows.map((val, index) => {
          return (
            <tr key={val.id}>
                <td>{index + 1}</td>
                <td>{val.day_name}</td>
                <td>{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0}).format(val.price_increase) }</td>
                <td>{val.court.label} ({new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0}).format(val.court.initial_price)})</td>
                <td>{val.start}</td>
                <td>{val.finish}</td>
                <td className="text-center">
                    <Link to={'/data-master/rush/edit/'+val.id} className="edit">
                        <Pencil className="material-icons ms-1" color="dark" title="Edit"/>
                    </Link>
                    &nbsp;&nbsp;
                    <a href="#delete" onClick={()=>handleShow(index, val.id)}>
                        <Trash3 className="material-icons" color="dark" title="Delete" />
                    </a>
                </td>
            </tr>
          )
        });
    }

    const tableRowRemove = (index) => {
        const dataRow = [...peakTimes];
        dataRow.splice(index, 1);
        setPeakTimes(dataRow)
    };

    return (
    <>
        <h4 className="mt-5"><b>Peak Time</b></h4>
        <Card className="p-3 mt-3" style={{ marginLeft: "-18px" }}>
            <Row>
                <Col className="col-12 col-md-4" style={{marginTop:-20}} >
                    <Form.Group className="inputSearch">
                        <Form onSubmit={handleSearch}>
                            <FormInput type="text" name="search" value={values.search} icon={<Search/>} onChange={onChange} placeholder="Enter to search"/>
                        </Form>
                    </Form.Group>
                </Col>
                <Col className="col-12 col-md-6 pt-1">
                    <Link to={'/data-master/rush/add'} className="btn btn-sm add" style={{ background: "#B21830", color: "white" }}>
                        Add Peak Time
                    </Link>
                </Col>
            </Row>
            <div className="table-responsive">
                <table className="table table-hover mt-4" border={1}>
                    <thead>
                        <tr>
                            <th width={'1%'}>No</th>
                            <th width={'15%'}>Day name</th>
                            <th width={'20%'}>Peak Time Price</th>
                            <th width={'25%'}>Court</th>
                            <th width={'15%'}>Start</th>
                            <th width={'15%'}>Finish</th>
                            <th width={'4%'} className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TableRows
                            rows={peakTimes}
                        />
                    </tbody>
                </table>
                <div className="clearfix">
                        <ReactPaginate
                            className="pagination"
                            pageLinkClassName="page-link"
                            breakLabel="..."
                            nextLinkClassName="page-link next"
                            nextLabel=" >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLinkClassName="page-link prev"
                            previousLabel="< "
                            renderOnZeroPageCount={null}
                        />
                </div>
            </div>
        </Card>
        <ModalConfirmDelete show={show} handleClose={handleClose} handleYes={handleYes}/>
    </>
    )
}

export default PeakTime;