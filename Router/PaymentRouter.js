const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const razorpayInstance = require("../Utils/razorpay");

// ✅ Create Razorpay Order
router.post("/order", async (req, res) => {
  try {
    const options = {
      amount: 100, // in paise (100 = ₹1)
      currency: "INR",
      receipt: "receipt#1",
    };

    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Verify Payment
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature, payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
