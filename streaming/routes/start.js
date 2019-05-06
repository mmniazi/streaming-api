const {updateCounterParams} = require('../dynamodb');
const {respondError, respondSuccess, validateParams} = require('../request');

const limitReachedMsg = 'Maximum of 3 live streams are allowed per user';

function start(dynamoDb) {
    return (event, context, callback) => {
        const userId = validateParams(callback, event.body);

        if (userId == null) return;

        const params = updateCounterParams(userId, +1);

        dynamoDb.updateItem(params, (error, result) => {
            if (error) {
                return respondError(callback, 501, 'Failed to fetch active streams count');
            }

            if (result.Item.count >= 3) {
                return respondError(callback, 403, limitReachedMsg);
            }

            respondSuccess(callback, result.Item);
        });
    }
}

module.exports = {start, limitReachedMsg};