import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../api/axios";
import Swal from "sweetalert2";
import Loader from "../../../Components/Loader/Loading";

const Profile = () => {
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    axios
      .get("/api/me-admin")
      .then(({ data }) => {
        setAdmin(data);
      })
      .catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      });
  }, []);

  const TableRows = ({ rows }) => {
    return rows.map((val, index) => {
      return (
        <tr key={val.id}>
          <td>{index + 1}</td>
          <td>{val.start}</td>
          <td>{val.finish}</td>
          <td>{val.status}</td>
          <td>Rp. {val.price}</td>
          <td>
            {val.customer.name} ({val.customer.phone_number})
          </td>
          <td>
            {val.court.label} ({val.court.initial_price})
          </td>
          <td>{val.created_at}</td>
        </tr>
      );
    });
  };

  return admin && admin.role && admin.rentals ? (
    <>
      <div className="py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card card-profile text-center p-5">
              <div className="card-body">
                <img src="./assets/icon/owl.png" alt="user" className="img img-thumbnail rounded-circle w-50" />
                <h2>{admin.name}</h2>
                <Link to={"/formprofile/edit"} className="btn btn-sm add" style={{ background: "#B21830", color: "white" }}>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

      
          <div className="col-lg-7">
            <div className="row">
              <div className="shadow border rounder p-5 mb-1 bg-white">
                <h2 className="fw-bold">Details</h2>
                <span className="mt-3">Full Name</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{admin.name}
                <br />
                <span className="mt-3">Username</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{admin.username}
                <br />
                <span className="mt-3">Phone number</span> &nbsp;&nbsp;:&nbsp;{admin.phone_number}
                <br />
                <span className="mt-3">Status</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{admin.status === "Y" ? "active" : "in active"}
                <br />
                <span className="mt-3">Role:</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{admin.role?.label}
                <br />
              </div>
            </div>
          </div>
       
          <div className="card card-profile-details mt-3" style={{ marginLeft: "-6px" }}>
          <div className="row">
            <div className="table-responsive">
              <table className="table table-hover mt-4" border={1}>
                <thead>
                  <tr>
                    <th width={"1%"}>No</th>
                    <th width={"20%"}>Start</th>
                    <th width={"20%"}>Finish</th>
                    <th width={"10%"}>Status</th>
                    <th width={"10%"}>Price</th>
                    <th width={"15%"}>Customer</th>
                    <th width={"15%"}>Court</th>
                    <th width={"15%"}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRows rows={admin.rentals} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default Profile;
