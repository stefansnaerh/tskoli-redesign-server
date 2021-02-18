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
  const { month } = req.query;
  let year = (new Date()).getFullYear();
  if ( ( new Date() ).getMonth() < 7 ) { //if it is the spring semester
    year = month < 7 ? year:year-1 //check if the month we are looking at is this year
  }
  else{
    year = month < 7 ? year+1:year // so that we are always looking at the same school year
  }
  const isItDecember = month==="12";
  try {
    const smariRes = await axios.get(
      "https://api.zoom.us/v2/users/ellertsmari@gmail.com/recordings",
      {
        headers: {
          "User-Agent": "Zoom-api-Jwt-Request",
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: { from: `${year}-${month}-01`, to: `${isItDecember?year+1:year}-${isItDecember?"01":parseInt(month)+1}-01` },
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
        params: { from: `${year}-${month}-01`, to: `${isItDecember?year+1:year}-${isItDecember?"01":parseInt(month)+1}-01` },
      }
    );

    const allData = [...tskoliRes.data.meetings, ...smariRes.data.meetings];
    console.log("Month:", month);
    console.log("year:", year);
    console.log("from: ", `${year}-${month}-01`)
    console.log("to: ", `${isItDecember?year+1:year}-${isItDecember?"01":parseInt(month)+1}-01`);
    res.send({ meetings: allData });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = controller;
