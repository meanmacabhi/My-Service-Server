const express = require("express");
const router = express.Router();
const {services} =require("../Controllers/Service-Controller")

router.route('/services').get(services);
module.exports = router;