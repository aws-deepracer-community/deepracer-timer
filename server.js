const os = require('os'),
    ip = require('ip'),
    fs = require('fs'),
    express = require('express');

const exec = require('child_process').exec;
const cron = require('cron').CronJob;

const port = process.env.PORT || '3000';
const scan_shell = process.env.SCAN_SHELL || '';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var sockets = {};

// express
app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', function (req, res) {
    let host = os.hostname();
    res.render('index.ejs', {host: host, port: port, server: ip.address()});
});

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
        startStreaming(io);
    });
});

http.listen(port, function () {
    console.log(`Listening on port ${port}!`);
});

function startStreaming(io) {
    if (app.get('watchingFile')) {
        io.sockets.emit('liveStream', 'image.jpg?_t=' + (Math.random() * 100000));
        io.sockets.emit('QR', 'qr.json?_t=' + (Math.random() * 100000));
        return;
    }

    console.log('Watching for changes...');

    app.set('watchingFile', true);

    fs.watchFile('./static/image.jpg', function() {
        io.sockets.emit('liveStream', 'image.jpg?_t=' + (Math.random() * 100000));
    });
    fs.watchFile('./static/qr.json', function() {
        io.sockets.emit('QR', 'qr.json?_t=' + (Math.random() * 100000));
    });
}

function scanJob() {
    const scan = exec(`${scan_shell}`);

    scan.stdout.on('data', data => {
        console.log(`scanned.`);
    });

    scan.stderr.on('data', data => {
        console.error(`failure.`);
    });
}

const job = new cron({
    cronTime: '*/3 * * * * *',
    onTick: function() {
        scanJob();
    },
    start: false,
    timeZone: 'Asia/Seoul'
});

if (scan_shell) {
    job.start();
}
