const ObjectId = require("mongodb").ObjectID;
import dbService from "../../utilities/dbService";

/********************** addservice **********************/
export const addService = async (req, res) => {
    const payload = req.body;
    const { filename } = req.file;

    console.log("payload->", req);

    let a = '[' + payload.queryQue?.replace(new RegExp('\r\n| ', 'g'), '') + ']';

    let data = {
        subcategoryId: payload.subcategoryId,
        serviceName: payload.serviceName,
        duration: payload.duration,
        price: payload.price,
        description: payload.description,
        included: payload.included?.split(','),
        excluded: payload.excluded?.split(','),
        image: filename,
        queryQue: JSON.parse(a).map(obj => ({ ...obj })),
    };

    console.log("data->", data);

    let project = await dbService.createOneRecord("serviceModel", data);
    console.log("project data=>", project);

    return project;
};

/********************** updateService **********************/
export const updateService = async (req, res) => {
    const payload = req.body;
    const { filename } = req.file;
    const { id } = req.query;

    console.log("payload->", req);

    let a = '[' + payload.queryQue?.replace(new RegExp('\r\n| ', 'g'), '') + ']';

    let data = {
        subcategoryId: payload?.subcategoryId,
        serviceName: payload?.serviceName,
        duration: payload?.duration,
        price: payload?.price,
        description: payload?.description,
        included: payload?.included?.split(','),
        excluded: payload?.excluded?.split(','),
        image: filename,
        queryQue: JSON.parse(a).map(obj => ({ ...obj })),
    };

    console.log("data->", data);
    let project = await dbService.findOneAndUpdateRecord("serviceModel",
        {
            _id: id,
            isDeleted: false
        },
        data,
        { new: true }
    );

    console.log("project data=>", project);

    return project;
};

/********************** updateService **********************/
export const deleteService = async (req, res) => {
    let id = req.body.id;

    let where = {};
    where["_id"] = id;
    where["isDeleted"] = false;

    let serviceData = await dbService.findOneAndUpdateRecord("serviceModel",
        where,
        {
            isDeleted: true,
        });

    return "service deleted successfully";

}

/********************** getSingleService **********************/
export const getServiceWithId = async (req, res) => {
    let id = req.body.id;
    console.log("body", req.body);

    let serviceData = await dbService.findOneRecord("serviceModel",
        {
            _id: id,
            isDeleted: false,
        }
    );

    return serviceData;
}

/********************** getAllService **********************/
export const getService = async (req, res) => {
    let { subCategoryId } = req.body;
    console.log("body", req.body);

    let serviceData = await dbService.findAllRecords("serviceModel",
        {
            subCategoryId: ObjectId(subCategoryId),
            isDeleted: false,
        }
    );

    return serviceData;
}