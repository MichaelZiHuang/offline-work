/*
 * Module for working with a MongoDB connection.
 */

const { MongoClient } = require('mongodb');

const mongoHost = process.env.MONGO_HOST || '192.168.99.100';
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoUser   = "businesses";
const mongoPassword = "hunter2";
const mongoDBName = "businesses";

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;

let db = null;

exports.connectToDB = function (callback) {
  MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
    db = client.db(mongoDBName);
    callback();
  });
};

exports.getDBReference = function () {
  return db;
};
