const start = require('./start');

const SUCCESS_ID = 'z1ha';
const SUCCESS_RESPONSE = {'Item': 1};

const dynamoMock = {
    get: (params, callback) => {
        if (params.Key.id === SUCCESS_ID) {
            callback(null, SUCCESS_RESPONSE)
        } else {
            callback(true, null)
        }
    }
};

test('start request success', () => {
    const startHandler = start(dynamoMock);
    const event = {"body": `{\"userId\": \"${SUCCESS_ID}\"}`};
    const context = {};
    const callback = (error, reponse) => {
        expect(reponse.body).toBe(SUCCESS_RESPONSE.Item);
    };
    startHandler(event, context, callback)
});
