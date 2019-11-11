// learn more about HTTP functions here: https://arc.codes/primitives/http
let arc = require('@architect/functions')
let static = arc.http.helpers.static

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
  <title>DeepRacer</title>
  <link rel="icon" href="${static('/favicon.ico')}" type="image/x-icon" />
  <link rel="shortcut icon" href="${static('/favicon.ico')}" type="image/x-icon" />
  <link rel="stylesheet" href="${static('/index.css')}">
  <link rel="stylesheet" href="${static('/flip.css')}">
</head>

<body>
  <figure class="lb-logo">
    <div class="flip-container">
      <div class="flip-body">
        <div class="face front">
          <div class="lb-logo-front"><img
              src="https://deepracer-logos.s3.ap-northeast-2.amazonaws.com/logo_circuit_challenge.png">
          </div>
        </div>
        <div class="face back">
          <div class="lb-logo-back"><img
              src="https://deepracer-logos.s3.ap-northeast-2.amazonaws.com/logo_deepracer.png"></div>
        </div>
      </div>
    </div>
  </figure>
</body>

</html>

<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="${static('/flip.js')}"></script>
<script>
  $(function () {
    setInterval(function () {
      flip();
    }, 5000);
  });
</script>
`
  }
}
