const express = require("express");
const { createUser } = require("../controllers/userController"); 

const router = express.Router();

// Registration route
router.post("/", createUser);

module.exports = router;
