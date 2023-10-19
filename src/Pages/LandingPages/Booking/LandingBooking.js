// import React, {useState} from "react";
// import "../landing2.css";
// import NavbarUser from "../../../Components/NavbarUser";
// import FooterPublic from "../../../Components/FooterPublic";
// import CreateBookingFormRegular from "./Regular";
// import CreateBookingFormMember from "./Member";

// const LandingBookUser = () => {

//   const [checkedRegular, setCheckedRegular] = useState(true);
//     const [checkedMember, setCheckedMember] = useState(false);

//     const handleRadioBtn = (aksi='') => {
//         // console.log(aksi);
//         if (aksi==='member') {
//             setCheckedRegular(false);
//             setCheckedMember(true);
//         }else{
//             setCheckedRegular(true);
//             setCheckedMember(false);
//         }
//     }


//   return (
//     <>
//       <NavbarUser/>
//       <div className="container mt-5">
//         <div className="table-responsive" id="schedule">
//           <h3 className="text-left mt-3">Add Booking</h3>
//           <hr style={{ width: 200, float:'left', marginTop: 0 }} />
//         </div>
//         <br/>
//         <div className="d-flex mt-2">
//           <div className="form-check">
//             <input id="regId" type="radio" className="form-check-input" value="regular" defaultChecked={checkedRegular} onClick={() => handleRadioBtn("regular")} />
//             <label htmlFor="regId">Regular</label>
//           </div>
//           &nbsp;&nbsp;&nbsp;
//           <div className="form-check form-check-inline">
//             <input id="memId" type="radio" className="form-check-input" value="member" defaultChecked={checkedMember} onClick={() => handleRadioBtn("member")} />
//             <label htmlFor="memId">Member</label>
//           </div>
//         </div>
//         {
//             checkedRegular ? <CreateBookingFormRegular/>:<CreateBookingFormMember/>
//         }
//       </div>
//       <FooterPublic/>
//     </>
//   );
// };

// export default LandingBookUser;
