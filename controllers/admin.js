const axios = require("axios");
const mongoose = require("mongoose");
const Guides = require("../model/Guides");
const GuidesFull = require("../model/GuidesFull");

const controller = {};

controller.create = async (req, res) => {
   // Create new guide
  try {
    const newGuide = await GuidesFull.create({
        references: req.body.references,
        Knowledge: req.body.Knowledge, 
        Skills: req.body.Skills, 
        actionPoints: req.body.actionPoints, 
        Resources: req.body.Resources, 
        Topics: req.body.Topics,   
        Classes: req.body.Classes,       
        Category: req.body.Category,   
        UID: req.body.UID,       
        Title: req.body.Title, 
        topicsList: req.body.topicsList,
        Deliver: req.body.Deliver,
        project: req.body.project,     
        Description: req.body.Description,
    });

    return res.send({ message: "Success", data: newGuide });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
}

controller.edit = async (req, res) => {

    try {    
        const editGuide = await GuidesFull.replaceOne(
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
        const deleteGuide = await GuidesFull.deleteOne(
          {
            _id: req.params._id,
          },
        );
        console.log(deleteGuide);
        res.status(200).json({message: 'Deleted this guide'})
      } catch (error) {
        return res
          .status(500)
          .send({ message: "An error has occurred", error: error });
      }
}
module.exports = controller;