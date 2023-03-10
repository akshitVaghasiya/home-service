/*
 * @file: index.js
 * @description: It's combine all routers.
 * @author: Sandip Vaghasiya
 */

// Please assign all url here related WEB api's
import { Router } from "express";
import webV1 from "./v1/web";
/*********** Combine all Routes ********************/

const app = Router();

app.use('/v1', webV1)


export default app;
