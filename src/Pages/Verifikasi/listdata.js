import React, {useState, useEffect} from "react";
import { Card } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "../../api/axios";
import { useNavigate  } from "react-router-dom";
const ListData = () => {
    const navigate = useNavigate();
    const [rentals, setRentals] = useState([]);
    const [ setOriginalRentals] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [setPageCount] = useState(0);

    const TableRowsAll = ({ rows }) => {
        return rows.map((val, index) => {
          return (
            <tr key={val.id}>
              <td>{index + 1}</td>
              <td>
                {val.transaction.booking_code}
              </td>
              <td>
                {val.customer.name} ({val.customer.phone_number})
              </td>
              <td>
                {val.court.label} ({new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val.court.initial_price)}){" "}
              </td>
              <td>
                <span>{val.start}</span> - <span>{val.finish}</span>
              </td>
              <td className="text-center">{val.status === "B" ? "Booked" : val.status === "O" ? "On progress" : "Finished"}</td>
              <td className=" d-md-flex justify-content-between">
                {val.status === "O" || val.status === "F" ? null : (
                  <button className="btn btn-sm btn-success" onClick={(e) => handleStartGame(e, val.id)}>
                    Start Game
                  </button>
                )}
                &nbsp;
                {val.status === "B" || val.status === "F" ? null : (
                  <button className="btn btn-sm btn-danger" onClick={(e) => handleFinishGame(e, val.id)}>
                    End Game
                  </button>
                )}
              </td>
            </tr>
          );
        });
    };

    const handleStartGame = async (e, id) => {
        e.preventDefault();
        try {
          await axios.get("/sanctum/csrf-cookie");
          const { data } = await axios.post(
            "/api/start-rental",
            {
              id: id,
            }
          );
          Swal.fire({
            icon: "success",
            title: "Success!",
            html: data.message,
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/schedule");
            }
          });
        } catch (e) {
          if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
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
      };

      const handleFinishGame = async (e, id) => {
        try {
          await axios.get("/sanctum/csrf-cookie");
          const { data } = await axios.post(
            "/api/finish-rental",
            {
              id: id,
            }
          );
          Swal.fire({
            icon: "success",
            title: "Success!",
            html: data.message,
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/schedule");
            }
          });
        } catch (e) {
          if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
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
      };

      useEffect(() => {
        axios
          .get("/api/rental?page=" + currentPage)
          .then(({ data }) => {
            setRentals(data.data);
            setOriginalRentals(data.data);
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
          })
          .catch((e) => {
            Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
          });
      }, [currentPage]);

    return ( 
        <>
        <Card className="p-3 mt-5" style={{ marginLeft: "-18px" }}>
            <div className="table-responsive">
              <table className="table table-hover mt-3" border={1}>
                <thead>
                  <tr>
                    <th width={"1%"}>No</th>
                    <th width={"10%"}>Booking Code</th>
                    <th width={"20%"}>Name Customer</th>
                    <th width={"10%"}>Court</th>
                    <th width={"25%"}>Start - Finish</th>
                    <th width={"10%"} className="text-center">
                      Status
                    </th>
                    <th width={"10%"} className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <TableRowsAll rows={rentals} />
                </tbody>
              </table>
            </div>
          </Card>
        </>
     );
}
 
export default ListData;