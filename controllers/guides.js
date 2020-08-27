const axios = require("axios");

const controller = {};

// Get all guides
controller.getAll = async (req, res) => {
  try {
    const guides = await axios.get(
      `${process.env.CMS_URL}/guides/short?_sort=createdAt:ASC`
    );
    return res.send(guides.data);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

// Get guide by id
controller.get = async (req, res) => {
  try {
    const guide = await axios.get(
      `${process.env.CMS_URL}/guides/${req.params.id}`
    );
    return res.send(guide.data);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error has occurred", error: error });
  }
};

module.exports = controller;
