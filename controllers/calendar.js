const mongoose = require("mongoose");
const Calendar = require("../model/Calendar");

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const guides = await Calendar.find({})
    return res.send(guides);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

controller.createEvent = async (req, res) => {
  // Create new guide
  try {
    const body = req.body;
    body._id = mongoose.Types.ObjectId();
    body.updatedAt = Date.now();
    await Calendar.create( body, (error) => {
      console.log(error);
    });

    return res.send({ message: "Success", id: body._id });// get new created event's id and send it to the frontend
  } catch (error) {
    console.log("the error is: ", error.message)
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}

module.exports = controller;