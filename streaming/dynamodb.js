function initDynamo() {
    const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

    return new AWS.DynamoDB.DocumentClient();
}

function updateCounterParams(userId, delta) {
    return {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {id: userId},
        UpdateExpression: 'SET count = count + :incr',
        ExpressionAttributeValues: {':incr': {'N': delta}},
        ReturnValues: 'UPDATED_OLD'
    };
}

module.exports = {
    initDynamo,
    updateCounterParams
};