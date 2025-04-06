const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");

router.post("/", movieController.create);

router.get("/", movieController.findAll);

router.get("/:id", movieController.findOne);

router.put("/:id", movieController.update);

router.delete("/:id", movieController.delete);

module.exports = router;