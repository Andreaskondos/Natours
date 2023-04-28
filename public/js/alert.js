/* eslint-disable */

export const hideAlert = () => {
  const alert = document.querySelector(".alert");
  if (alert) alert.parentElement.removeChild(alert);
};

export const showAlert = function (type, text, time = 6) {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${text}</div>`;
  document.body.insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, time * 1000);
};
