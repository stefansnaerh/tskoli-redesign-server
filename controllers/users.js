const axios = require("../utils/cachedAxios");
const User = require("../model/User");
const Assessment = require("../model/Assignment");
const Guides = require("../model/Guide");
const AssignmentReturn = require("../model/AssignmentReturn");
const Review = require("../model/Review");

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
  // const guides = (await axios.get(`${process.env.CMS_URL}/guides/short`)).data;
  const guides = (await Guides.find({}));
  const assignmentReturns = await AssignmentReturn.find().populate("sender");
  const reviews = await Review.find().populate("evaluator");

  //adding assisignments from strapi to the assignmentReturns:
  const returnsWithGuides = assignmentReturns.map((assignmentReturn) => {
    const simplifiedReturn = assignmentReturn.toObject();

    simplifiedReturn.assignment = guides.find(
      (guide) => guide["_id"] === simplifiedReturn.assignment.toString()
    );

    return simplifiedReturn;
  });

  returnsWithGuides.sort((a, b) => {
    return a.sender.name > b.sender.name ? 1 : -1;
  });

  //adding rewiews to the returns that have been reviewd:
  reviews.forEach((rawReview) => {
    const review = rawReview.toObject();
    const index = returnsWithGuides.findIndex(
      (r) => r["_id"].toString() === review.assignmentReturn.toString()
    );

    try {
      if (!returnsWithGuides[index].reviews) {
        returnsWithGuides[index].reviews = [];
      }

      returnsWithGuides[index].reviews.push(review);
    } catch (err) {
      // In case an assignment return was
      // deleted, it won't be found
    }
  });

  return res.send(returnsWithGuides);
};

controller.getUserProgress = async (req, res) => {
  const id = req.params.id?req.params.id:req.user._id;
  //const guides = (await axios.get(`${process.env.CMS_URL}/guides/short`)).data;
  const guides = (await Guides.find({}));
  const assignmentReturns = await AssignmentReturn.find({sender:id}).populate("sender");
  const allReviews = await Review.find().populate("evaluator");
  const userReviews = await Review.find({ evaluator: id });
  //adding assisignments from strapi to the assignmentReturns:
  const returnsWithGuides = assignmentReturns.map((assignmentReturn) => {
    const simplifiedReturn = assignmentReturn.toObject();
    simplifiedReturn.assignment = guides.find(
      (guide) => guide["_id"] === simplifiedReturn.assignment.toString()
    );
    return simplifiedReturn;
  });
  returnsWithGuides.sort((a, b) => {
    return a.sender.name > b.sender.name ? 1 : -1;
  });

  //adding rewiews to the returns that have been reviewd:
  allReviews.map((rawReview) => {
    const review = rawReview.toObject();
    const index = returnsWithGuides.findIndex(
      (r) => r["_id"].toString() === review.assignmentReturn.toString()
    );
    if (index === -1) return rawReview;
    if (!returnsWithGuides[index].allReviews) {
      returnsWithGuides[index].allReviews = [];
    }
    returnsWithGuides[index].allReviews.push(review);
  });

  return res.send({ returns: returnsWithGuides, reviews: userReviews });
};

module.exports = controller;
