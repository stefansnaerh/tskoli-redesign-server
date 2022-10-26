const mongoose = require("mongoose");
const Guides = require("../model/Guide");
const AssignmentReturn = require("../model/AssignmentReturn");
const Review = require("../model/Review");

const controller = {};

controller.getAssignments = async (req, res) => {
    // const guides = (await axios.get(`${process.env.CMS_URL}/guides/short`)).data;
    // const guides = await Guides.find({});
    const assignmentReturns = await AssignmentReturn.find().populate("sender", "name");
    const reviews = await Review.find();

    //adding assisignments to the assignmentReturns:
    /*const returnsWithGuides = assignmentReturns.map((assignmentReturn) => {
        const simplifiedReturn = assignmentReturn.toObject();

        const assignment = guides.find(
            (guide) => guide["_id"] === simplifiedReturn.assignment.toString()
        ) || {};
        const project = { project: assignment.project, title: assignment.Title };
        simplifiedReturn.assignment = project;
        return simplifiedReturn;
    });*/
    //only get recommended reviews to publish
    const recommendedReviews = reviews.filter(review => review.vote === "recommend")
    //adding recommended rewiews to the returns :
    const recommendedReturns = assignmentReturns.filter( ret => {
        const revies = recommendedReviews.indexOf( review => ret["_id"].toString() === review.AssignmentReturn.toString()) 
        console.log(reviews);
        return revies != -1;
     })
    /*recommendedReviews.forEach((rawReview) => { // go through all the recommended reviews
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
    });*/

    return res.send(recommendedReturns);
};

module.exports = controller;