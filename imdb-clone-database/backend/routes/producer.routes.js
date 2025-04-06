const express = require("express");
const router = express.Router();
const producerController = require("../controllers/producer.controller");

router.get("/", producerController.findAll);

module.exports = router;