import React, {useEffect, useState} from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import { EyeFill, Search } from "react-bootstrap-icons";
import FormInput from "../../Components/Form/input";
import ReactPaginate from "react-paginate";
import Moment from "react-moment";
import ModalShowDetailTransaction from "../../Components/ModalDialog/modalShowDetailTransaction";
import axios from "../../api/axios";
import Swal from "sweetalert2";

const RiwayatBooking = () => {
    const [ values, setValues ] = useState({ search: "" });
    const onChange = (e) => {
        setValues({ ...values, [ e.target.name ]: e.target.value });
    };

    const [ currentPage, setCurrentPage ] = useState(0);
    const [ pageCount, setPageCount ] = useState(0);

    const [ detailData, setDetailData ] = useState({});
    const [ showDetail, setShowDetail ] = useState(false);

    const [ rentals, setRentals ] = useState([]);
    const [ originalRentals, setOriginalRentals ] = useState([]);

    const [originalCount, setOriginalCount] = useState(0)
    const [originalCurrent, setOriginalCurrent] = useState(0)

    const handleShowDetail = ({ transaction }) => {
        setDetailData(transaction);
        setShowDetail(true);
    };

    const handleSubmitSearch = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get("/api/booking-history?keyword=" + values.search);
            setRentals(data.data);
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
            if (data.data.length < 1) {
                Swal.fire({ icon: "warning", title: "Not found!", html: `'${values.search}' in booking not found`, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false }).then((result) => {
                    if (result.isConfirmed) {
                        setRentals(originalRentals);
                        setPageCount(originalCount)
                        setCurrentPage(originalCurrent)
                    }
                });
            }
        } catch (e) {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
        }
    };

    useEffect(() => {
        axios
            .get("/api/booking-history?page=" + currentPage)
            .then(({ data }) => {
                setRentals(data.data);
                setOriginalRentals(data.data);
                setPageCount(data.meta.last_page);
                setOriginalCount(data.meta.last_page)
                setCurrentPage(data.meta.current_page);
                setOriginalCurrent(data.meta.current_page)
            })
            .catch((e) => {
                Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
            });
    }, [ currentPage ]);

    const handlePageClick = (e) => {
        const number = e.selected + 1;
        setCurrentPage(number);
    };

    const TableRows = ({ rows }) => {
        return rows.map((val, index) => {
            return (
                <tr key={val.id}>
                    <td>{index + 1}</td>
                    <td>
                        {val.court.label} ({new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val.court.initial_price)}){" "}
                    </td>
                    <td>
                        <span>
                            <Moment format="dddd, Do MMM YYYY h:mm">{val.start}</Moment>
                        </span>{" "}
                        -{" "}
                        <span>
                            <Moment format="dddd, Do MMM YYYY h:mm">{val.finish}</Moment>
                        </span>
                    </td>
                    <td className="text-center">{val.status === "B" ? "Booked" : val.status === "O" ? "On progress" : "Finished"}</td>
                    <td className="text-center">
                        <a href="#detail" onClick={() => handleShowDetail(val)}>
                            <EyeFill className="material-icons" color="dark" title="Detail" />
                        </a>
                    </td>
                </tr>
            );
        });
    };

    return (
    <>
        <Card className="p-3 mt-4">
            <Row className="">
                <Col className="col-12 col-md-4" style={{marginTop:-20}}>
                    <Form.Group className="inputSearch" >
                        <Form onSubmit={handleSubmitSearch}>
                            <FormInput type="text" name="search" value={values.search} icon={<Search/>} onChange={onChange} placeholder="Enter to search"/>
                        </Form>
                    </Form.Group>
                </Col>
                <Col className="col-12 col-md-8 pt-3">
                    <div className="float-right"><div className="bullet bullet-orange"></div> <div className="bullet-text">On Progress</div></div>
                    <div className="float-right"><div className="bullet bullet-green"></div> <div className="bullet-text">Finished</div></div>
                </Col>
            </Row>
            <div className="table-responsive">
                <table className="table table-hover mt-3" border={1}>
                    <thead>
                        <tr>
                            <th width={"1%"}>No</th>
                            <th width={"30%"}>Court</th>
                            <th width={"45%"}>Start - Finish</th>
                            <th width={"10%"} className="text-center">Status</th>
                            <th width={"4%"} className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TableRows rows={rentals} />
                    </tbody>
                </table>
                <div className="clearfix">
                        <ReactPaginate
                            className="pagination"
                            pageLinkClassName="page-link"
                            breakLabel="..."
                            nextLinkClassName="page-link next"
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLinkClassName="page-link prev"
                            previousLabel=" <"
                            renderOnZeroPageCount={null}
                        />
                </div>
            </div>
        </Card>
        <ModalShowDetailTransaction
            show={showDetail}
            handleClose={() => {
                setShowDetail(false);
                setDetailData({});
            }}
            data={detailData}
        />
    </>
    )
}

export default RiwayatBooking;