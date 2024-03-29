const path = require("path");

module.exports = {
  entry: "./public/js/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public/js/bundled"),
  },
  mode: "none",
};
