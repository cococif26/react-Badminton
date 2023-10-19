import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Form, Card, Row, Col } from "react-bootstrap";
import { Pencil, Trash3, Search } from "react-bootstrap-icons";
import FormInput from "../../../../Components/Form/input";
import ModalConfirmDelete from "../../../../Components/ModalDialog/modalConfirmDelete";
import Swal from "sweetalert2";
import axios from "../../../../api/axios";
import ReactPaginate from 'react-paginate';
import { useGeneralContext } from "../../../../context/generalContext";

const UserRole = () => {
    const [show, setShow] = useState(false);
    const [spliceIndex, setSpliceIndex] = useState("");
    const [deleteId, setDeleteId] = useState("")
    const { setTriggerNotif, triggerNotif } = useGeneralContext()

    const handleShow = (id, index) => {
        setDeleteId(id)
        setSpliceIndex(index);
        setShow(true)
    };

     const [roles, setRoles] = useState([]);
     const [originalRoles, setOriginalRoles] = useState([])

    const [ currentPage, setCurrentPage ] = useState(0)
    const [ pageCount, setPageCount ] = useState(0)
    const [ originalCount, setOriginalCount ] = useState(0)
    const [ originalCurrent, setOriginalCurrent ] = useState(0)
    
    const handleSearch = async (e) => {
        e.preventDefault()
        try {
         const { data } = await axios.get('/api/role?keyword=' + values.search);
            setRoles(data.data)
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
            setTriggerNotif(!triggerNotif)
            if (data.data.length < 1) {
                Swal.fire({ icon: "warning", title: "Not found!", html: `'${values.search}' in role not found`, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false })
                .then((result) => {
                    if (result.isConfirmed) {
                        setRoles(originalRoles)
                        setPageCount(originalCount)
                        setCurrentPage(originalCurrent)
                    }
                })
            }
        } catch (e) {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        }
    }

    useEffect(() => {
        axios.get('/api/role?page=' + currentPage)
        .then(({data}) => {
            setRoles(data.data);
            setOriginalRoles(data.data)
            setPageCount(data.meta.last_page)
            setOriginalCount(data.meta.last_page)
            setCurrentPage(data.meta.current_page)
            setOriginalCurrent(data.meta.current_page)
            setTriggerNotif(!triggerNotif)
        })
        .catch((e) => {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        });
    }, [currentPage]);

    const handleSplice = () => {
        const row = [ ...roles ];
        row.splice(spliceIndex, 1);
        setRoles(row)
    };

    const handleYes = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            const { data } = await axios.delete('/api/role/' + deleteId);
            handleSplice()
            Swal.fire({
                icon: "success", title: "Success!", html: data.message,
                showConfirmButton: false, allowOutsideClick: false,
                allowEscapeKey: false, timer: 2000
            });
            setShow(false);
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

    const [values, setValues] = useState({ search: "" });
    const onChange = (e) => { 
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const TableRows = ({ rows }) => {
        return rows.map((val, index) => {
          return (
            <tr key={val.id}>
                {/* <td className="text-center">
                    <span className="custom-checkbox">
                        <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                        <label htmlFor="checkbox1"></label>
                    </span>
                </td> */}
                <td>{index + 1}</td>
                <td>{val.label}</td>
                <td className="text-center"><label className={`badge text-bg-${val.status === 'Y' ? 'green' : 'danger'} text-dark`}>{(val.status === 'Y' ? 'active' : 'in active')}</label></td>
                <td className="text-center">
                    <Link to={'/user-management/user-role/edit/'+val.id} className="edit">
                        <Pencil className="material-icons ms-1" color="dark" title="Edit"/>
                    </Link>
                    &nbsp;&nbsp;
                    <a href="#delete" onClick={()=>handleShow(val.id, index)}>
                        <Trash3 className="material-icons" color="dark" title="Delete" />
                    </a>
                </td>
            </tr>
          )
        });
    }

    const handlePageClick = (e) => {
        const number = e.selected + 1
        setCurrentPage(number)
    }

    return (
    <>
        <h4 className="mt-5"><b>User Role</b></h4>
        <Row>
            <Col>
            <Card className="p-3 mt-3" style={{ marginLeft: "-18px" }}>
                <Row>
                    <Col className="col-12 col-md-4" style={{marginTop:-20}} >
                        <Form.Group className="inputSearch">
                            <Form onSubmit={handleSearch}>
                                <FormInput type="text" name="search" value={values.search} icon={<Search/>} onChange={onChange} placeholder="Enter to search"/>
                            </Form>
                        </Form.Group>
                    </Col>
                    <Col className="col-12 col-md-8 pt-1">
                        <Link to={'/user-management/user-role/add'} className="btn btn-sm add" style={{ background: "#B21830", color: "white" }}>
                            Add Role
                        </Link>
                    </Col>
                    {/* <Col className="col-12 col-md-12 mt-2">
                        <div className="float-right"><div className="bullet bullet-red"></div> <div className="bullet-text">In Active</div></div>
                        <div className="float-right"><div className="bullet bullet-cyan"></div> <div className="bullet-text">Active</div></div>
                    </Col> */}
                </Row>
                <div className="table-responsive">
                    <table className="table table-hover mt-4" border={1}>
                        <thead>
                            <tr>
                                <th width={'1%'}>No</th>
                                <th width={'80%'}>Rolename</th>
                                <th width={'10%'} className="text-center">Status</th>
                                <th width={'9%'} className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRows
                                rows={roles}
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
            </Col>
        </Row>
        <ModalConfirmDelete show={show} handleClose={() => setShow(!show)} handleYes={handleYes}/>
    </>
    )
}

export default UserRole;