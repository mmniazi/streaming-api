const HEADERS = {'Content-Type': 'application/json; charset=utf-8'};

function respondSuccess(callback, result) {
    const response = {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify(result.Item),
    };
    callback(null, response);
}

function respondError(callback, statusCode, message) {
    console.error(message); // TODO: structured logging
    callback(null, {
        statusCode: statusCode,
        headers: HEADERS,
        body: JSON.stringify({'statusCode': statusCode, message: message}),
    });
}

function validateParams(callback, body) {
    const errorMsg = 'userId (integer) field is required in json body';
    try {
        const data = JSON.parse(body);
        if (!isNaN(data.userId)) {
            return parseInt(data.userId);
        }
    } catch (e) {
    } // ignore json parsing failure and respond with error

    respondError(callback, 400, errorMsg);
    return null
}

module.exports = {
    respondSuccess,
    respondError,
    validateParams
};