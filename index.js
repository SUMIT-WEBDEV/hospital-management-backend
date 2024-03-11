require("dotenv").config();

const express = require("express");
const cron = require("node-cron");
// const cors = require("cors");

const serverless = require("serverless-http");

const app = express();

// app.use(cors());

// Init Middleware
app.use(express.json());

// To remove CROS (cross-resource-origin-platform) problem
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // to allow all client we use *
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  ); //these are the allowed methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // allowed headers (Auth for extra data related to authoriaztion)
  next();
});

const connectDB = require("./db");
const { formType } = require("./functions/formType");

connectDB();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const ServerlessHttp = require("serverless-http");

// api documentation

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Backend of Health app is Working Fine.");
});
app.get("/hello", (req, res) => {
  res.send("Backend of Health app is Working Fine hello.");
});

//Auth routes

app.use("/api/v1/auth", require("./routes/auth"));

app.use("/api/v1", require("./routes/index"));

cron.schedule("*/3 * * * *", () => {
  //'0 0 * * *'
  formType();
});

// app.use(`/.netlify/functions/api`, (req, res) => {
//   res.status(404).json({ error: "Not Found" });
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// module.exports.handler = serverless(app);
