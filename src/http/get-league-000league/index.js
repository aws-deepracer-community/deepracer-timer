// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  const league = req.pathParameters.league;
  return {
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: `ok: ${league}`
  }
}
