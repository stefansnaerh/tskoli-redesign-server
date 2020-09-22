const User = require("../model/User");
const Assessment = require("../model/Assignment");
const AssignmentReturn = require("../model/AssignmentReturn");
const Review = require("../model/Review");
const axios = require("axios");

const controller = {};

controller.getAll = async (req, res) => {
  const users = await User.find();
  const strippedUsers = users.map((user) => {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      background: user.background,
      careerGoals: user.careerGoals,
      interests: user.interests,
      favoriteArtist: user.favoriteArtist,
    };
  });
  return res.send(strippedUsers);
};

controller.getProgress = async (req, res) => {
    const guides = (await axios.get(`${process.env.CMS_URL}/guides/short`)).data;
    const assignmentReturns = await AssignmentReturn.find().populate("sender");
    const reviews = await Review.find().populate("evaluator");

    //adding assisignments from strapi to the assignmentReturns:
    const returnsWithGuides = assignmentReturns.map(assignmentReturn=>{
      const simplifiedReturn = assignmentReturn.toObject();
      simplifiedReturn.assignment = guides.find(guide=>guide["_id"]===simplifiedReturn.assignment.toString());
      return simplifiedReturn
    })
    returnsWithGuides.sort((a,b)=>{
      return a.sender.name>b.sender.name?1:-1
    });
    
    //adding rewiews to the returns that have been reviewd:
    reviews.map(rawReview=>{
      const review = rawReview.toObject();
      const index = returnsWithGuides.findIndex(r=>r["_id"].toString()===review.assignmentReturn.toString())
      if(!returnsWithGuides[index].reviews){
        returnsWithGuides[index].reviews = [];
      }
      returnsWithGuides[index].reviews.push(review);
    })
    
    return res.send(returnsWithGuides);
  
  
};

module.exports = controller;
