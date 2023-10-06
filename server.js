const request = require('request');
const express = require('express');
const gpio = require('rpi-gpio');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const sockets = {};

const port = process.env.PORT || '3000';

const apiurl = process.env.API_URL || 'https://dev-api-league.nalbam.com/league';

// express
app.use(express.json())
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index.ejs', {});
});

app.get('/league/:league', function (req, res) {
  const league = req.params.league;
  res.render('league.ejs', {
    league: league
  });
});

app.get('/submit/:league', function (req, res) {
  const league = req.params.league;
  res.render('submit.ejs', {
    league: league,
  });
});

app.get('/times/:league', function (req, res) {
  const league = req.params.league;
  const options = {
    uri: apiurl,
    qs: {
      league: league,
    }
  };
  request(options, function (err, response, body) {
    if (response.statusCode < 200 || response.statusCode > 399) {
      return res.status(response.statusCode).json({});
    }
    return res.status(200).json(JSON.parse(body));
  })
});

app.post('/times', function (req, res) {
  console.log('times req : ', req.body);

  let options = {
    uri: apiurl,
    method: 'POST',
    body: req.body,
    json: true,
  };
  request.post(options, function (err, response, body) {
    console.log('times res : ', body);

    io.sockets.emit('league', 'reload');
    if (response.statusCode < 200 || response.statusCode > 399) {
      return res.status(response.statusCode).json({});
    }
    return res.status(200).json({});
  })
});

app.get('/timer', function (req, res) {
  res.render('timer.ejs', {});
});

app.get('/timer/:name', function (req, res) {
  const name = req.params.name;
  io.sockets.emit('timer', `${name}`);
  return res.status(200).json({
    result: true,
    timer: name,
  });
});

app.get('/reward', function (req, res) {
  console.log('reward req : ', req.body);

  return res.status(200).json({
    result: true,
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

  socket.on('league', function (name) {
    console.log('league : ', socket.id, name);
    io.sockets.emit('league', `${name}`);
  });
});

// http
http.listen(port, function () {
  console.log(`Listening on port ${port}!`);
});

// gpio
gpio.on('change', function (channel, value) {
  console.log(`Channel ${channel} value is now ${value} \t- ${(Math.random() * 100000)}`);
  switch (channel) {
    case 11:
    case 13:
      io.sockets.emit('timer', 'press');
      break;
  }
});
gpio.setup(11, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(13, gpio.DIR_IN, gpio.EDGE_BOTH);
