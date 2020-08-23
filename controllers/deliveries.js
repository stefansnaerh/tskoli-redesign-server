const mongoose = require("mongoose");
const Delivery = require("../model/Delivery");
const Assessment = require("../model/Assessment");

const controller = {};

// Get all deliveries for user
controller.getAll = async (req, res) => {
  try {
    const allDeliveries = await Delivery.find({
      sender: mongoose.Types.ObjectId(req.user._id),
    });
    return res.send(allDeliveries);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Create a new delivery
controller.create = async (req, res) => {
  // Create new delivery
  try {
    const newDelivery = await Delivery.create({
      sender: mongoose.Types.ObjectId(req.user._id),
      deliverable: mongoose.Types.ObjectId(req.body.deliverableId),
      url: req.body.url,
      comment: req.body.comment,
    });

    return res.send({ message: "Success", data: newDelivery });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get specific delivery by _id
controller.get = async (req, res) => {
  try {
    let data;

    data = await Delivery.findOne({
      _id: req.params._id,
    }).populate("deliverable");

    data = {
      ...data._doc,
      assessments: await Assessment.find({
        delivery: mongoose.Types.ObjectId(data._id),
      }),
    };

    // TODO Protect delivery?
    return res.send(data);
  } catch (error) {
    return res.status(404).send({ message: "Delivery not found" });
  }
};

// Get specific delivery by _id for assessment (excludes current user)
controller.getForDeliverable = async (req, res) => {
  try {
    const currentUserDeliveries = await Delivery.find({
      sender: mongoose.Types.ObjectId(req.user._id),
      deliverable: mongoose.Types.ObjectId(req.params.deliverableId),
    })
      .sort({ createdAt: -1 })
      .populate("deliverable");

    const augmentedCurrentUserDeliveries = await Promise.all(
      currentUserDeliveries.map(async (delivery) => {
        const assessments = await Assessment.find({
          delivery: mongoose.Types.ObjectId(delivery._id),
        });

        return {
          ...delivery._doc,
          assessments,
        };
      })
    );

    const otherUsersDeliveries = await Delivery.find({
      sender: { $not: { $eq: mongoose.Types.ObjectId(req.user._id) } },
      deliverable: mongoose.Types.ObjectId(req.params.deliverableId),
    })
      .sort({ createdAt: -1 })
      .populate("deliverable");

    // Get all deliveries made for this assessment which are not made by
    // the current user, in crescent order of assessment count, which
    // helps the deliveries with few or no counts bubble up
    const augmentedOtherUsersDeliveries = (
      await Promise.all(
        otherUsersDeliveries.map(async (delivery) => {
          const assessments = await Assessment.find({
            delivery: mongoose.Types.ObjectId(delivery._id),
          });

          return {
            ...delivery._doc,
            assessments,
          };
        })
      )
    )
      .sort((a, b) =>
        a.assessments.length > b.assessments.length
          ? 1
          : b.assessments.length > a.assessments.length
          ? -1
          : 0
      )
      .filter((delivery) => {
        // Remove deliveries that the current user has already evaluated
        if (
          delivery.assessments.find((assessment) => {
            // Super weird situation where these values have to be
            // converted into string so this comparison works :O
            return `${assessment.evaluator}` === `${req.user._id}`;
          })
        ) {
          return false;
        } else {
          return true;
        }
      });

    return res.send({
      currentUserDeliveries: augmentedCurrentUserDeliveries,
      otherUsersDeliveries: augmentedOtherUsersDeliveries,
    });
  } catch (error) {
    return res.status(404).send({ message: "Delivery not found" });
  }
};

// Edit delivery by id
controller.edit = async (req, res) => {
  try {
    const delivery = await Delivery.updateOne(
      {
        _id: req.params._id,
      },
      {
        $set: {
          ...req.body,
          updatedAt: Date.now(),
        },
      }
    );

    return res.send(delivery);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Remove delivery by id
// router.delete("/:_id", async (req, res) => {
//   try {
//     const removed = await Delivery.deleteOne({ _id: req.params._id });

//     if (removed.deletedCount === 0) {
//       return res.status(500).send({ message: "Nothing to delete" });
//     }

//     return res.send(removed);
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ message: "An error has occurred", error: error });
//   }
// });

module.exports = controller;
