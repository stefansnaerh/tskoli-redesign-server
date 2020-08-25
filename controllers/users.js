const User = require("../model/User");

const controller = {};


controller.getAll = async (req, res) => {
    const users = await User.find();
    const strippedUsers = users.map(user=>{
        return {
            name: user.name,
            email: user.email,
            background: user.background,
            careerGoals: user.careerGoals,
            interests: user.interests,
            favoriteArtist: user.favoriteArtist
        }
    })
    return res.send(strippedUsers);
  };

  module.exports = controller;
