const express = require("express");
const path = require("path");
const { getSystemSnapshot } = require("./services/sysinfo.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const snapshot = await getSystemSnapshot();
  res.render("index", { snapshot });
});

app.get("/api/system", async (req, res) => {
  const snapshot = await getSystemSnapshot();
  res.json(snapshot);
});

app.listen(PORT, () => {
  console.log(`SizViz Active on PORT ${PORT} http://localhost:${PORT}`);
});