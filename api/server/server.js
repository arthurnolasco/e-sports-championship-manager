const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const campeonatoRoute = require("./route/campeonatoRoute");
const timeRoute = require("./route/timeRoute");
const usuarioRoute = require("./route/usuarioRoute");
const partidaRoute = require("./route/partidaRoute");
const jogaRoute = require("./route/jogaRoute")

app.use("/", campeonatoRoute);
app.use("/", timeRoute);
app.use("/", usuarioRoute);
app.use("/", partidaRoute);
app.use("/", jogaRoute);

// PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
const INVALID_DATA_CODES = ["23502", "23503", "22P02", "22001", "22007", "22008"];

app.use(function (error, req, res, next) {
  if (/não (encontrad[oa]|existe)/i.test(error.message)) {
    return res.status(404).json({ error: error.message });
  }
  if (/já existe/i.test(error.message)) {
    return res.status(409).json({ error: error.message });
  }
  if (error.code === "23505") {
    return res.status(409).json({ error: "Registro já existe", detail: error.detail });
  }
  if (INVALID_DATA_CODES.includes(error.code)) {
    return res.status(400).json({ error: "Dados inválidos", detail: error.detail || error.message });
  }
  console.error(error);
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(3000);
