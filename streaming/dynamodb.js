function initDynamo() {
    const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

    return new AWS.DynamoDB.DocumentClient();
}

function dynamoDbParams(userId) {
    return {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: userId,
        },
    };
}

module.exports = {
    initDynamo,
    dynamoDbParams
};