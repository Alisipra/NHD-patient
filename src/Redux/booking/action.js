import * as types from "./types";
import axios from "axios";

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

    const res = await axios.post(`http://localhost:1000/appointments/create`, validData);

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
  try {
    const res = await axios.post(
      `http://localhost:1000/patients/register`,
      data
    );
    return res.data
  } catch (error) {
    console.log(error);
  }
};

// get post
// export const getPost = () => async (dispatch) => {
//   try {
//     dispatch({ type: types.GET_POST_REQUEST });
//     const res = await axios.get(
//       `https://zany-gray-clam-gear.cyclic.app/appointments`
//     );
//     dispatch({ type: types.GET_POST_SUCCESS, payload: res.data.post });
//   } catch (error) {
//     console.log(error);
//   }
// };
