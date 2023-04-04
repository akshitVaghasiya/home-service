const ObjectId = require("mongodb").ObjectID;
import dbService from "../../utilities/dbService";
import { unlink } from 'node:fs';
const path = require('path');
const baseDir = path.resolve(process.cwd());

/********************** addservice **********************/
export const addService = async (req, res) => {
	const payload = req.body;
	const { filename } = req.file;

	// let a = '[' + payload.FAQs?.replace(new RegExp('\r\n| ', 'g'), '') + ']';
	let serviceData = await dbService.findOneRecord("serviceModel", {
		serviceName: payload.serviceName
	});

	if (serviceData) {
		throw new Error("Service Already Exists!");
	} else {

		let data = {
			subCategoryId: payload?.subCategoryId,
			serviceName: payload?.serviceName,
			duration: payload?.duration,
			price: payload?.price,
			description: payload?.description,
			included: payload?.included?.split(','),
			excluded: payload?.excluded?.split(','),
			// FAQs: JSON.parse(a).map(obj => ({ ...obj })),
			FAQs: JSON.parse(payload?.FAQs),
		};

		if (filename) {
			data = {
				...data,
				...{ image: filename }
			}
		}

		let project = await dbService.createOneRecord("serviceModel", data);
		console.log("project data=>", project);

		return {
			data: project,
			message: "new service added successfully."
		};
	}
};

/********************** updateService **********************/
export const updateService = async (req, res) => {
	const payload = req.body;
	const { filename } = req.file;
	const { id } = req.query;

	let serviceData = await dbService.findOneRecord("serviceModel", {
		_id: ObjectId(id),
		isDeleted: false
	});

	if (!serviceData) {
		throw new Error("Service Not Exists!");
	}

	let data = {
		subCategoryId: payload?.subCategoryId,
		serviceName: payload?.serviceName,
		duration: payload?.duration,
		price: payload?.price,
		description: payload?.description,
		included: payload?.included?.split(','),
		excluded: payload?.excluded?.split(','),
		// FAQs: JSON.parse(a).map(obj => ({ ...obj })),
		FAQs: JSON.parse(payload?.FAQs),
	};

	if (filename) {
		data = {
			...data,
			...{ image: filename }
		}

		if (serviceData.image) {
			const oldFileName = serviceData.image;
			const directoryPath = baseDir + "/views/serviceImages/";

			unlink(directoryPath + oldFileName, (err) => {
				if (err) {
					console.log("err-->", err)
				}
				console.log(`image successfully deleted ${oldFileName}`);
			});
		}
	}

	let project = await dbService.findOneAndUpdateRecord("serviceModel",
		{
			_id: ObjectId(id),
			isDeleted: false
		},
		data,
		{ new: true }
	);

	return {
		data: project,
		message: "service updated successfully."
	};
	// }
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
	// let { subCategoryId } = req.body;

	let serviceData = await dbService.findAllRecords("serviceModel",
		{
			// subCategoryId: ObjectId(subCategoryId),
			isDeleted: false,
		}
	);

	return serviceData;
}