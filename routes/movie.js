const express = require("express");
const controller = require("../controller/movie");
const { ensureAuthenticated } = require("../middlewares/authentication");

const router = express.Router();

router.get("/", controller.handleGetAllMovies);

router.get("/:id", controller.handleGetMovieById);

router.post("/", ensureAuthenticated(["admin"]), controller.handleCreateMovie);

router.put("/:id");

router.delete(
  "/:id",
  ensureAuthenticated(["admin"]),
  controller.handleDeleteMovieById
);

module.exports = router;
