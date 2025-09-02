const express = require("express")
const router = express.Router();
const {contactForm} = require("../Controllers/Contact-Controller")

router.route("/contact").post(contactForm);

module.exports = router;