/* eslint-disable */
import { renderMap } from "./mapBox";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
// import "@babel/polyfill";

//DOM Elements
const map = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const updateUserForm = document.querySelector(".form-user-data");
const updatePasswordForm = document.querySelector(".form-user-settings");
const logoutBtn = document.querySelector(".nav__el--logout");
const bookBtn = document.getElementById("book-tour");

/////////////////
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  renderMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (updateUserForm) {
  updateUserForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // const name = document.getElementById("name").value;
    // const email = document.getElementById("email").value;
    // updateSettings({ name, email }, "data");

    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateSettings(form, "data");
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Loading...";
    const oldPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { oldPassword, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save Password";

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (logoutBtn) logoutBtn.addEventListener("click", logout);
if (bookBtn)
  bookBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
