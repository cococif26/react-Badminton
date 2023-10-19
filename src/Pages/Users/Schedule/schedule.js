import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import axios from "../../../api/axios"
import { MultiSelect } from "react-multi-select-component";
import Swal from "sweetalert2";
import ScheduleModal from "./modal";
import { Link } from "react-router-dom";

const Schedule = ({ currentPath = 'schedule' }) => {
  const [ courts, setCourts ] = useState([])
  const [ hours, setHours ] = useState([])
  const [ isShow, setIsShow ] = useState(false)
  const [ rentalId, setRentalId ] = useState(0)

  const [ selectedCourts, setSelectedCourts ] = useState([]);
  const [ selectedStatuses, setSelectedStatuses ] = useState([]);
  const [ selectedDate, setSelectedDate ] = useState('')

  const [ rentals, setRentals ] = useState([]);

  const [ selectCourts, setSelectCourts ] = useState([])

  const [filterClicked, setFilterClicked] = useState(false)

  useEffect(() => {
    axios.get('/api/schedule')
      .then(({ data }) => {
        setHours(data.hours)
        setCourts(data.courts)
        setRentals(data.rentals)
      }).catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      })
  }, [])

  useEffect(() => {
    axios.get('/api/court-select')
      .then(({ data }) => {
        setSelectCourts(data)
      }).catch((e) => {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false })
      })
  }, [filterClicked])

  const handleFilter = async (e) => {
    e.preventDefault()
    const url = `/api/schedule?date=${selectedDate}&statuses=${selectedStatuses.map(s => s.label.charAt(0)).join(',')}&courts=${selectedCourts.map(c => c.value).join(',')}`
    try {
      const {data} = await axios.get(url)
      setHours(data.hours)
      setCourts(data.courts)
      setRentals(data.rentals)
      setFilterClicked(!filterClicked)
      if (data.alert) {
        Swal.fire({ position: 'top-end', icon: 'warning', html: data.alert.message, showConfirmButton: false, width: 350, heightAuto: true, timer: 2000})
      }
    } catch (e) {
      if (e.response?.status === 404 || e.response?.status === 403 || e?.response?.status === 401) {
        Swal.fire({
          icon: "error", title: "Error!", html: e.response.data.message, showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false
        });
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  }

  const checkBgColor = (id) => {
    const result = rentals.find(item => item.court_id === id)
    const color = {
      C: "bg-col-red", F: "bg-col-green", B: "bg-col-cyan", O: "bg-col-orange"
    }
    if (result) {
      return color[ result.status ]
    }
  }

  const showDetail = (id) => {
    if (currentPath === 'dashboard' || currentPath === 'schedule') {
      const rental = rentals.find(item => item.court_id === id)
      if (rental) {
        setRentalId(rental.rental_id)
        setIsShow(true)
      }
    }
  }

  return (
    <>
      {currentPath === 'schedule' && <>
        <h4 className="mb-4 mt-5">
          <b>Schedule</b>
        </h4>
        <Card className="p-3 mt-3 mb-4 " style={{ marginLeft: "-18px" }}>
          <Row className="d-flex justify-content-center">
              <Col className="col-12 col-md-2">
                Date:
                <input required className="form-control form-control-sm" type="date" style={{ width: 159, height: 40 }} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </Col>
              <Col className="col-12 col-md-2">
                Court:
                <MultiSelect required options={selectCourts} value={selectedCourts} onChange={setSelectedCourts} labelledBy="Select" style={{ width: 116 }} />
              </Col>
              <Col className="col-12 col-md-2">
                Condition:
                <MultiSelect required options={[ { value: "1", label: "Booked" }, { value: "2", label: "On Progress" }, { value: "3", label: "Finished" } ]} value={selectedStatuses} onChange={setSelectedStatuses} labelledBy="Select" />
              </Col>
              <Col className="col-12 col-md-2 mt-4">
                <Button className="btn" onClick={handleFilter} style={{ background: "#7F1122 " }}>
                  Search
                </Button>
              </Col>
          </Row>
        </Card>
      </>}
      <Row>
        <Col className="col-12 col-md-6 d-flex mb-4">
          <div>
            <div className="bullet bullet-cyan"></div> <div className="bullet-text">Up coming</div>
          </div>
          <div>
            <div className="bullet bullet-green"></div> <div className="bullet-text">Finished</div>
          </div>
          <div>
            <div className="bullet bullet-orange"></div> <div className="bullet-text">On progress</div>
          </div>
        </Col>
        <Col className="col-12 mt-1 mb-2 " style={{ textAlign: "right", marginLeft: "-16px" }}>
          {(currentPath === 'dashboard' || currentPath === 'schedule') && 
            <Link to="/create-booking" className="btn btn-sm" style={{ background: "#B21830", color: "white" }}>
              New Booking
            </Link>}
        </Col>
      </Row>
      <div className="table-responsive">
        <table id="schedule" className="table" width={"100%"} style={{ marginLeft: "-16px" }}>
          <thead>
            <tr>
              <th className="text-center">Time</th>
              {courts.map(court => {
                return <React.Fragment key={court.id}>
                  <th key={court.id} className="text-center" colSpan={2}>
                    {court.label}
                  </th>
                  <th></th>
                </React.Fragment>
              })}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour, key) => {
              const now = new Date()
              const start = new Date()
              const finish = new Date()
              start.setHours(hour.start.split(':')[0]);
              start.setMinutes(hour.start.split(':')[1]);
              finish.setHours(hour.finish.split(':')[0]);
              finish.setMinutes(hour.finish.split(':')[1]);

              return (
                <tr key={key} className={now >= start && now <= finish ? "table-secondary border" : ''}>
                  <th width={"10%"} className="text-center" style={{ minWidth: 146 }}>
                    {hour.start} - {hour.finish}
                  </th>
                  {courts.map((court, index) => {
                    return (<React.Fragment key={court.id}>
                      <td width={"6%"} className={`bg-col-court ${checkBgColor(`${court.id}-${hour.id}:00`)}`} 
                        onClick={() => showDetail(`${court.id}-${hour.id}:00`)}
                        style={{ cursor: currentPath === "customer-dashboard" && "default" }}
                        ></td>
                      <td width={"6%"} className={`bg-col-court ${checkBgColor(`${court.id}-${hour.id}:30`)}`} 
                        onClick={() => showDetail(`${court.id}-${hour.id}:30`)}
                        style={{ cursor: currentPath === "customer-dashboard" && "default" }}
                        ></td>
                      {index === courts.length - 1 ? <td width={"2%"} className="bg-col-batas"></td> : <td width={"4%"} className="bg-col-batas"></td>}
                    </React.Fragment>)
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {(currentPath === 'dashboard' || currentPath === 'schedule') &&
        <ScheduleModal isShow={isShow} handleClose={() => {
          setIsShow(false)
          setRentalId(0)
        }} rentalId={rentalId} size="xl" swal={Swal} />}
    </>
  );
};

export default Schedule;
