// import * as types from "./types";

// const TOKEN = localStorage.getItem("token");
// const initialState = {
//   userLogin: { loading: false, error: false, message: "" },
//   userLogout: { message: "" },
//   data: {
//     isAuthenticated: !!TOKEN,
//     token: TOKEN,
//     user: null,
//     report: [],
//   },
// };

// export default function authReducer(state = initialState, { type, payload }) {
//   switch (type) {
//     case types.LOGIN_USER_REQUEST:
//       return {
//         ...state,
//         userLogin: { loading: true, error: false },
//       };
//     case types.LOGIN_USER_SUCCESS:
//       localStorage.setItem("token", payload.token);
//       return {
//         ...state,
//         userLogin: { loading: false, error: false, message: payload.message },
//         data: {
//           isAuthenticated: payload.token ? true : false,
//           token: payload.token,
//           report: payload.report,
//           user: payload.user,
//         },
//       };

//     case "AUTH_LOGIN_RESET":
//       return {
//         ...state,
//         userLogin: { loading: false, error: false, message: "" },
//       };
//     case types.AUTH_LOGOUT:
//       localStorage.removeItem("token");
//       return {
//         ...state,
//         userLogout: { message: "Logout Successfully" },
//         data: {
//           isAuthenticated: false,
//           token: null,
//           user: null,
//         },
//       };
//     default:
//       return state;
//   }
// }
import * as types from "./types";

// Retrieve token from localStorage if present
const TOKEN = localStorage.getItem("token");

const initialState = {
  userLogin: { loading: false, error: false, message: "" },
  userLogout: { message: "" },
  data: {
    isAuthenticated: !!TOKEN, // Ensure boolean value
    token: TOKEN || null,
    user: null,
    report: [],
  },
};

export default function authReducer(state = initialState, { type, payload }) {
  switch (type) {
    // ✅ Handle Login Request
    case types.LOGIN_USER_REQUEST:
      return {
        ...state,
        userLogin: { loading: true, error: false, message: "" },
      };

    // ✅ Handle Successful Login
    case types.LOGIN_USER_SUCCESS:
      localStorage.setItem("token", payload?.token);
      return {
        ...state,
        userLogin: {
          loading: false,
          error: false,
          message: payload?.message || "Login Successful",
        },
        data: {
          isAuthenticated: true,
          token: payload?.token,
          user: payload?.user || null,
          report: payload?.report || [],
        },
      };

    // ✅ Reset Login State
    case "AUTH_LOGIN_RESET":
      return {
        ...state,
        userLogin: { loading: false, error: false, message: "" },
      };

    // ✅ Handle Logout
    case types.AUTH_LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        userLogout: { message: "Logout Successfully" },
        data: {
          isAuthenticated: false,
          token: null,
          user: null,
          report: [],
        },
      };

    // ✅ Default State
    default:
      return state;
  }
}
