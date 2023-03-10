import Joi from "@hapi/joi";
Joi.objectId = require('joi-objectid')(Joi)
import { createValidator } from "express-joi-validation";
const validator = createValidator({ passError: true });
module.exports = {Joi,validator};
