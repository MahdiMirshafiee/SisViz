#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
sisviz - System Information Visualization CLI

Usage:
  sisviz             Start the monitoring dashboard
  sisviz --help      Show this help message

Options:
  -h, --help         Display this help information
`);
  process.exit(0);
}

const express = require("express");
const path = require("path");
const { getSystemSnapshot } = require("./services/sysinfo.js");

const app = express();
const PORT = 3000;

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