const mongoose = require("mongoose");
const Guides = require("../model/Guide");
const AssignmentReturn = require("../model/AssignmentReturn");
const Review = require("../model/Review");

const controller = {};

controller.getAssignments = async (req, res) => {

    const assignmentReturns = await AssignmentReturn.find().populate("sender", "name");
    const reviews = await Review.find();

    const recommendedReviews = reviews.filter(review => review.vote === "recommend")
    //filtering only returns that have been recommended:
    const recommendedReturns = assignmentReturns.filter( ret => {
        const reviewsFound = recommendedReviews.findIndex( review => ret["_id"].toString() === review.assignmentReturn.toString()) 
        console.log(reviewsFound);
        return reviewsFound != -1;
     })
  

    return res.send(recommendedReturns);
};

module.exports = controller;