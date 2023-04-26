import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import {
  encryptpassword,
  decryptPassword,
  generateJwtTokenFn,
  generateRandom,
} from "../../utilities/universal";

// Get admin dashboard Detail
export const getAdminDashboard = async (req, res, next) => {

  console.log("req--------->", req);
  let customerPayload = {
    isDeleted: false,
    role: 'user',
  }
  let customer = await dbService.recordsCount('customerModel', customerPayload);

  let workerPayload = {
    isDeleted: false,
  }
  let worker = await dbService.recordsCount('workerModel', workerPayload);

  let orderPayload = {
    status: 'completed',
  }
  let order = await dbService.recordsCount('orderModel', orderPayload);

  let earning = await dbService.aggregateData('orderModel',
    [
      {
        $match: { "status": 'completed' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toInt: "$grandTotal" } },
        }
      },
    ]
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 for the actual month number
  const twelveMonthsAgo = new Date(currentYear, currentMonth - 12, 1); // subtract 12 months and set the day to 1 to get the start date
  const startDate = twelveMonthsAgo.toISOString();
  const endDate = currentDate.toISOString();

  let monthlyEarning = await dbService.aggregateData('orderModel', [
    {
      $match: {
        status: "completed",
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        total: { $sum: { $toInt: "$grandTotal" } }
      }
    },
    {
      $addFields: {
        monthName: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id.month", 1] }, then: "January" },
              { case: { $eq: ["$_id.month", 2] }, then: "February" },
              { case: { $eq: ["$_id.month", 3] }, then: "March" },
              { case: { $eq: ["$_id.month", 4] }, then: "April" },
              { case: { $eq: ["$_id.month", 5] }, then: "May" },
              { case: { $eq: ["$_id.month", 6] }, then: "June" },
              { case: { $eq: ["$_id.month", 7] }, then: "July" },
              { case: { $eq: ["$_id.month", 8] }, then: "August" },
              { case: { $eq: ["$_id.month", 9] }, then: "September" },
              { case: { $eq: ["$_id.month", 10] }, then: "October" },
              { case: { $eq: ["$_id.month", 11] }, then: "November" },
              { case: { $eq: ["$_id.month", 12] }, then: "December" }
            ],
            default: "unknown"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$monthName",
        year: "$_id.year",
        total: 1
      }
    },
    // { $sort: { year: 1 } }
  ]);

  monthlyEarning.sort(function (a, b) {
    if (a.year === b.year) {
      // If the years are the same, compare by month
      var monthA = new Date('2000 ' + a.month).getMonth();
      var monthB = new Date('2000 ' + b.month).getMonth();
      return monthA - monthB;
    } else {
      // Otherwise, compare by year
      return a.year - b.year;
    }
  });

  let orderStatus = await dbService.aggregateData('orderModel',
    [
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lt: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          completedOrders: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed"] },
                1,
                0
              ]
            }
          },
          cancelledOrders: {
            $sum: {
              $cond: [
                { $eq: ["$status", "cancelled"] },
                1,
                0
              ]
            }
          },
          totalOrders: {
            $sum: 1
          }
        }
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                { case: { $eq: ["$_id.month", 12] }, then: "December" },
              ],
              default: "",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$monthName",
          year: "$_id.year",
          completedOrders: 1,
          cancelledOrders: 1,
          totalOrders: 1
        }
      },
    ]
  );

  orderStatus.sort(function (a, b) {
    if (a.year === b.year) {
      // If the years are the same, compare by month
      var monthA = new Date('2000 ' + a.month).getMonth();
      var monthB = new Date('2000 ' + b.month).getMonth();
      return monthA - monthB;
    } else {
      // Otherwise, compare by year
      return a.year - b.year;
    }
  });

  let categoryWorker = await dbService.aggregateData('workerModel',
    [
      {
        $lookup:
        {
          from: "categories",
          localField: "skills",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $group: {
          _id: {
            categoryName: "$category.categoryName",
            categoryId: "$category._id",
          },
          numOfworker: { $sum: 1 },
        }
      },
      {
        $group: {
          _id: null,
          totalCategory: { $sum: 1 },
          categories: {
            $push: {
              name: { $arrayElemAt: ["$_id.categoryName", 0] },
              categoryId: { $arrayElemAt: ["$_id.categoryId", 0] },
              value: "$numOfworker",
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalCategory: 1,
          categories: 1,
        }
      },
    ]
  );

  console.log("categoryWorker--------->", categoryWorker);

  return {
    customer,
    worker,
    order,
    earning,
    monthlyEarning,
    orderStatus,
    categoryWorker: categoryWorker[0],
  }

};

// Get worker dashboard Detail

export const getWorkerDashboard = async (req, res, next) => {
  let payload = req.body;
  let { userId } = req.user;

  let completedOrders = await dbService.recordsCount('orderModel',
    {
      workerId: ObjectId(userId),
      status: 'completed',
    }
  );

  let cancelledOrders = await dbService.recordsCount('orderModel',
    {
      workerId: ObjectId(userId),
      status: 'cancelled',
    }
  );

  let confirmedOrders = await dbService.recordsCount('orderModel',
    {
      workerId: ObjectId(userId),
      status: 'confirmed',
    }
  );

  let earning = await dbService.aggregateData('orderModel',
    [
      {
        $match: {
          workerId: ObjectId(userId),
          "status": 'completed',
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toInt: "$grandTotal" } },
        }
      },
    ]
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 for the actual month number
  const twelveMonthsAgo = new Date(currentYear, currentMonth - 12, 1); // subtract 12 months and set the day to 1 to get the start date
  const startDate = twelveMonthsAgo.toISOString();
  const endDate = currentDate.toISOString();

  let monthlyEarning = await dbService.aggregateData('orderModel', [
    {
      $match: {
        workerId: ObjectId(userId),
        status: "completed",
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        total: { $sum: { $toInt: "$grandTotal" } }
      }
    },
    {
      $addFields: {
        monthName: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id.month", 1] }, then: "January" },
              { case: { $eq: ["$_id.month", 2] }, then: "February" },
              { case: { $eq: ["$_id.month", 3] }, then: "March" },
              { case: { $eq: ["$_id.month", 4] }, then: "April" },
              { case: { $eq: ["$_id.month", 5] }, then: "May" },
              { case: { $eq: ["$_id.month", 6] }, then: "June" },
              { case: { $eq: ["$_id.month", 7] }, then: "July" },
              { case: { $eq: ["$_id.month", 8] }, then: "August" },
              { case: { $eq: ["$_id.month", 9] }, then: "September" },
              { case: { $eq: ["$_id.month", 10] }, then: "October" },
              { case: { $eq: ["$_id.month", 11] }, then: "November" },
              { case: { $eq: ["$_id.month", 12] }, then: "December" }
            ],
            default: "unknown"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$monthName",
        year: "$_id.year",
        total: 1
      }
    },
    // { $sort: { year: 1 } }
  ]);

  console.log("monthlyEarning----->", monthlyEarning);

  monthlyEarning.sort(function (a, b) {
    if (a.year === b.year) {
      // If the years are the same, compare by month
      var monthA = new Date('2000 ' + a.month).getMonth();
      var monthB = new Date('2000 ' + b.month).getMonth();
      return monthA - monthB;
    } else {
      // Otherwise, compare by year
      return a.year - b.year;
    }
  });

  return {
    earning: earning[0],
    completedOrders,
    cancelledOrders,
    confirmedOrders,
    monthlyEarning,
  };
}