/**
 * timer.js
 */

class Timer {
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
        if (this.times[0] > 0 || this.times[1] > 3) {
            this.record();
        }
        this.restart();
    }

    press() {
        var stamp = new Date().getTime();
        if (!this.pressed || (stamp - this.pressed) > 3000) {
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
        if (this.times[2] < 0) {
            this.times[2] = 0;
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

let timer = new Timer(
    document.querySelector('.limiter'),
    document.querySelector('.display'),
    document.querySelector('.bestlap'),
    document.querySelector('.results')
);

let socket = io();
socket.on('timer', function (name) {
    console.log(`socket timer ${name}`);
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
    }
});

function call(name) {
    socket.emit('timer', name);
}

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 49: // 1
        case 81: // q
        case 96: // 0 (Num Lock)
            call('start');
            break;
        case 50: // 2
        case 87: // w
        case 110: // . (Num Lock)
            call('pause');
            break;
        case 51: // 3
        case 69: // e
        case 97: // 1 (Num Lock)
            call('passed');
            break;
        case 52: // 4
        case 82: // r
        case 98: // 2 (Num Lock)
            call('reset');
            break;
        case 53: // 5
        case 84: // t
        case 99: // 3 (Num Lock)
            call('clear');
            break;
    }
});

function btn_listener(event) {
    switch (event.target.id) {
        case 'btn_start':
            // call('start');
            timer.start();
            break;
        case 'btn_pause':
            // call('pause');
            timer.pause();
            break;
        case 'btn_passed':
            // call('passed');
            timer.passed();
            break;
        case 'btn_reset':
            // call('reset');
            timer.reset();
            break;
        case 'btn_clear':
            // call('clear');
            timer.clear();
            break;
    }
}

document.getElementById('btn_start').addEventListener('click', btn_listener);
document.getElementById('btn_pause').addEventListener('click', btn_listener);
document.getElementById('btn_passed').addEventListener('click', btn_listener);
document.getElementById('btn_reset').addEventListener('click', btn_listener);
document.getElementById('btn_clear').addEventListener('click', btn_listener);
