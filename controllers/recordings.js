const axios = require("axios");
const jwt = require("jsonwebtoken");

const controller = {};

const payload = {
  iss: process.env.ZOOM_JWT_API_KEY,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, process.env.ZOOM_JWT_SECRET);

const tskoliPayload = {
  iss: process.env.TSKOLI_ZOOM_JWT_API_KEY,
  exp: new Date().getTime() + 5000,
};
const tskoliToken = jwt.sign(tskoliPayload, process.env.TSKOLI_ZOOM_JWT_SECRET);

// Get all recordings
controller.getAll = async (req, res) => {
  try {
    const smariRes = await axios.get(
      "https://api.zoom.us/v2/users/ellertsmari@gmail.com/recordings",
      {
        headers: {
          "User-Agent": "Zoom-api-Jwt-Request",
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: { status: "active", from: "2020-08-02" },
      }
    );

    const tskoliRes = await axios.get(
      "https://api.zoom.us/v2/users/vefskolinn@tskoli.is/recordings",
      {
        headers: {
          "User-Agent": "Zoom-api-Jwt-Request",
          "content-type": "application/json",
          Authorization: "Bearer " + tskoliToken,
        },
        params: { status: "active", from: "2020-10-12" },
      }
    );

    const allData = [...tskoliRes.data.meetings, ...smariRes.data.meetings];

    res.send({ meetings: allData });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = controller;
