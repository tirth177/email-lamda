'use strict';
const { handler } = require('./server.js')
const serverless = require('serverless-http')
module.exports.hello = serverless(handler)