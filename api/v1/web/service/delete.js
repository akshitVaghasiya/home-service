/**
 * This is Contain Save router/api.
 * @author Sandip Vaghasiya
 *
 */
import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { deleteService } from "../../../../services/service/service";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();

/**
 * @swagger
 * /api/v1/service/delete:
 *  post:
 *   tags: ["Service"]
 *   summary: get service information.
 *   description: api used for delete Service information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: delete Service information.
 *        schema:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

const dataSchema = Joi.object({
  id: Joi.string().required().label("service id"),
});

router.post('/delete',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: deleteService,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))

export default router;
