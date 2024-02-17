const express = require("express");
const controller = require("../controller/auth");

const router = express.Router();

router.post("/signup", controller.HandleUserSignup);
router.post("/signin", controller.HandleUserSignin);

module.exports = router;
