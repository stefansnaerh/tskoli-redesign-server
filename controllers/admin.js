const axios = require("axios");
const mongoose = require("mongoose");
const Guides = require("../model/Guides");

const controller = {};


controller.create = async (req, res) => {
  // Create new guide
  console.log(req.body);
  try {
    const newGuide = await Guides.create({
      _id: mongoose.Types.ObjectId(),
      Knowledge: req.body.Knowledge,
      Skills: req.body.Skills,
      Resources: req.body.Resources,
      Topics: req.body.Topics,
      Classes: req.body.Classes,
      Category: req.body.Category,
      Title: req.body.Title,
      topicsList: req.body.topicsList,
      Deliver: req.body.Deliver,
      project: req.body.project,
      Description: req.body.Description,
      updatedAt: Date.now(),
    }, (error) => {
      console.log(error);
    });

    console.log(newGuide);
    return res.send({ message: "Success", data: newGuide });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}

controller.edit = async (req, res) => {

  try {
    const editGuide = await Guides.replaceOne(
      {
        _id: req.params._id,
      },
      {
        ...req.body, // spread syntax
        updatedAt: Date.now(),
      }
    );

    return res.send(editGuide);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}

controller.delete = async (req, res) => {

  try {

    const deleteGuide = await Guides.deleteOne(
      {
        _id: req.params._id,
      },
    );
    console.log(deleteGuide);

    res.status(200).json({ message: 'Deleted this guide' })
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}
module.exports = controller;