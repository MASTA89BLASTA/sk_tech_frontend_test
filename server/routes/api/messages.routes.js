const router = require("express").Router();
const { ValidationError } = require("sequelize");
const { Message } = require("../../db/models");

router.route('/').get((req, res) => {
    Message.findAll()
      .then((allMessages) => res.json({ messages: allMessages }))
      .catch((error) => res.status(500).json(error));
})

router.route("/").post(async (req, res) => {
  try {
    const newMessage = await Message.create(req.body);
    console.log(newMessage);
    res.status(201).json(newMessage); 
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
