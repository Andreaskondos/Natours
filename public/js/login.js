/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios.post(
      `${req.protocol}://${req.get("host")}/api/v1/users/login`,
      {
        email,
        password,
      }
    );
    if (res.data.status === "Success") {
      showAlert("success", "You have successfully logged in!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get(
      `${req.protocol}://${req.get("host")}/api/v1/users/logout`
    );
    if (res.data.status === "Success") location.reload(true);
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};
