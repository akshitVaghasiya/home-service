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
import cart from "./cart";
import worker from "./worker";
import order from "./order";
import review from "./review";

/*********** Combine all Routes ********************/
app.use("/customer", customer);
app.use("/category", category);
app.use("/subcategory", subcategory);
app.use("/service", service);
app.use("/admin", admin);
app.use("/cart", cart);
app.use("/worker", worker);
app.use("/order", order);
app.use("/review", review);

export default app;
