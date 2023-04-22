import { Joi } from "../../../../utilities/schemaValidate";
import { Router } from "express";
import commonResolver from "../../../../utilities/commonResolver";
import { getTop6Service } from "../../../../services/service/service";
const router = new Router();


router.post(
  "/gettop6service",
  commonResolver.bind({
    modelService: getTop6Service,
    isRequestValidateRequired: false,
    schemaValidate: {},
  })
);

export default router;
