class Stopwatch {
    constructor(limiter, display, bestlap, results) {
        this.limiter = limiter;
        this.display = display;
        this.bestlap = bestlap;
        this.results = results;
        this.clear();
    }

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
        this.running = false;
        this.time = null;
    }

    reset() {
        this.times = [0, 0, 0];
        this.print();
        this.pause();
    }

    restart() {
        this.reset();
        this.start();
    }

    passed() {
        if (this.times[0] >= 1 || this.times[1] >= 6) {
            this.record();
        }
        this.restart();
    }

    press() {
        var stamp = new Date().getTime();
        if (!this.pressed || (stamp - this.pressed) > 5000) {
            this.passed();
            this.pressed = new Date().getTime();
        } else {
            this.start();
        }
    }

    clear() {
        this.records = [];
        this.limit = [4, 0, 0];
        this.reset();
        this.bestlap.innerText = '';
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

        // limit
        this.limit[2] -= diff;
        if (this.limit[2] < 0) {
            this.limit[1] -= 1;
            this.limit[2] += 1000;
        }
        if (this.limit[1] < 0) {
            this.limit[0] -= 1;
            this.limit[1] += 60;
        }
        if (this.limit[0] < 0) {
            this.limit[0] = 0
            this.limit[1] = 0
            this.limit[2] = 0
            this.pause();
            return;
        }

        // times
        this.times[2] += diff;
        if (this.times[2] >= 1000) {
            this.times[1] += 1;
            this.times[2] -= 1000;
        }
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
        if (this.times[0] >= 60) {
            this.times[0] -= 60
        }
    }

    print() {
        this.limiter.innerText = this.format(this.limit);
        this.display.innerText = this.format(this.times);

        if (this.limit[0] <= 0 && this.limit[1] <= 30) {
            this.limiter.classList.add("limiter_red");
            this.limiter.classList.remove("limiter_yellow");
            this.limiter.classList.remove("limiter_normal");
        } else if (this.limit[0] <= 0 && this.limit[1] <= 60) {
            this.limiter.classList.add("limiter_yellow");
            this.limiter.classList.remove("limiter_normal");
            this.limiter.classList.remove("limiter_red");
        } else {
            this.limiter.classList.add("limiter_normal");
            this.limiter.classList.remove("limiter_yellow");
            this.limiter.classList.remove("limiter_red");
        }
    }

    record() {
        let li = document.createElement('li');
        li.innerText = this.format(this.times);
        this.results.appendChild(li);

        this.records.push(this.times);
        this.records.sort(compare);
        this.bestlap.innerText = this.format(this.records[0]);
    }

    format(times) {
        return `${lpad(times[0], 2)}:${lpad(times[1], 2)}.${lpad(Math.floor(times[2]), 3)}`;
    }
}

function compare(a, b) {
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

function lpad(value, count) {
    var result = '000' + value.toString();
    return result.substr(result.length - count);
}

let stopwatch = new Stopwatch(
    document.querySelector('.limiter'),
    document.querySelector('.display'),
    document.querySelector('.bestlap'),
    document.querySelector('.results')
);

let socket = io();
socket.on('call', function (name) {
    if (name === 'start') {
        stopwatch.start();
    } else if (name === 'pause') {
        stopwatch.pause();
    } else if (name === 'passed') {
        stopwatch.passed();
    } else if (name === 'press') {
        stopwatch.press();
    } else if (name === 'reset') {
        stopwatch.reset();
    } else if (name === 'clear') {
        stopwatch.clear();
    }
});

function call(name) {
    socket.emit('call', name);
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 13) {
        call('passed'); // Enter
    } else if (event.keyCode == 81) {
        call('start'); // q
    } else if (event.keyCode == 87) {
        call('pause'); // w
    } else if (event.keyCode == 69) {
        call('passed'); // e
    } else if (event.keyCode == 82) {
        call('reset'); // r
    } else if (event.keyCode == 84) {
        call('clear'); // t
    }
});
