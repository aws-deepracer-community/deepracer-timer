const os = require('os'),
    ip = require('ip'),
    fs = require('fs'),
    express = require('express');

const port = process.env.PORT || '3000';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const sockets = {};

// express
app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', function (req, res) {
    let host = os.hostname();
    res.render('index.ejs', {host: host, port: port, server: ip.address()});
});

app.get('/lap', function (req, res) {
    io.sockets.emit('lap', (Math.random() * 100000));
    return res.status(200).json({result : true});
});

// sockets
io.on('connection', function(socket) {
    console.log('connection : ', socket.id);
    sockets[socket.id] = socket;

    socket.on('disconnect', function() {
        console.log('disconnect : ', socket.id);
        delete sockets[socket.id];

        // no more sockets
        if (Object.keys(sockets).length == 0) {
            app.set('watchingFile', false);
            fs.unwatchFile('./static/qr.jpg');
            fs.unwatchFile('./static/qr.json');
        }
    });

    socket.on('start-stream', function() {
        console.log('start-stream : ', socket.id);
    });
});

// http
http.listen(port, function () {
    console.log(`Listening on port ${port}!`);
});
