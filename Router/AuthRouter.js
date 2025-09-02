const express = require("express");

const router = express.Router();

const authcontrollers = require("../Controllers/Auth-Controllers");
const signupSchema = require("../Validator/auth-validator");
const validate = require("../Middleware/validate-middleware");
const authMiddleware = require("../Middleware/auth-middleware");


router.post("/send-otp", authcontrollers.sendOtp);
router.post("/verify-otp", authcontrollers.verifyOtp);
router.get("/",authcontrollers.home);
router.route("/register").post(validate(signupSchema),authcontrollers.reg);
router.post("/login",authcontrollers.login);
router.route("/user").get(authMiddleware, authcontrollers.user);






module.exports = router;