const router = require("express").Router();
const controller = require("../controllers/recordings");


/**
 * @swagger
 * paths:
 *  /api/v1/recordings:
 *    get:
 *      summary: Get all the recordings
 *      description: Returns all the zoom recordings
 *      responses:
 *        '200':
 *          description: A successful response
 *        '500':
 *          description: An error occured while getting the data
 *      tags:
 *        - Recordings
 */

router.get("/", controller.getAll);


module.exports = router;
