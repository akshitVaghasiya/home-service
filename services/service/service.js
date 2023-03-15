const ObjectId = require("mongodb").ObjectID;
import dbService from "../../utilities/dbService";
import {
    encryptpassword,
    decryptPassword,
    generateJwtTokenFn,
    generateRandom,
} from "../../utilities/universal";

/********************** addservice **********************/
export const addService = async (req, res) => {
    const payload = req.body;
    const { filename } = req.file;

    console.log("payload->", req);

    let a = '[' + payload.queryQue.replace(new RegExp('\r\n| ', 'g'), '') + ']';

    let data = {
        subcategoryId: payload.subcategoryId,
        serviceName: payload.serviceName,
        duration: payload.duration,
        price: payload.price,
        included: payload.included.split(','),
        excluded: payload.excluded.split(','),
        image: filename,
        queryQue: JSON.parse(a).map(obj => ({ ...obj })),
    };

    console.log("data->", data);

    let project = await dbService.createOneRecord("serviceModel", data);
    console.log("project data=>", project);

    return project;
};