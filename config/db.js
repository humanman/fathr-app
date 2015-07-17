// config/db.js
var name = process.env.MONGO_NAME;
var pw	 = process.env.MONGO_PASSWORD;
    module.exports = {
        url :   "mongodb://" + name + ":" + pw + "@ds047612.mongolab.com:47612/heroku_8z3mdf6z"
    }