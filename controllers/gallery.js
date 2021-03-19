const mongoose = require("mongoose");
const Guides = require("../model/Guides");
const AssignmentReturn = require("../model/AssignmentReturn");
const Review = require("../model/Review");

const axios = require("axios");

const controller = {};

controller.getAssignments = async (req, res) => {
    // const guides = (await axios.get(`${process.env.CMS_URL}/guides/short`)).data;
    const guides = await Guides.find({});
    const assignmentReturns = await AssignmentReturn.find().populate("sender", "name");
    const reviews = await Review.find();

    //adding assisignments from strapi to the assignmentReturns:
    const returnsWithGuides = assignmentReturns.map((assignmentReturn) => {
        const simplifiedReturn = assignmentReturn.toObject();

        const assignment = guides.find(
            (guide) => guide["_id"] === simplifiedReturn.assignment.toString()
        ) || {};
        const project = { project: assignment.project };
        simplifiedReturn.assignment = project;
        return simplifiedReturn;
    });

    //adding rewiews to the returns that have been reviewd:
    reviews.forEach((rawReview) => { // go through all the reviews
        const review = rawReview.toObject(); // turn each review into object
        const index = returnsWithGuides.findIndex( // index is the particular review, inside assignmentReturns array
            (r) => r["_id"].toString() === review.assignmentReturn.toString()
        );

        try {
            if (!returnsWithGuides[index].reviews) {
                returnsWithGuides[index].reviews = [];
            }
            const vote = { vote: review.vote };
            returnsWithGuides[index].reviews.push(vote); // only keep vote
        } catch (err) {
            // In case an assignment return was
            // deleted, it won't be found
        }
    });

    return res.send(returnsWithGuides);
};

module.exports = controller;