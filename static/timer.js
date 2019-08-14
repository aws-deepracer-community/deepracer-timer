class Stopwatch {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.pressed = false;
        this.laps = [];
        this.reset();
    }

    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    pause() {
        this.running = false;
        this.time = null;
    }

    record() {
        let li = document.createElement('li');
        li.innerText = this.format(this.times);
        this.results.appendChild(li);
    }

    reset() {
        this.times = [ 0, 0, 0 ];
        this.pause();
        this.print();
    }

    restart() {
        this.reset();
        this.start();
    }

    passed() {
        if (this.times[1] >= 5) {
            this.record();
        }
        this.restart();
    }

    press() {
        stamp = new Date().getTime();
        if (!this.pressed || (stamp - this.pressed) > 3000) {
            this.passed();
            this.pressed = new Date().getTime();
        } else {
            this.start();
        }
    }

    clear() {
        this.reset();
        clearChildren(this.results);
    }

    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }

    calculate(timestamp) {
        var diff = timestamp - this.time;
        // ms
        this.times[2] += diff;
        // 1 sec == 1000 ms
        if (this.times[2] >= 1000) {
            this.times[1] += 1;
            this.times[2] -= 1000;
        }
        // 1 min == 60 sec
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
        if (this.times[0] >= 60) {
            this.times[0] -= 60
        }
    }

    print() {
        this.display.innerText = this.format(this.times);
    }

    format(times) {
        return `${lpad(times[0], 2)}:${lpad(times[1], 2)}.${lpad(Math.floor(times[2]), 3)}`;
    }
}

function lpad(value, count) {
    var result = '000' + value.toString();
    return result.substr(result.length - count);
}

function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
    document.querySelector('.stopwatch'),
    document.querySelector('.results')
);

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        // Enter
        stopwatch.passed();
    }
    else if (event.keyCode == 81) {
        // q
        stopwatch.start();
    }
    else if (event.keyCode == 87) {
        // w
        stopwatch.pause();
    }
    else if (event.keyCode == 69) {
        // e
        stopwatch.passed();
    }
    else if (event.keyCode == 82) {
        // r
        stopwatch.reset();
    }
    else if (event.keyCode == 84) {
        // t
        stopwatch.clear();
    }
});

var socket = io();
socket.on('start', function() {
    stopwatch.start();
});
socket.on('pause', function() {
    stopwatch.pause();
});
socket.on('passed', function() {
    stopwatch.passed();
});
socket.on('press', function() {
    stopwatch.press();
});
socket.on('reset', function() {
    stopwatch.reset();
});
socket.on('clear', function() {
    stopwatch.clear();
});
