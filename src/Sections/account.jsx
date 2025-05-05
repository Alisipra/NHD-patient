import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createBooking, createPatient } from "../Redux/booking/action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./account.css";
import MobileImg from "../Assets/mobile.f82d7322.png";
import WomanImg from "../Assets/women.eb5c49c5.png";
const url="https://nhd-server.vercel.app"
const notify = (text) => toast(text);

function Account() {
  let initialData = {
    patientName: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    email: "",
    disease: "",
    time: "",
    date: "",
    doctorID: "", // Store selected doctor ID
  };

  const [formData, setFormData] = useState(initialData);
  const [doctors, setDoctors] = useState([]); // Store available doctors
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Fetch available doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let response = await fetch(`${url}/doctors/`); // Update with your correct API URL
        let data = await response.json();
    
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
    
  }, []);

  // Handle input changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.patientName ||
      !formData.email ||
      !formData.time ||
      !formData.date ||
      !formData.doctorID
    ) {
      notify("Please fill all the required fields");
      return;
    }

    try {
      setLoading(true);
      dispatch(createPatient({ ...formData, patientID: Date.now() })).then(
        (res) => {
          let data = { ...formData, patientID: res.id };
          dispatch(createBooking(data));
          setFormData(initialData);
          setLoading(false);
          notify("Appointment Booked Successfully");
        }
      );
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
                      {/* address */}
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
                        <input
                          type="date"
                          className="form-control"
                          value={formData.date}
                          name="date"
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="time"
                          className="form-control"
                          value={formData.time}
                          name="time"
                          onChange={handleFormChange}
                          required
                        />
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
            </div>{" "}
            </div>
           
          </div>
        </div>
      </section>
    </div>
  );
}

export default Account;
