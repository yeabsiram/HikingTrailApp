const express = require('express');
const router = express.Router();

const userController = require('../Controllers/userController');


router.route("/").post(userController.addOne);

router.route("/login").post(userController.logIn);

module.exports = router;