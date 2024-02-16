const router = require("express").Router();

const messagesRouter = require("./api/messages.routes");

router.use("/api/,messages", messagesRouter);

module.exports = router;
