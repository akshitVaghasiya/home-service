/*
 * @file: login.js
 * @description: It Contain login router/api.
 * @author: Sandip Vaghasiya
 */
import { Joi } from "../../../../utilities/schemaValidate";
import { Router } from "express";
import commonResolver from "../../../../utilities/commonResolver";
import { getWorkerDetail } from "../../../../services/worker/worker";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/worker/login:
 *  post:
 *   tags: ["Worker"]
 *   summary: user login api
 *   description: api used to login users
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
 *             required:
 *   responses:
 *    "200":
 *     description: success
 */

// const loginSchema = Joi.object({
//     email: Joi.string()
//         .required()
//         .label("Email or username")
//     , password: Joi.string()
//         .required()
//         .label("Password")
// });

router.get(
  "/me",
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getWorkerDetail,
    isRequestValidateRequired: false,
    schemaValidate: {},
  })
);

export default router;
