const router = require("express").Router();
const Deliverable = require("../model/Deliverable");

router.get("/", async (req, res) => {
  console.log({ a: 4 });
  try {
    const allDeliverables = await Deliverable.find({});
    return res.send(allDeliverables);
  } catch {
    return res.status(500).send({ message: "An error has ocurred" });
  }
});

module.exports = router;
