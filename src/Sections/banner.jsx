import { Link } from "react-router-dom";
import doctor from "../Assets/doctor.png";
import "./banner.css";
function Banner() {
  return (
    <div className="banner">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-7">
            <h5 className="backimg">Adding Care to your Life.</h5>
            <h2>Protecting and Taking Care To Of Your Health</h2>
            <button>
              <Link to={"/about"}>Read More</Link>
            </button>
          </div>

          <div className="col-lg-5 col-md-5 bannerImg">
            <img src={doctor} alt="img" loading="lazy"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
