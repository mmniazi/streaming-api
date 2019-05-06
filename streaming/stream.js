'use strict';

const {initDynamo} = require('./dynamodb');
const {start} = require('./routes/start');

const dynamoDb = initDynamo();

module.exports.start = start(dynamoDb);