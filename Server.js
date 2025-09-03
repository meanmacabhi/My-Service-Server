
require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./Router/AuthRouter");
const contactRoute = require("./Router/ContactRouter.js")
const serviceRoute = require("./Router/ServiceRouter.js")
const connectDb = require("./Utils/db.js");
const adminRoute = require("./Router/admin-router.js")
const cors = require("cors");
const paymentRoute = require("./Router/PaymentRouter");


const corsOptions ={
  origin:"http://localhost:5173",
  methods:"GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/form",contactRoute);
app.use("/api/data",serviceRoute);
app.use("/api/payment", paymentRoute);




//admin routes
app.use("/api/admin",adminRoute);


const port = 5000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running at port: ${port}`);
    });
  })
  .catch((err) => {
    console.error(" Server not started. DB connection failed.");
  });
