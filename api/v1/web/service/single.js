import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getServiceWithId } from "../../../../services/service/service";
import { decodeJwtTokenFn } from '../../../../utilities/universal';
const router = new Router();

/**
 * @swagger
 * /api/v1/service/getservicewithid:
 *  post:
 *   tags: ["Service"]
 *   summary: get Service information.
 *   description: api used for get Service information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: get Service information.
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

router.post('/getservicewithid',
    // decodeJwtTokenFn,
    commonResolver.bind({
        modelService: getServiceWithId,
        isRequestValidateRequired: true,
        schemaValidate: dataSchema
    }))
export default router;
