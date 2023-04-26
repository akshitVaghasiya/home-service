import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import db from "./db";
import swaggerJsDocsWeb from "./config/swagger/swagger-config-web";
import logger from "morgan";
import { failAction } from "./utilities/response";
require("dotenv").config({ path: ".env" });

/**Start import routes */
import webRoutes from "./api/v1/web";
/**End import routes */

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";
const port = process.env.PORT ? process.env.PORT : 8000;
/** add clustering in node part */

const app = express();

// cron
require('./cron/index');

// Access-Control-Allow-Origin
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(logger("dev"));

app.use(cookieParser());

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.use('/image', express.static(path.join(__dirname, "/views")));
var options = {};

app.use(
  "/web-api-docs",
  swaggerUi.serveFiles(swaggerJsDocsWeb, options),
  swaggerUi.setup(swaggerJsDocsWeb)
);


/*********** All Routes ********************/

app.use("/api/v1", webRoutes);
app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res
      .status(400)
      .json(failAction(err.error.message.toString().replace(/[\""]+/g, "")));
  } else {
    // pass on to another error handler
    next(err);
  }
});

process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled rejection at ', promise, `reason: ${err.message}`)
  process.exit(1)
})
app.get("/", (req, res) =>
  res.send(`<h1>Home Service App ${env} environment</h1> ${__dirname}`)
);

// app.listen(port, () => console.log(`Backend is running on port ${port}`));
app.listen(port, function () {
  console.log(`Express server listening on port ${port} and worker ${process.pid}`)
})
