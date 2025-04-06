const express = require("express");
const router = express.Router();
const actorController = require("../controllers/actor.controller");

router.get("/", actorController.findAll);

module.exports = router;