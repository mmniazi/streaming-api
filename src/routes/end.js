const { decrCounterParams, CONDITION_EXCEPTION, DYNAMO_ERROR } = require('../dynamodb');
const { respondError, respondSuccess, validateParams } = require('../request');

const LIMIT_REACHED_ERROR = 'Can not end live stream without starting one';

function end(dynamoDb) {
  return (event, context, callback) => {
    const userId = validateParams(callback, event.body);

    if (userId == null) return;

    const params = decrCounterParams(userId);

    dynamoDb.update(params, (error, result) => {
      if (error && error.code === CONDITION_EXCEPTION) {
        respondError(callback, 403, LIMIT_REACHED_ERROR, LIMIT_REACHED_ERROR);
      } else if (error) {
        respondError(callback, 501, error, DYNAMO_ERROR);
      } else {
        respondSuccess(callback, { streamCount: result.Attributes.streamCount });
      }
    });
  };
}

module.exports = { end, LIMIT_REACHED_ERROR };
