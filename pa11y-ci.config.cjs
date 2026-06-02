const pa11yDefaults = require("./pa11y.json");

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

const paths = [
  "/",
  "/restaurants",
  "/burgers/burger-1",
  "/burgers/burger-1/add-review",
  "/restaurants/restaurant-1",
  "/restaurants/restaurant-1/add-review",
];

/** @type {import('pa11y-ci').Config} */
module.exports = {
  defaults: pa11yDefaults,
  urls: paths.map((path) => `${baseURL}${path}`),
};
