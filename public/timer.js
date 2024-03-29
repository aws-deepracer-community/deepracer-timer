/**
 * timer.js
 */

class Timer {
  constructor(limiter, display, bestlap, lastlap, results, limit_min) {
    this.limiter = limiter;
    this.display = display;
    this.bestlap = bestlap;
    this.lastlap = lastlap;
    this.results = results;
    this.limit_min = limit_min;
    this.clear();
  }

  ding1 = new Audio('/sounds/ding1.mp3');
  ding2 = new Audio('/sounds/ding2.mp3');

  start() {
    if (!this.time) {
      this.time = performance.now();
    }
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.step.bind(this));
    }
  }

  pause() {
    this.time = null;
    this.running = false;
  }

  passed() {
    if (!this.running) {
      this.start();
    } else if (this.times[0] > 0 || this.times[1] > 2) {
      this.record();
    }
  }

  reset() {
    this.times = [0, 0, 0];
    this.print();
    this.pause();
  }

  clear() {
    if (this.running) {
      return;
    }
    this.records = [];
    this.limit = [this.limit_min, 0, 0];
    this.reset();

    this.bestlap.innerText = '';
    this.lastlap.innerText = '';
    while (this.results.lastChild) {
      this.results.removeChild(this.results.lastChild);
    }
  }

  step(timestamp) {
    if (!this.running) {
      return;
    }
    this.calculate(timestamp);
    this.time = timestamp;
    this.print();
    requestAnimationFrame(this.step.bind(this));
  }

  calculate(timestamp) {
    var diff = timestamp - this.time;

    // times
    this.times[2] += diff;
    if (this.times[2] >= 1000) {
      this.times[2] -= 1000;
      this.times[1] += 1;
    }
    if (this.times[1] >= 60) {
      this.times[1] -= 60;
      this.times[0] += 1;
    }
    if (this.times[0] >= 60) {
      this.times[0] -= 60;
    }
    if (this.times[2] < 0) {
      this.times[2] = 0;
    }
    if (this.times[0] === this.limit_min) {
      this.times[1] = 0;
      this.times[2] = 0;
    }

    // limit
    this.limit[2] -= diff;
    if (this.limit[2] < 0) {
      this.limit[2] += 1000;
      this.limit[1] -= 1;
    }
    if (this.limit[1] < 0) {
      this.limit[1] += 60;
      this.limit[0] -= 1;
    }
    if (this.limit[0] < 0) {
      this.limit[2] = 0;
      this.limit[1] = 0;
      this.limit[0] = 0;
      this.pause();
    }
  }

  print() {
    this.limiter.innerText = this.format(this.limit, 'short');
    this.display.innerText = this.format(this.times);

    if (this.limit[0] <= 0 && this.limit[1] <= 30) {
      this.limiter.classList.add('limiter_red');
      this.limiter.classList.remove('limiter_yellow');
      this.limiter.classList.remove('limiter_normal');
    } else if (this.limit[0] <= 0 && this.limit[1] <= 60) {
      this.limiter.classList.add('limiter_yellow');
      this.limiter.classList.remove('limiter_normal');
      this.limiter.classList.remove('limiter_red');
    } else {
      this.limiter.classList.add('limiter_normal');
      this.limiter.classList.remove('limiter_yellow');
      this.limiter.classList.remove('limiter_red');
    }
  }

  record() {
    console.log(`record ${this.format(this.times)}`);

    // Save the lap time
    this.records.push(this.times);

    let li = document.createElement('li');
    li.innerText = this.format(this.times);
    this.results.appendChild(li);

    this.times = [0, 0, 0];

    this.findone();
  }

  drop() {
    if (this.records.length === 0) {
      return;
    }

    console.log(`drop ${this.results.lastChild.innerText}`);

    // Cancel the last lap time
    this.records.splice(this.records.length - 1, 1);

    this.results.removeChild(this.results.lastChild);

    this.findone();
  }

  reject() {
    if (this.records.length === 0) {
      return;
    }

    let latest = this.records[this.records.length - 1];

    console.log(`reject ${this.format(latest)}`);

    this.pause();

    // Merge last lap time into the timer
    this.times[2] += latest[2];
    this.times[1] += latest[1];
    this.times[0] += latest[0];
    if (this.times[2] >= 1000) {
      this.times[2] -= 1000;
      this.times[1] += 1;
    }
    if (this.times[1] >= 60) {
      this.times[1] -= 60;
      this.times[0] += 1;
    }
    if (this.times[0] >= 60) {
      this.times[0] -= 60;
    }
    if (this.times[2] < 0) {
      this.times[2] = 0;
    }

    // Cancel the last lap time
    this.records.splice(this.records.length - 1, 1);

    this.results.removeChild(this.results.lastChild);

    this.findone();

    this.start();
  }

  findone() {
    if (this.records.length === 0) {
      return;
    }

    let sorted = this.records.slice();
    sorted.sort(this.compare);

    let prebest = this.bestlap.innerText;
    let nowbest = `Best: ${this.format(sorted[0])}`;

    if (prebest != nowbest) {
      this.bestlap.innerText = nowbest;
      this.blink('.bestlap');

      this.ding1.loop = false;
      this.ding1.play();
    } else {
      this.ding2.loop = false;
      this.ding2.play();
    }

    this.lastlap.innerText = `Last: ${this.format(this.records[this.records.length - 1])}`;
    this.blink('.lastlap');
  }

  blink(name) {
    document.querySelector(name).classList.add('blink');
    setTimeout(function () {
      document.querySelector(name).classList.remove('blink');
    }, 1000);
  }

  format(times, type = 'long') {
    if (type === 'short') {
      return `${this.lpad(times[0], 2)}:${this.lpad(times[1], 2)}`;
    }
    return `${this.lpad(times[0], 2)}:${this.lpad(times[1], 2)}.${this.lpad(Math.floor(times[2]), 3)}`;
  }

  compare(a, b) {
    if (a[0] < b[0]) {
      return -1;
    } else if (a[0] > b[0]) {
      return 1;
    }
    if (a[1] < b[1]) {
      return -1;
    } else if (a[1] > b[1]) {
      return 1;
    }
    if (a[2] < b[2]) {
      return -1;
    } else if (a[2] > b[2]) {
      return 1;
    }
    return 0;
  }

  lpad(value, count) {
    var result = '000' + value.toString();
    return result.substr(result.length - count);
  }
}

