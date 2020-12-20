const axios = require("axios");
const mongoose = require("mongoose");
const Guides = require("../model/Guides");

const controller = {};

// Get all guides
controller.getAll = async (req, res) => {
  try {
    const guides = await Guides.find({})
    
    return res.send(guides);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get a specific guide by id
controller.get = async (req, res) => {
  try { 
    const guide = await Guides.findById({_id: req.params._id});
     // console.log(guide);
    
    return res.send(guide._doc);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
      
  }
};

module.exports = controller;
