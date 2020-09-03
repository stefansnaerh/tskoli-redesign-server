const axios = require("axios");
const jwt = require('jsonwebtoken');

const controller = {};

const payload = {
    iss: process.env.ZOOM_JWT_API_KEY,
    exp: ((new Date()).getTime() + 5000)
}
const token = jwt.sign(payload, process.env.ZOOM_JWT_SECRET);
// Get all recordings
controller.getAll = async (req, res) => {
    try{
        const response = await axios.get(
            "https://api.zoom.us/v2/users/ellertsmari@gmail.com/recordings",
            {
                headers: {
                    'User-Agent': 'Zoom-api-Jwt-Request',
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                params: { 'status': 'active', 'from': '2020-08-02' }
            });
        res.send(response.data);
    }
    catch(err){
        res.status(500).send(err)
    }    
};

module.exports = controller;
