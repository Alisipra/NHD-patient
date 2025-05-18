import "./login.css";
import "../index.css";
import logo from "../Assets/logonhd.png";
import { Link, useNavigate } from "react-router-dom";
import NavBars from "../Sections/navbar";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authLogin, forgotPassword } from "../Redux/auth/action";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const notify = (text) => toast(text);

function Login() {
  const [form, setForm] = useState({ patientID: "", password: "" });
  const [email, setemail] = useState("");
  const dispatch = useDispatch();
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
// const handleClick = (e) => {
//   try {
//     dispatch(authLogin(form)).then((res) => {
//       console.log("our message ",res.response.data)
//       if (res.message === "Login Successful") {
//         notify("Login Successful");

//         // ✅ Save token correctly
//         localStorage.setItem("patientToken", res.token); 

//         return navigate("/");
//       }

//       if (res.message === "Patient not found or wrong credentials.") {
//         return notify("Wrong credentials, Please try again.");
//       }

//       if (res.message === "Error occurred, unable to Login.") {
//         return notify("Error occurred, unable to Login.");
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     return notify("Error occurred, unable to Login.");
//   }
// };





const handleClick = async (e) => {
  e.preventDefault(); // Prevent default form submission

  try {
    const res = await dispatch(authLogin(form));

    const data = res?.response?.data || res;

    // Success case
    if (data.message === "Login Successful") {
      if (!data.token) {
        notify("Login succeeded but token is missing.");
        return;
      }

      localStorage.setItem("patientToken", data.token);
      notify("Login Successful");
      navigate("/");
      return;
    }

    // Show backend message
    notify(data.message || "Unexpected error occurred.");

  } catch (error) {
    console.error("Login error:", error);

    // ✅ Show backend error message if available
    const backendMessage = error?.response?.data?.message;

    if (backendMessage) {
      notify(backendMessage);
    } else {
      notify("Network error or server not responding.");
    }
  }
};



  const [forgotLoading, setforgetLoading] = useState(false);
  const HandlePassword = () => {
    let data = { email, type: "patient" };
    setforgetLoading(true);
    dispatch(forgotPassword(data)).then((res) => {
      if (res.message === "User not found") {
        setforgetLoading(false);
        return notify("User Not Found");
      }
      setemail("");
      setforgetLoading(false);
      return notify("Account Details Send");
    });
  };

  return (
    <>
      <ToastContainer />
      <NavBars />
      <div className="section-area account-wraper2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-8">
              <div className="appointment-form form-wraper">
                <div className="logo">
                  <img src={logo} alt="img" />
                </div>
                <form action="#">
                  <div className="form-group">
                    <h6>Patient ID</h6>
                    <input
                      name="patientID"
                      value={form.patientID}
                      type="text"
                      className="form-control"
                      placeholder="ID"
                      onChange={onChange}
                    ></input>
                  </div>
                  <div className="form-group">
                    <h6>Password</h6>
                    <input
                      name="password"
                      value={form.password}
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={onChange}
                    ></input>
                  </div>
                  <div className="form-group" onClick={handleClick}>
                    <Link
                      type="botton"
                      className="btn mb-30 btn-lg  w-100"
                      id="btn_login"
                    >
                      Login
                    </Link>
                    <p>Forgot Account Details?</p>
                  </div>
                </form>
                <div className="forgotPass">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={({ target }) => setemail(target.value)}
                    placeholder="Enter email"
                  />
                  <br />
                  <button onClick={HandlePassword}>
                    {forgotLoading ? "Loading.." : "Send Mail"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
