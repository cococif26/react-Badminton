import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import { Search, EyeFill } from "react-bootstrap-icons";
import FormInput from "../../Components/Form/input";
// import ModalConfirmDelete from "../../Components/ModalDialog/modalConfirmDelete";
import Swal from "sweetalert2";
import axios from "../../api/axios";
import ReactPaginate from "react-paginate";
import ModalShowDetailTransaction from "../../Components/ModalDialog/modalShowDetailTransaction";
import Moment from "react-moment";
import { useGeneralContext } from "../../context/generalContext";

const HistoryBooking = () => {
  // const [show, setShow] = useState(false);
  // const [deleteId, setDeleteId] = useState("");
  // const [item_id, set_item_id] = useState("");

  const { setTriggerNotif, triggerNotif } = useGeneralContext()

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [detailData, setDetailData] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  const handleShowDetail = ({ transaction }) => {
    setDetailData(transaction);
    setShowDetail(true);
  };

  // const handleShow = (index, id) => {
  //   set_item_id(id);
  //   setDeleteId(index);
  //   setShow(true);
  // };

  const [rentals, setRentals] = useState([]);
  const [originalRentals, setOriginalRentals] = useState([]);

  const [ originalCount, setOriginalCount ] = useState(0)
  const [ originalCurrent, setOriginalCurrent ] = useState(0)

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
        setTriggerNotif(!triggerNotif)
      })
      .catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      });
  }, [currentPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("/api/booking-history?keyword=" + values.search);
      setRentals(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
      setTriggerNotif(!triggerNotif)
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

  // const handleYes = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.get("/sanctum/csrf-cookie");
  //     const { data } = await axios.delete("/api/booking-history/" + item_id);
  //     tableRowRemove(deleteId);
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success!",
  //       html: data.message,
  //       showConfirmButton: false,
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       timer: 2000,
  //     });
  //     setShow(false);
  //   } catch {
  //     if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error!",
  //         html: e.response.data.message,
  //         showConfirmButton: true,
  //         allowOutsideClick: false,
  //         allowEscapeKey: false,
  //       });
  //     } else {
  //       Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
  //     }
  //   }
  // };

  const [values, setValues] = useState({ search: "" });
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // let listData = [
  //     {name:"Hodijah", court:"Court A", schedule:"10.00-11.00", totally_hour:"1 hour", totally_price:"Rp 50,000", status:"Finished", status_color:"green"},
  //     {name:"Siti", court:"Court C", schedule:"10.00-11.00", totally_hour:"1 hour", totally_price:"Rp 50,000", status:"on progress", status_color:"orange"},
  // ];

  const TableRows = ({ rows }) => {
    return rows.map((val, index) => {
      return (
        <tr key={val.id}>
          <td>{index + 1}</td>
          <td>
            {val.customer.name} ({val.customer.phone_number})
          </td>
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
          <td className="text-center">{val.status === "B" ? "Booked" : val.status === "O" ? "On progress" : val.status === "F" ? "Finished" : "Canceled"}</td>
          <td className="text-center">
            &nbsp;&nbsp;
            <a href="#detail" onClick={() => handleShowDetail(val)}>
              <EyeFill className="material-icons" color="dark" title="Detail" />
            </a>
          </td>
        </tr>
      );
    });
  };

  // const tableRowRemove = (index) => {
  //   const dataRow = [...rentals];
  //   dataRow.splice(index, 1);
  //   setRentals(dataRow);
  // };

  const handlePageClick = (e) => {
    const number = e.selected + 1;
    setCurrentPage(number);
  };

  return (
    <>
      <h4 className="mt-5">
        <b>History Booking</b>
      </h4>
      <Card className="p-3 mt-3" style={{ marginLeft: "-18px" }}>
        <Row className="">
          <Col className="col-12 col-md-4" style={{ marginTop: -20 }}>
            <Form.Group className="inputSearch">
              <Form onSubmit={handleSearch}>
                <FormInput type="text" name="search" value={values.search} icon={<Search />} onChange={onChange} placeholder="Enter to search" />
              </Form>
            </Form.Group>
          </Col>
        </Row>
        <div className="table-responsive">
          <table className="table table-hover mt-3" border={1}>
            <thead>
              <tr>
                <th width={"1%"}>No</th>
                <th width={"20%"}>Name Customer</th>
                <th width={"20%"}>Court</th>
                <th width={"39%"}>Start - Finish</th>
                <th width={"10%"} className="text-center">
                  Status
                </th>
                <th width={"4%"} className="text-center">
                  Action
                </th>
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
            nextLabel=" >" 
            onPageChange={handlePageClick} 
            pageRangeDisplayed={5} 
            pageCount={pageCount} 
            previousLinkClassName="page-link prev"
            previousLabel="< " 
            renderOnZeroPageCount={null} />
          </div>
        </div>
      </Card>
      {/* <ModalConfirmDelete show={show} handleClose={() => setShow(false)} handleYes={handleYes} /> */}
      <ModalShowDetailTransaction
        show={showDetail}
        handleClose={() => {
          setShowDetail(false);
          setDetailData({});
        }}
        data={detailData}
      />
    </>
  );
};

export default HistoryBooking;
