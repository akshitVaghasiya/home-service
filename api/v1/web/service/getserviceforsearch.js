import { Joi } from "../../../../utilities/schemaValidate";
import { Router } from "express";
import commonResolver from "../../../../utilities/commonResolver";
import { getServiceForSearch } from "../../../../services/service/service";
const router = new Router();


router.post(
  "/getserviceforsearch",
  commonResolver.bind({
    modelService: getServiceForSearch,
    isRequestValidateRequired: false,
    schemaValidate: {},
  })
);

export default router;
