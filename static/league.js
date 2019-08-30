/**
 * league.js
 */

let lb_title = document.querySelector('.lb-title');
let lb_items = document.querySelector('.lb-items');

let items = [];

function reload() {
    let url = '/leaderboard/' + league;
    // console.log(`reload ${url}`);
    $.ajax({
        url: url,
        type: 'get',
        success: function (res, status) {
            if (res) {
                reloaded(res);
                print(res);
            }
        }
    });
}

function reloaded(res) {
    let isNew = false;
    if (items.length > 0 && items.length !== res.items.length) {
        isNew = true;
    }

    let rank;
    let racerName;
    let lapTime;

    res.items.sort(compare);

    for (let i = 0; i < items.length; i++) {
        if (items[i].lapTime !== res.items[i].lapTime) {
            rank = i + 1;
            racerName = res.items[i].racerName;
            lapTime = res.items[i].lapTime;
            break;
        }
    }

    if (isNew && !racerName) {
        let j = res.items.length - 1;
        rank = res.items.length;
        racerName = res.items[j].racerName;
        lapTime = res.items[j].lapTime;
    }

    if (isNew || racerName) {
        console.log(`new ${isNew} ${rank} ${racerName} ${lapTime}`);
        scroll(rank);
        if (isNew) {
            popup('New Challenger!', rank, racerName, lapTime);
        } else {
            popup('New Record!', rank, racerName, lapTime);
        }
    }

    items = res.items;
}

function print(res) {
    clear(res.title);
    addRow('lb-header', 'Position', 'Name', 'Time')

    let rank = 0;
    res.items.forEach(function (item) {
        rank++;
        addRow('lb-row', rank, item.racerName, item.lapTime);
    });
}

function compare(a, b) {
    a2 = sec(a.lapTime);
    b2 = sec(b.lapTime);
    if (a2 < b2) {
        return -1;
    } else if (a2 > b2) {
        return 1;
    }
    return 0;
}

function sec(t) {
    var a = t.split(':');
    return ((+a[0]) * 60) + (+a[1]);
}

function clear(title) {
    lb_title.innerText = title;
    while (lb_items.lastChild) {
        lb_items.removeChild(lb_items.lastChild);
    }
}

function addRow(className, rank, racerName, lapTime) {
    let row = document.createElement('div');
    row.classList.add(className);
    row.classList.add(`lb-rank${rank}`);
    addText(row, rank);
    addText(row, racerName);
    addText(row, lapTime);
    lb_items.appendChild(row);
}

function addText(row, text) {
    let item = document.createElement('div');
    item.innerText = text;
    row.appendChild(item);
}

let socket = io();
socket.on('league', function (name) {
    console.log(`socket league ${name}`);
    reload();
});

$(function () {
    reload();
    setInterval(function () {
        reload();
    }, 10000);

    setInterval(function () {
        if (scroller >= -100) {
            scroller--;
        }
        if (scroller == 0) {
            scroll('up');
        }
        if (scroller == -100) {
            scroll('down');
        }
    }, 1000);
});

function popup(title, rank, racer, time) {
    document.querySelector('.pop-title').innerText = title;
    document.querySelector('.pop-time').innerText = time;

    let pop_racer = document.querySelector('.pop-racer');
    pop_racer.classList.add(`pop-racer${rank}`);
    pop_racer.innerText = racer;

    $('.pop-layer').fadeIn();

    setTimeout(function () {
        $('.pop-layer').fadeOut();
        pop_racer.classList.remove(`pop-racer${rank}`);
    }, 9000);
}

let scroller = 0;

function scroll(dir) {
    if (dir === 'up') {
        scroll_dir = 0;
        $('html, body').stop().animate({
            scrollTop: 0
        }, 1000);
    } else if (dir === 'down') {
        $('html, body').stop().animate({
            scrollTop: $('.lb-footer').offset().top
        }, 20000);
        scroller = 20;
    } else {
        if (dir > 3) {
            dir = dir - 3;
        }
        $('html, body').stop().animate({
            scrollTop: $(`.lb-rank${dir}`).offset().top
        }, 1000);
        scroller = 20;
    }
}
