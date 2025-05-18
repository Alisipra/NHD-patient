import { useEffect, useState } from "react";
import "./about.css";
import { FiHome } from "react-icons/fi";
import NavBars from "../Sections/navbar";
import Footer from "../Sections/footer";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

import { Link } from "react-router-dom";
import axios from "axios";
const url="https://nhd-server.vercel.app"
function OurTeam() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}/doctors/`) // Adjust API endpoint as needed
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  return (
    <div>
      <NavBars />
      <div className="banner-wraper">
        <div className="page-banner">
          <div className="container">
            <div className="page-banner-entry text-center">
              <h1>Doctors</h1>
              <nav aria-label="breadcrumb" className="breadcrumb-row">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to={"/home"}>
                      <FiHome />
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Doctors
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div key={doctor._id} className="col-lg-4 col-sm-6 mb-30">
                <div className="team-member">
                  <div className="team-media">
                    <img src={doctor.image} alt={doctor.name} />
                  </div>
                  <div className="team-info">
                    <div className="team-info-comntent">
                      <h4 className="title">{doctor.docName}</h4>
                      <span className="text-secondary">{doctor.specialization}</span>
                      <h6>Available: {doctor.availableDays.join(", ")}</h6>
                      <h6>Time Slot: {doctor.timeSlot}</h6>
                      <h6>Fee: {doctor.fee}</h6>
                    </div>
                    <ul className="social-media">
                      {doctor.twitter && (
                        <li>
                          <Link to={doctor.twitter}>
                            <FaTwitter />
                          </Link>
                        </li>
                      )}
                      {doctor.instagram && (
                        <li>
                          <Link to={doctor.instagram}>
                            <FaInstagram />
                          </Link>
                        </li>
                      )}
                      {doctor.linkedin && (
                        <li>
                          <Link to={doctor.linkedin}>
                            <FaLinkedin />
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No doctors available.</p>
          )}
        </div>
      </div>

      <Footer />
      
    </div>
  );
}

export default OurTeam;
