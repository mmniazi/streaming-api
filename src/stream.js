'use strict';

const {initDynamo} = require('./dynamodb');
const {start} = require('./routes/start');
const {end} = require('./routes/end');

const dynamoDb = initDynamo();

module.exports.start = start(dynamoDb);
module.exports.end = end(dynamoDb);