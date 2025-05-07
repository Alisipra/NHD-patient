import * as types from "./types";
import axios from "axios";
const url ="http://localhost:1000"
// createBooking Action
export const createBooking = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_BOOKING_REQUEST });

    // Ensure data is valid before sending
    const validData = {
      ...data,
      address: data.address?.trim() || "Not provided", // Default if empty
      age: Math.max(1, Number(data.age)), // Ensure valid age (no negative values)
    };

    console.log("Sending Data:", validData); // Debugging

    const res = await axios.post(`${url}/appointments/create`, validData);

    console.log("Booking Response:", res.data);

    dispatch({ type: types.CREATE_BOOKING_SUCCESS, payload: res.data });

  } catch (error) {
    console.error("Booking Error:", error.response ? error.response.data : error.message);

    dispatch({
      type: types.CREATE_BOOKING_FAILURE,
      payload: error.response?.data?.message || "Something went wrong.",
    });
  }
};

// create patient
export const createPatient = (data) => async (dispatch) => {
  console.log("Sending Patient Data:", data);
  try {
    const res = await axios.post(
      `${url}/patients/register`,
      data
    );
    

    return res.data
  } catch (error) {
    console.log(error);
  }
};


