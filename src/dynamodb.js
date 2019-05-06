const MAX_STREAMS = 3;
const MIN_STREAMS = 0;
const DYNAMO_ERROR = 'Failed to fetch active streams count';
const CONDITION_EXCEPTION = 'ConditionalCheckFailedException';

function initDynamo() {
  const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies, global-require

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
  incrCounterParams,
  decrCounterParams,
  DYNAMO_ERROR,
  CONDITION_EXCEPTION,
};
