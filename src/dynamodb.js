const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies, global-require

const MAX_STREAMS = 3;
const MIN_STREAMS = 0;
const DYNAMO_ERROR = 'Failed to fetch active streams count';
const CONDITION_EXCEPTION = 'ConditionalCheckFailedException';

function initDynamo() {
  return new AWS.DynamoDB.DocumentClient();
}

function initDynamoLocal() {
  AWS.config.update({
    endpoint: 'http://localhost:8000',
    region: 'eu-west-2',
  });

  const dynamodb = new AWS.DynamoDB();

  const params = {
    TableName: 'streaming-api-dev',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  };

  dynamodb.createTable(params, (err, data) => {
    if (err && err.code !== 'ResourceInUseException') {
      console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else if (!err) {
      console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
  });

  return new AWS.DynamoDB.DocumentClient();
}

function incrCounterParams(userId) {
  return {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: userId },
    ExpressionAttributeNames: { '#streamCount': 'streamCount' },
    ExpressionAttributeValues: { ':incr': 1, ':upperLimit': MAX_STREAMS },
    UpdateExpression: 'ADD #streamCount :incr',
    ConditionExpression: 'attribute_not_exists(#streamCount) or #streamCount < :upperLimit',
    ReturnValues: 'UPDATED_NEW',
  };
}

function decrCounterParams(userId) {
  return {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: userId },
    ExpressionAttributeNames: { '#streamCount': 'streamCount' },
    ExpressionAttributeValues: { ':decr': -1, ':lowerLimit': MIN_STREAMS },
    UpdateExpression: 'ADD #streamCount :decr',
    ConditionExpression: '#streamCount > :lowerLimit',
    ReturnValues: 'UPDATED_NEW',
  };
}

module.exports = {
  initDynamo,
  initDynamoLocal,
  incrCounterParams,
  decrCounterParams,
  DYNAMO_ERROR,
  CONDITION_EXCEPTION,
};
