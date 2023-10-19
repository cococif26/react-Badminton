import React from "react";
import "./landing2.css";
import RiwayatBooking from "./RiwayatBooking";
import FooterPublic from "../../Components/FooterPublic";
import NavbarUser from "../../Components/NavbarUser";
import Schedule from "../Users/Schedule/schedule";

const Landing2 = () => {
  // let dataCourt = [
  //   // {time:'08.00-09.00', court1_1:'', court1_2:'cyan', court2_1:'', court2_2:'', court3_1:'', court3_2:'', court4_1:'', court4_2:'',
  //   {
  //     time: "08.00-09.00",
  //     court1: [
  //       { court: "1", color: "", name: "" },
  //       { court: "1", color: "cyan", name: "A" },
  //     ],
  //   },
  //   {
  //     time: "09.00-10.00",
  //     court1: [
  //       { court: "1", color: "orange", name: "B" },
  //       { court: "1", color: "orange", name: "B" },
  //     ],
  //   },
  //   {
  //     time: "",
  //     court1: [
  //       { court: "", color: "", name: "" },
  //       { court: "", color: "", name: "" },
  //     ],
  //   },
  //   {
  //     time: "",
  //     court1: [
  //       { court: "", color: "", name: "" },
  //       { court: "", color: "", name: "" },
  //     ],
  //   },
  //   {
  //     time: "",
  //     court1: [
  //       { court: "", color: "", name: "" },
  //       { court: "", color: "", name: "" },
  //     ],
  //   },
  //   {
  //     time: "",
  //     court1: [
  //       { court: "", color: "", name: "" },
  //       { court: "", color: "", name: "" },
  //     ],
  //   },
  // ];

  return (
    <>
      <NavbarUser/>
      <div className="container mt-2">
        <div className="table-responsive" id="schedule">
          <h3 className="text-left mt-5">Schedule</h3>
          <hr style={{ width: 130, float:'left', marginTop: 0 }} />
        </div>
        <Schedule currentPath="customer-dashboard"/>
      </div>

      {/* riwayat booking */}
        <div className="container">
          <div className="table-responsive" id="bookinghistory">
            <h3 className="text-left mt-4">History Booking</h3>
            <hr style={{ width: 220, float: "left", marginTop:-5 }}/>
            <RiwayatBooking/>
          </div>
        </div>
        
        {/* <ModalConfirmDelete show={show} handleClose={handleClose} handleYes={handleYes}/> */}
      <FooterPublic/>
    </>
  );
};

export default Landing2;
