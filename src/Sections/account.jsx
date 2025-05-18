import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createBooking, createPatient } from "../Redux/booking/action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./account.css";
import MobileImg from "../Assets/mobile.f82d7322.png";
import WomanImg from "../Assets/women.eb5c49c5.png";

const url = "https://nhd-server.vercel.app";

const notify = (text) => toast(text);

// Get next available dates based on doctor's available days
function getNextDatesForDays(days, count = 30) {
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const result = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    if (days.includes(dayName)) {
      result.push(date.toISOString().split("T")[0]); // 'YYYY-MM-DD'
    }
  }

  return result;
}

// Convert "12:00-15:00" to 12-hour formatted 20 min slots
function getTimeSlots(range) {
  if (!range.includes("-")) return [];

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const [startStr, endStr] = range.split("-");
  const start = parseTime(startStr);
  const end = parseTime(endStr);

  const slots = [];
  for (let time = start; time < end; time += 20) {
    const hour = Math.floor(time / 60);
    const min = time % 60;
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedTime = `${String(formattedHour).padStart(2, "0")}:${String(
      min
    ).padStart(2, "0")} ${ampm}`;
    slots.push(formattedTime);
  }

  return slots;
}

function Account() {
  let initialData = {
    patientID: "",
    patientName: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    email: "",
    disease: "",
    time: "",
    date: "",
    doctorID: "",
    emergencyNo: null,
    bloodGroup: "N/A",
    ward: "General",
    password: "default123",
  };

  const [formData, setFormData] = useState(initialData);
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let response = await fetch(`${url}/doctors/`);
        let data = await response.json();

        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const fetchBookedTimes = async (doctorID, date) => {
    try {
      const token = localStorage.getItem("patientToken");
      
      const res = await fetch(
        `${url}/appointments?doctorID=${doctorID}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const booked = data.map((b) => b.time);
      setBookedTimes(booked);
    } catch (err) {
      console.error("Error fetching booked times:", err);
      setBookedTimes([]);
    }
  };

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (name === "doctorID") {
      const selectedDoc = doctors.find((doc) => doc._id === value);

      if (selectedDoc && selectedDoc.availableDays) {
        const nextDates = getNextDatesForDays(selectedDoc.availableDays);
        setAvailableDates(nextDates);
        setTimeSlots([]);
        setBookedTimes([]);
        setFormData((prev) => ({ ...prev, date: "", time: "" }));
      }
    }

    if (
      (name === "date" || name === "doctorID") &&
      updatedForm.date &&
      updatedForm.doctorID
    ) {
      const selectedDoc = doctors.find(
        (doc) => doc._id === updatedForm.doctorID
      );
      if (selectedDoc && selectedDoc.timeSlot) {
        const slots = getTimeSlots(selectedDoc.timeSlot);

        setTimeSlots(slots);

        await fetchBookedTimes(updatedForm.doctorID, updatedForm.date);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.patientID ||
      !formData.patientName ||
      !formData.email ||
      !formData.time ||
      !formData.date ||
      !formData.doctorID
    ) {
      notify("Please fill all the required fields");
      return;
    }
    const token = localStorage.getItem("patientToken");
    if (!token) {
      notify("Please login first to book an appointment");
      return;
    }

    try {
      setLoading(true);
      dispatch(createPatient({ ...formData })).then(() => {
        dispatch(createBooking({ ...formData }));
        setFormData(initialData);
        setAvailableDates([]);
        setTimeSlots([]);
        setBookedTimes([]);
        setLoading(false);
        notify("Appointment Booked Successfully");
      });
    } catch (error) {
      console.log(error);
      notify("Something Went Wrong...");
    }
  };

  return (
    <div>
      <ToastContainer />
      <section className="section-area account-wraper1">
        <div className="container-fluid">
          <div className="appointment-inner section-sp2">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xl-5 col-lg-6 col-md-6 col-sm-12">
                  <div className="appointment-form form-wraper">
                    <h3>Book Appointment</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="CNIC"
                          value={formData.patientID}
                          name="patientID"
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          value={formData.email}
                          name="email"
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Your Name"
                          value={formData.patientName}
                          name="patientName"
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Phone Number"
                          value={formData.mobile}
                          name="mobile"
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Address"
                          value={formData.address}
                          name="address"
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Disease"
                          value={formData.disease}
                          name="disease"
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Age"
                          value={formData.age}
                          name="age"
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <select
                          className="form-select form-control"
                          name="gender"
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <select
                          className="form-select form-control"
                          value={formData.doctorID}
                          name="doctorID"
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                              {doctor.docName} - {doctor.department}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="date"
                          value={formData.date}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select Appointment Date</option>
                          {availableDates.map((date, index) => (
                            <option key={index} value={date}>
                              {date}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="time"
                          value={formData.time}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Select Time Slot</option>
                          {timeSlots.map((slot, index) => (
                            <option
                              key={index}
                              value={slot}
                              disabled={bookedTimes.includes(slot)}
                            >
                              {slot}{" "}
                              {bookedTimes.includes(slot) ? "(Booked)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button type="submit">
                        {loading ? "Loading..." : "Book Now"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="images-group">
                <img src={MobileImg} alt="Mobile" className="img-fluid img1" />
                <img src={WomanImg} alt="Woman" className="img2" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Account;
