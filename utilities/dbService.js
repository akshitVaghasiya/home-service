import collections from '../collections'

const createOneRecord = async (modelName, data) => {
  return await collections[modelName](data).save();
};

const createManyRecords = async (modelName, data) => {
  return await collections[modelName].insertMany(data)
};

const updateManyRecords = async (modelName, query, data, options = {}) => {
  return await collections[modelName].updateMany(query, data, options);
};

const findOneRecord = async (modelName, query, options = {}) => {
  return await collections[modelName].findOne(query, options);
};

const findAllRecords = async (modelName, query, options = {}) => {
  return await collections[modelName].find(query, options);
};


const findDistinctKey = async (modelName, key, query) => {
  return await collections[modelName].distinct(key, query);
};


const recordsCount = async (modelName, query, options = {}) => {
  return await collections[modelName].count(query);
};

const findOneAndUpdateRecord = async (modelName, query, payload, options = {}) => {
  return await collections[modelName].findOneAndUpdate(query, payload, options);
};

const aggregateData = async (modelName, query, isCollation=false) => {
  if(isCollation)  return await collections[modelName].aggregate(query).collation({ locale: "en" })
  return await collections[modelName].aggregate(query);
};

const findManyRecordsWithPagination = async (modelName, query, { sort, skip, limit }, options = {}) => {
  return await collections[modelName].find(query, options).sort(sort).skip(skip).limit(limit);
};

export const updateBulkRecords = async (modelName, payload) => {
  return new Promise(async function (resolve, reject) {
    collections[modelName].bulkWrite(payload)
      .then((response) => {
        resolve(true);
      })
      .catch((error) => {
        console.error(error)
        resolve(false);
      });
  });
};

const findAllRecordsWithPopulate = async (modelName, query, options = {}, populateOptions = {}) => {
  return await collections[modelName].find(query, options).populate(populateOptions);
};
const findLastRecord = async (modelName, query) => {
  return await collections[modelName].find(query).sort({ _id: -1 }).limit(1);
}
module.exports = {
  findOneRecord,
  findAllRecords,
  aggregateData,
  findOneAndUpdateRecord,
  recordsCount,
  updateManyRecords,
  createManyRecords,
  createOneRecord,
  findManyRecordsWithPagination,
  findDistinctKey,
  updateBulkRecords,
  findLastRecord,
  findAllRecordsWithPopulate
}
