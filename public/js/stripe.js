/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
// const Stripe = require("stripe");

// const stripe = Stripe(
//   "pk_test_51MwsVqC1TPyoNntIs7hHkguSdId4gbqJQnd3WKKN0R00KEWSudSkABHRgE9SCSBbXbfLpbfSdie1rirW4AxUmBNj00tE6aijh1"
// );

export const bookTour = async (tourId) => {
  try {
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // await stripe.redirectToCheckout({
    //   sessionId: session.data.data.session.id,
    // });
    window.location.replace(session.data.data.session.url);
  } catch (err) {
    showAlert("error", err.message);
  }
};
