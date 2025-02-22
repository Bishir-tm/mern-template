import axios from "axios";

const initializeApp = () => {
  // Setting base URL for all API requests via axios
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  if (import.meta.env.MODE === "development") {
    // dev code
  } else {
    // Prod build code

    // Removing console.log from prod
    console.log = () => {};

    // init analytics here
  }
};

export default initializeApp;
