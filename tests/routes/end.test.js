const { end, LIMIT_REACHED_ERROR } = require('../../src/routes/end');
const { CONDITION_EXCEPTION } = require('../../src/dynamodb');

const dynamoMock = {
  update: (params, callback) => {
    if (params.Key.id === '1') {
      callback(null, { Attributes: { streamCount: 2 } });
    } else if (params.Key.id === '2') {
      callback({ code: CONDITION_EXCEPTION }, null);
    } else {
      callback(true, null);
    }
  },
};

test('end request success', () => {
  const endHandler = end(dynamoMock);
  const event = { body: '{"userId": "1"}' };
  const context = {};
  const callback = (error, reponse) => {
    expect(JSON.parse(reponse.body)).toStrictEqual({ streamCount: 2 });
  };
  endHandler(event, context, callback);
});

test('end request limit reached', () => {
  const endHandler = end(dynamoMock);
  const event = { body: '{"userId": "2"}' };
  const context = {};
  const callback = (error, reponse) => {
    const body = JSON.parse(reponse.body);
    expect(reponse.statusCode).toBe(403);
    expect(body.message).toBe(LIMIT_REACHED_ERROR);
  };
  endHandler(event, context, callback);
});
