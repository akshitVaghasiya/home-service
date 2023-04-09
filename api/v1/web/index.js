/*
 * @file: index.js
 * @description: It's combine all routers.
 * @author: Sandip Vaghasiya
 */
import { Router } from "express";
const app = Router();

import { decodeJwtTokenFn } from '../../../utilities/universal';
import customer from "./customer";
import category from "./category";
import subcategory from "./subcategory";
import service from "./service";
import admin from "./admin";
import worker from "./worker";

/*********** Combine all Routes ********************/
app.use("/customer", customer);
app.use("/category", category);
app.use("/subcategory", subcategory);
app.use("/service", service);
app.use("/admin", admin);
app.use("/worker", worker);

export default app;
