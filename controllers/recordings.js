const axios = require("../utils/cachedAxios");
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
  const { month, year } = req.query;
  const from = new Date(`${year}-${month}-01`);
  const to = new Date(`${year}-${month}-01`);
  to.setMonth(to.getMonth() + 1);
  to.setDate(to.getDate() - 1);

  try {
    const smariRes = await axios.get(
      "https://api.zoom.us/v2/users/ellertsmari@gmail.com/recordings",
      {
        headers: {
          "User-Agent": "Zoom-api-Jwt-Request",
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          from: `${from.getFullYear()}-${from.getMonth() + 1}-01`,
          to: `${to.getFullYear()}-${to.getMonth() + 1}-${to.getDate()}`,
        },
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
        params: {
          from: `${from.getFullYear()}-${from.getMonth() + 1}-01`,
          to: `${to.getFullYear()}-${to.getMonth() + 1}-${to.getDate()}`,
        },
      }
    );

    const allData = [...tskoliRes.data.meetings, ...smariRes.data.meetings];
    res.send({ meetings: allData });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = controller;