let timer = new Timer(
  document.querySelector('.limiter'),
  document.querySelector('.display'),
  document.querySelector('.bestlap'),
  document.querySelector('.lastlap'),
  document.querySelector('.results'),
  parseInt(min)
);

// ** socket.io //

let socket = io();

socket.on('timer', function (name) {
  console.log(`socket timer ${name}`);
  exec(name);
});

function send(name) {
  socket.emit('timer', name);
}

// ** socket.io //

function exec(name) {
  switch (name) {
    case 'start':
      timer.start();
      break;
    case 'pause':
      timer.pause();
      break;
    case 'passed':
      timer.passed();
      break;
    case 'press':
      timer.press();
      break;
    case 'reset':
      timer.reset();
      break;
    case 'clear':
      timer.clear();
      break;
    case 'drop':
      timer.drop();
      break;
    case 'reject':
      timer.reject();
      break;
  }
}

let key_map = {
  '81': 'start', // q
  '87': 'pause', // w
  '69': 'passed', // e
  '82': 'reset', // r
  '84': 'clear', // t
  '68': 'drop', // d
  '70': 'reject', // f
};

document.addEventListener('keydown', function (event) {
  send(key_map[event.keyCode]);
});

function btn_listener(event) {
  exec(event.target.id.substring(4));
}

document.getElementById('btn_start').addEventListener('click', btn_listener);
document.getElementById('btn_pause').addEventListener('click', btn_listener);
document.getElementById('btn_passed').addEventListener('click', btn_listener);
document.getElementById('btn_reset').addEventListener('click', btn_listener);
document.getElementById('btn_clear').addEventListener('click', btn_listener);
document.getElementById('btn_drop').addEventListener('click', btn_listener);
document.getElementById('btn_reject').addEventListener('click', btn_listener);
