require("@babel/register");
require("dotenv").config();
const express = require("express");

const serverConfig = require("./config/serverCofnig");
const indexRouter = require("./routes/index.routes");

const app = express();

serverConfig(app);

app.use("/", indexRouter);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Шарманка играет на ${PORT}`);
});
