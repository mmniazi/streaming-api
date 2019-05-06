const { initDynamo, initDynamoLocal } = require('./dynamodb');
const { start } = require('./routes/start');
const { end } = require('./routes/end');

const dynamoDb = process.env.NODE_ENV === 'development' ? initDynamoLocal() : initDynamo();

module.exports.start = start(dynamoDb);
module.exports.end = end(dynamoDb);
