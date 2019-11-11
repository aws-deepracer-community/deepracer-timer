// learn more about WebSocket functions here: https://arc.codes/primitives/ws
let arc = require('@architect/functions');

exports.handler = async function ws(req) {
  console.log('default', JSON.stringify(req, null, 2));

  let id = req.requestContext.connectionId;
  let body = JSON.parse(req.body);
  let text = `${body.text}`;

  await arc.ws.send({
    id: id,
    payload: {
      text
    }
  });

  return {
    statusCode: 200
  }
}
