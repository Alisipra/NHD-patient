import * as types from "./types";
import axios from "axios";

//login user
export const authLogin = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_USER_REQUEST });
    const res = await axios.post(
      "http://localhost:1000/patients/login",
      data
    );
    dispatch({
      type: types.LOGIN_USER_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: res.data.token,
        report: res.data.report,
      },
    });
    
    return res.data;
  } catch (error) {
    console.error("❌ Axios Error: ", error);

    // Safer error handling to prevent "undefined" issues
    const errorMessage = error?.response?.data?.message || "Login failed. Please try again.";
    dispatch({
      type: types.LOGIN_USER_ERROR,
      payload: { message: errorMessage },
    });

    
  }
};

// logout user

export const authLogout = () => async (dispatch) => {
  try {
    dispatch({
      type: types.AUTH_LOGOUT,
    });
  } catch (error) {
    console.log(error);
  }
};

//forgot password
export const forgotPassword = (data) => async (dispatch) => {
  try {
    const res = await axios.post(
      `https://zany-gray-clam-gear.cyclic.app/admin/forgot`,
      data
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
