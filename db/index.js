/*
 * @file: index.js
 * @description: It Contain db setup function.
 * @author: Sandip Vaghasiya
 */

import mongoose from "mongoose";

/* development connection string */
const databaseUrl = process.env.ATLAS_URL;

console.log("DB URL:", databaseUrl);
// Mongoose setup with server
mongoose.connect(
  databaseUrl,
  {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log("database not connected",err);
    } else {
      console.log("database connected");
    }
  }
);

export default mongoose;
