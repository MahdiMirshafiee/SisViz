const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { message: "sisviz!" });
});

app.listen(PORT, () => {
  console.log(`SizViz listening on PORT http://localhost:${PORT}`);
});
