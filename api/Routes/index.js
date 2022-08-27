const express = require('express');
const router = express.Router();
const userRouter = require('./users');
const hikingTrailRouter = require('./hikingTrails');


router.use("/trails", hikingTrailRouter);
router.use("/users", userRouter);

module.exports = router;

