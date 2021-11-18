const mongoose = require("mongoose");
const Guides = require("../model/Guide");
const sanitizeHtml = require("sanitize-html");

const controller = {};


controller.create = async (req, res) => {
  // Create new guide
  try {
    const newID = mongoose.Types.ObjectId();
    req.body.Deliver.Title = sanitizeHtml(req.body.Deliver.Description);
    const newGuide = await Guides.create({
      _id: newID,
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
      Description: sanitizeHtml(req.body.Description),
      order: req.body.order,
      hidden: req.body.hidden,
      updatedAt: Date.now(),
    }, (error) => {
      console.log(error);
    });

    return res.send({ message: "Success", id: newID });// get new created guide's id and send it to the frontend
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}

controller.edit = async (req, res) => {
  req.body.Description = sanitizeHtml(req.body.Description);
  req.body.Deliver.Description = sanitizeHtml(req.body.Deliver.Description);

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

    res.status(200).json({ message: 'Deleted this guide' })
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}
module.exports = controller;