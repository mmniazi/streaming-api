const {start, LIMIT_REACHED_ERROR, CONDITION_EXCEPTION} = require('./start');

const dynamoMock = {
    update: (params, callback) => {
        if (params.Key.id === '1') {
            callback(null, {'Attributes': {'streamCount': 2}})
        } else if (params.Key.id === '2') {
            callback({'code': CONDITION_EXCEPTION}, null)
        } else {
            callback(true, null)
        }
    }
};

test('start request success', () => {
    const startHandler = start(dynamoMock);
    const event = {"body": `{\"userId\": \"1\"}`};
    const context = {};
    const callback = (error, reponse) => {
        expect(JSON.parse(reponse.body)).toStrictEqual({'streamCount': 2});
    };
    startHandler(event, context, callback)
});

test('start request limit reached', () => {
    const startHandler = start(dynamoMock);
    const event = {"body": `{\"userId\": \"2\"}`};
    const context = {};
    const callback = (error, reponse) => {
        const body = JSON.parse(reponse.body);
        expect(reponse.statusCode).toBe(403);
        expect(body.message).toBe(LIMIT_REACHED_ERROR);
    };
    startHandler(event, context, callback)
});
