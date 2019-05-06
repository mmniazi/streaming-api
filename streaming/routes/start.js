const {dynamoDbParams} = require('../dynamodb');
const {respondError, respondSuccess, validateParams} = require('../request');

function start(dynamoDb) {
    return (event, context, callback) => {
        const userId = validateParams(callback, event.body);

        if (userId == null) return;

        const params = dynamoDbParams(userId);

        dynamoDb.get(params, (error, result) => {
            if (error) {
                return respondError(callback, 501, 'Failed to fetch active streams count');
            }
            respondSuccess(callback, result);
        });
    }
}

module.exports = start;