// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
    const league = req.pathParameters.league;
    return {
        headers: {
            'content-type': 'text/html; charset=utf8'
        },
        body: `
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>DeepRacer Leaderboard</title>
    <link rel="icon" href="/_static/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="/_static/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/_static/league.css">
    <link rel="stylesheet" href="/_static/flip.css">
    <link rel="stylesheet" href="/_static/pop.css">
</head>

<body>
    <figure class="lb-logo">
        <div class="lb-logo-front"><img src="/_static/icon-trophy.png"></div>
    </figure>

    <h1 class="lb-title"></h1>

    <div class="lb-container">
        <div class="lb-items lb-initial">
            <div class="lb-header">
                <div>Rank</div>
                <div>Name</div>
                <div>Time</div>
            </div>
        </div>
    </div>

    <div class="pop-logo">
        <div class="pop-container">
            <div class="lb-logo-back"><img src="/_static/icon-trophy.png"></div>
        </div>
    </div>

    <div class="pop-layer">
        <div class="pop-bg"></div>
        <div class="pop-container">
            <div class="pop-title">New Record!</div>
            <div class="pop-racer">DeepRacer</div>
            <div class="pop-time">00:00.000</div>
        </div>
    </div>

    <footer class="lb-footer"></footer>
</body>

</html>

<script src="/_static/socket.io/socket.io.js"></script>
<script src="/_static/jquery-3.3.1.min.js"></script>
<script src="/_static/flip.js"></script>

<script>
    let league = '${league}';
</script>
<script src="/_static/league.js"></script>
`
    }
}
