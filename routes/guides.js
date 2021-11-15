const router = require("express").Router();
const controller = require("../controllers/guides");


/**
 * @swagger
 * paths:
 *  /api/v1/guides:
 *    get:
 *      summary: Get all the guides
 *      description: Returns all the guides in the system
 *      responses:
 *        '200':
 *          description: A successful response
 *        '500':
 *          description: An error occured while getting the data
 *      tags:
 *        - Guides
 *  /api/v1/guides/{id}:
 *    get:
 *      summary: Get one guide
 *      description: If you click a guide on [the tskoli pages](https://io.tskoli.dev) you can see the id of the guide in the addressbar. For example the id for [Design - UI Redesign](https://io.tskoli.dev/guides/614479b278de2900086b1e9d) in module 3 is 614479b278de2900086b1e9d
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The id of the guide you want to get
 *      responses:
 *        '200':
 *          description: A successful response
 *        '500':
 *          description: An error occured while getting the data
 *      tags:
 *        - Guides
 */
router.get("/", controller.getAll);

router.get("/:_id", controller.get);

module.exports = router;
