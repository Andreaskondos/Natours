/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

export const updateSettings = async (data, updateType) => {
  try {
    const res = await axios.patch(
      `${req.protocol}://${req.get("host")}/api/v1/users/${
        updateType === "password" ? "updateMyPassword" : "updateMe"
      }`,
      data
    );
    if (res.data.status === "Success") {
      showAlert(
        "success",
        `${
          updateType === "password"
            ? "Success, your password has changed!"
            : "Your name and email has been updated"
        }`
      );
      // window.setTimeout(() => location.reload(true), 2000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
