const express = require("express");
const morgan = require("morgan");

const cookieParser = require("cookie-parser");

function serverConfig(app) {
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("dev"));

}

module.exports = serverConfig;
