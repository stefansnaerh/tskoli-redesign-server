const axios = require("axios");
const mongoose = require("mongoose");
const Guides = require("../model/Guides");
const GuidesFull = require("../model/GuidesFull");

const controller = {};

controller.create = async (req, res) => {
   
}

controller.edit = async (req, res) => {
    try {

        
        const editGuide = await GuidesFull.replaceOne(
          {
            
            _id: req.params._id,
          },
          {
               ...req.body,
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
   
}
module.exports = controller;