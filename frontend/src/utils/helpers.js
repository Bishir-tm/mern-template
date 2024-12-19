import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

// function to check token expiry
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now(); // Token expiration in milliseconds
  } catch {
    return true;
  }
};

// function to check user role (admin, user etc)
export const checkRole = (token) => {
  try {
    const { role } = jwtDecode(token);
    return role;
  } catch (err) {
    alert(err);
  }
};
