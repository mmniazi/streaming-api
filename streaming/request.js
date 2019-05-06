const HEADERS = {'Content-Type': 'application/json; charset=utf-8'};

function respondSuccess(callback, result) {
    const response = {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify(result),
    };
    callback(null, response);
}

function respondError(callback, statusCode, error, message) {
    console.error(error); // TODO: structured logging
    callback(null, {
        statusCode: statusCode,
        headers: HEADERS,
        body: JSON.stringify({'statusCode': statusCode, message: message}),
    });
}

function validateParams(callback, body) {
    const errorMsg = 'userId (string) field is required in json body';
    try {
        const data = JSON.parse(body);
        if (typeof data.userId === 'string') {
            return data.userId
        }
    } catch (e) {
    } // ignore json parsing failure and respond with error

    respondError(callback, 400, errorMsg, errorMsg);
    return null
}

module.exports = {
    respondSuccess,
    respondError,
    validateParams
};