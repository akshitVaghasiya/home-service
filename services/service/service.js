const ObjectId = require("mongodb").ObjectID;
import mongoose from "mongoose";
import dbService from "../../utilities/dbService";
import { unlink } from 'node:fs';
const path = require('path');
const baseDir = path.resolve(process.cwd());

/********************** addservice **********************/
export const addService = async (req, res) => {
	const payload = req.body;
	console.log("payload-->", payload);
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
			isActive: payload?.isActive,
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
		isActive: payload?.isActive,
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
	let postData = req.body;
	// console.log("postdata=>", postData);
	let { page = 1, limit = 0 } = req.body;
	let skip = limit * page - limit;
	let where = {
		isDeleted: false,
	};

	if (postData.searchText) {
		where = {
			...where,
			...{
				$or: [
					{ serviceName: { $regex: postData.searchText, $options: "i" } },
				],
			},
		};
	}

	if (postData.selectText) {
		where = {
			...where,
			...{
				subCategoryId: { $in: postData.selectText }
			},
		};
	}

	let sort = {};

	if (postData.sortBy && postData.sortMode) {
		if (postData.sortBy) {
			sort[postData.sortBy] = postData.sortMode;
			console.log("in if sort");
		}
	} else {
		sort["_id"] = -1;
	}
	// console.log("where=>", where);

	let totalrecord = await dbService.recordsCount("serviceModel", where);
	let results = await dbService.findManyRecordsWithPagination("serviceModel",
		where,
		{
			sort,
			skip,
			limit
		}
	);

	return {
		items: results,
		page: page,
		count: totalrecord,
		limit: limit,
	};
}

/********************** getServiceBySubCategory **********************/
export const getServiceBySubCategory = async (req, res) => {
  let name = req.body.subCategoryName;

  let id = await dbService.findOneRecord("subCategoryModel",
  {
    subCategoryName: name,
    isDeleted: false,
  },
  {
    project: {_id: 1}
  })

  if (!id) {
    throw new Error("Subcategory not available");
  }

  let services = await dbService.findAllRecords("serviceModel",
    {
      categoryId: mongoose.Types.ObjectId(id),
      isDeleted: false,
    }
  );

  return services;

}