// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  let options = {
    uri: apiurl,
    method: 'POST',
    body: req.body,
    json: true,
  };
  request.post(options, function (err, response, body) {
    console.log('times body res : ', body);

    io.sockets.emit('league', 'reload');
    if (response.statusCode < 200 || response.statusCode > 399) {
      return res.status(response.statusCode).json({});
    }
    return res.status(200).json({});
  })

  return {
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: `

`
  }
}
