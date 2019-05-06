const MAX_STREAMS = 3;

function initDynamo() {
    const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

    return new AWS.DynamoDB.DocumentClient();
}

function incrCounterParams(userId) {
    return {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {id: userId},
        ExpressionAttributeNames: {'#streamCount': 'streamCount'},
        ExpressionAttributeValues: {':incr': 1, ':upperLimit': MAX_STREAMS},
        UpdateExpression: 'ADD #streamCount :incr',
        ConditionExpression: 'attribute_not_exists(#streamCount) or #streamCount < :upperLimit',
        ReturnValues: 'UPDATED_NEW'
    };
}

module.exports = {
    initDynamo,
    incrCounterParams
};