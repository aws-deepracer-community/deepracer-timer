// learn more about HTTP functions here: https://arc.codes/primitives/http
let arc = require('@architect/functions')
let static = arc.http.helpers.static

let getURL = require('./get-web-socket-url')

exports.handler = async function http(req) {
  return {
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: `
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>DeepRacer Timer</title>
    <link rel="icon" href="${static('/favicon.ico')}" type="image/x-icon" />
    <link rel="shortcut icon" href="${static('/favicon.ico')}" type="image/x-icon" />
    <link rel="stylesheet" href="${static('/timer.css')}">
</head>

<body>
<nav class="controls">
    <a href="#" id="btn_start" class="button btn_start">Start</a>
    <a href="#" id="btn_pause" class="button btn_pause">Pause</a>
    <a href="#" id="btn_passed" class="button btn_passed">Passed</a>
    <a href="#" id="btn_reset" class="button btn_reset">Reset</a>
    <a href="#" id="btn_clear" class="button btn_clear">Clear</a>
</nav>
<div class="limiter"></div>
<div class="display"></div>
<div class="bestlap"></div>
<ul class="results"></ul>

<script>
window.WS_URL = '${getURL()}'
</script>
<script type=module src="${static('/timer.mjs')}"></script>
</body>
</html>
`
  }
}
