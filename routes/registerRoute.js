const express = require("express");
const { createUser } = require("../controllers/userController"); // Adjust the path to your controller

const router = express.Router();

// Registration route
router.post("/", createUser);

module.exports = router;
