const {incrCounterParams, DYNAMO_ERROR, CONDITION_EXCEPTION} = require('../dynamodb');
const {respondError, respondSuccess, validateParams} = require('../request');

const LIMIT_REACHED_ERROR = 'Maximum of 3 live streams are allowed per user';

function start(dynamoDb) {
    return (event, context, callback) => {
        const userId = validateParams(callback, event.body);

        if (userId == null) return;

        const params = incrCounterParams(userId);

        dynamoDb.update(params, (error, result) => {
            if (error && error.code === CONDITION_EXCEPTION) {
                return respondError(callback, 403, LIMIT_REACHED_ERROR, LIMIT_REACHED_ERROR);
            } else if (error) {
                return respondError(callback, 501, error, DYNAMO_ERROR);
            }

            respondSuccess(callback, {'streamCount': result.Attributes.streamCount});
        });
    }
}

module.exports = {start, LIMIT_REACHED_ERROR};