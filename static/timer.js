class Stopwatch {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
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

    reset() {
        this.times = [ 0, 0, 0 ];
        this.pause();
        this.print();
    }

    restart() {
        this.reset();
        this.start();
    }

    pressure() {
        if (this.times[1] < 5) return;
        this.lap();
    }

    lap() {
        let times = this.times;
        let li = document.createElement('li');
        li.innerText = this.format(times);
        this.results.appendChild(li);
        this.restart();
    }

    clear() {
        // this.stop()
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
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }

    print() {
        this.display.innerText = this.format(this.times);
    }

    format(times) {
        return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}:\
${pad0(Math.floor(times[2]), 2)}`;
    }
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
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
        stopwatch.lap();
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
        stopwatch.lap();
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
