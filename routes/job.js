const express = require("express");
const router = express.Router();
const jobController = require("../controller/job");

router.post("/create", jobController.createJobPost);

module.exports = router;
