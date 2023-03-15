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

/*********** Combine all Routes ********************/
app.use("/customer", customer);
app.use("/category", category);
app.use("/subcategory", subcategory);


export default app;
