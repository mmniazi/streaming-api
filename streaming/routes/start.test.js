const {start, limitReachedMsg} = require('./start');

const dynamoMock = {
    get: (params, callback) => {
        if (params.Key.id === '1') {
            callback(null, {'Item': {'id': '1', 'count': 2}})
        } else if (params.Key.id === '2') {
            callback(null, {'Item': {'id': '1', 'count': 3}})
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
        expect(JSON.parse(reponse.body)).toStrictEqual({'id': '1', 'count': 2});
    };
    startHandler(event, context, callback)
});

test('start request limit reached', () => {
    const startHandler = start(dynamoMock);
    const event = {"body": `{\"userId\": \"2\"}`};
    const context = {};
    const callback = (error, reponse) => {
        const body = JSON.parse(reponse.body);
        expect(body.statusCode).toBe(403);
        expect(body.message).toBe(limitReachedMsg);
    };
    startHandler(event, context, callback)
});
