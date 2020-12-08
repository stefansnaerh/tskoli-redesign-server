const axios = require("axios");
const Guides = require("../model/Guides");
const GuidesFull = require("../model/GuidesFull");

const getAssignment = async (assignmentId) => {
  let guide;
  let assignment;

  // Bring assignment from Strap (temporary)
  try {
    //guide = (await axios.get(`${process.env.CMS_URL}/guides/${assignmentId}`))
    //.data;
    //guide = await GuidesFull.findOne({id: assignmentId.toString()});
    guide = await GuidesFull.findOne({_id: assignmentId.toString()});
     
    // console.log(typeof assignmentId);
  } catch (error) {
    // TODO Handle error
    // return res.status(500).send({
    //   message: "Error: Unable to fetch Learning Guide",
    //   error: error,
    // });
    // return;
    throw "Error: Unable to fetch Learning Guide. " + error;
  }
  

  if (!guide) {
    // TODO Handle error
    // return res.status(404).send({ message: "Error: Learning Guide not found" });
    // return;
    throw "Error: Learning Guide not found. " + error;
  }

  try {
    // Format Guides into Assignments
    assignment = {
      _id: guide._id,
      guide: guide.Title,
      deliverable: guide.Deliver.Title,
      project: guide.project.Title,
      category: guide.Category,
      skills: guide.Skills ? guide.Skills.map((i) => i.Skill) : [],
      knowledge: guide.Knowledge ? guide.Knowledge.map((i) => i.Knowledge) : [],
    };
  } catch (error) {
    // TODO Handle error
    // return res.status(500).send({
    //   message: "Error: Unable to form assignment",
    //   error: error,
    // });
    // return;
    throw "Error: Unable to form assignment. " + error;
  }

  return assignment;
};

module.exports = getAssignment;
