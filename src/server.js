const express = require("express");
const path = require("path");
const {getSystemSnapshot} = require("./services/sysinfo.js")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { message: "sisviz!" });
});

app.listen(PORT, () => {
  console.log(`SizViz Active on PORT ${PORT} http://localhost:${PORT}`);
});
