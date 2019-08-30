const os = require('os'),
    express = require('express');

const gpio = require('rpi-gpio');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const sockets = {};

const port = process.env.PORT || '3000';

// express
app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', function (req, res) {
    let host = os.hostname();
    res.render('index.ejs', {
        host: host,
        port: port
    });
});

app.get('/leaderboard/:league', function (req, res) {
    const league = req.params.league;
    let host = os.hostname();
    res.render('leaderboard.ejs', {
        league: league
    });
});

app.get('/timer/:name', function (req, res) {
    const name = req.params.name;
    io.sockets.emit('timer', `${name}`);
    return res.status(200).json({
        result: true,
        timer: name
    });
});

// sockets
io.on('connection', function (socket) {
    console.log('connection : ', socket.id);
    sockets[socket.id] = socket;

    socket.on('disconnect', function () {
        console.log('disconnect : ', socket.id);
        delete sockets[socket.id];

        // no more sockets
        if (Object.keys(sockets).length == 0) {
            console.log('no more sockets.');
        }
    });

    socket.on('timer', function (name) {
        console.log('timer : ', socket.id, name);
        io.sockets.emit('timer', `${name}`);
    });
});

// http
http.listen(port, function () {
    console.log(`Listening on port ${port}!`);
});

// gpio
gpio.on('change', function (channel, value) {
    console.log(`Channel ${channel} value is now ${value} \t- ${(Math.random() * 100000)}`);
    if (channel === 7) {
        io.sockets.emit('timer', 'press');
    } else if (channel === 37) {
        io.sockets.emit('timer', 'start');
    } else if (channel === 35) {
        io.sockets.emit('timer', 'pause');
    } else if (channel === 33) {
        io.sockets.emit('timer', 'passed');
    } else if (channel === 31) {
        io.sockets.emit('timer', 'reset');
    } else if (channel === 29) {
        io.sockets.emit('timer', 'clear');
    }
});
gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);
// gpio.setup(29, gpio.DIR_IN, gpio.EDGE_BOTH);
// gpio.setup(31, gpio.DIR_IN, gpio.EDGE_BOTH);
// gpio.setup(33, gpio.DIR_IN, gpio.EDGE_BOTH);
// gpio.setup(35, gpio.DIR_IN, gpio.EDGE_BOTH);
// gpio.setup(37, gpio.DIR_IN, gpio.EDGE_BOTH);
