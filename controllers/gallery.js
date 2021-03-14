const mongoose = require("mongoose");
const Guides = require("../model/Guides");
const AssignmentReturn = require("../model/AssignmentReturn");
const Review = require("../model/Review");

const axios = require("axios");

const controller = {};

 /*controller.getRecommendedAssignments = async (req, res) => {

    //const reviews = await Review.find({vote: "recommend"});
    //const reviews = await Review.find({});
    //const assignmentReturns = await AssignmentReturn.find().populate("sender");
    //const users = await User.find();

    let reviews;
    let guides;
    let votedAssignments;

    // Get Reviews
    try {
        reviews = await Review.find({vote: "recommend"}).populate("assignmentReturn");
    } catch (error) {
        return res.status(500).send({
            message: "Error: Unable to fetch Learning Guides",
            error: error,
        });
    }

    // Format Reviews into Assignments
    try {
        votedAssignments = reviews.map((review) => ({
            _id: review._id,
            vote: review.vote,
            assignmentReturn: review.assignmentReturn._id
        }));
    } catch (error) {
        return res
            .status(500)
            .send({ message: "Error: Malformed assignments", error: error });
    }

    const enhancedAssignments = await Promise.all(
        votedAssignments.map(async (assignment) => {
            let extraData = {};

            // Get each voted assigmnment's info: including assignment id, sender id, liveVersion, imageOrGif, introduction  
            try {
                extraData.assignmentInfo = await AssignmentReturn.findOne(
                    {
                        
                       // assignmentReturn: mongoose.Types.ObjectId(assignmentReturn._id),
                                            
                    }
                ).populate("Assignment").sort({ createdAt: -1 });
            } catch (error) {
                return res.status(500).send({
                    message: "Error: Unable to form assignmentInfo",
                    error: error,
                });
            }

            // Get this voted assignment's author name
            try {
                extraData.author = await AssignmentReturn.findOne(
                    {
                        //sender: mongoose.Types.ObjectId(sender._id),
                        
                    }
                ).populate("sender", "name").sort({ createdAt: -1 });
            } catch (error) {
                return res.status(500).send({
                    message: "Error: Unable to form author",
                    error: error,
                });
            }

            // Get this voted assignment's module name
            try {
                extraData.module = await Guides.findOne(
                    
                       // (guide) => guide["_id"] === await Review.find({}).toObject().assignment.toString()
                    
                );
            } catch (error) {
                return res.status(500).send({
                    message: "Error: Unable to form module",
                    error: error,
                });
            }

            return {
                ...assignment,
                ...extraData,
            };
        })
    );

    return res.send(reviews);
}; */

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