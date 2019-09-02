/**
 * league.js
 */

let lb_logo = document.querySelector('.lb-logo');
let lb_title = document.querySelector('.lb-title');
let lb_items = document.querySelector('.lb-items');

let items = [];

function reload() {
    let url = '/times/' + league;
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
    if (items.length > 0 && items.length < res.items.length) {
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
    clear(res.logo, res.title);

    addRow('lb-header', 'Rank', 'Name', 'Time')

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
    let a = t.split(':');
    return ((+a[0]) * 60) + (+a[1]);
}

function clear(logo, title) {
    if (logo && logo !== '') {
        lb_logo.innerHTML = `<img src="${logo}">`;
    }

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
        if (scroller > -600) {
            scroller--;
        }
        if (scroller == 0) {
            scroll('up');
        } else if (scroller == -100) {
            scroll('down');
        }
    }, 1000);
});

function popup(title, rank, racer, time) {
    document.querySelector('.pop-title').innerText = title;
    document.querySelector('.pop-time').innerText = time;

    let pop_racer = document.querySelector('.pop-racer');
    pop_racer.classList.add(`pop-rank${rank}`);
    pop_racer.innerText = racer;

    $('.pop-layer').fadeIn();

    setTimeout(function () {
        $('.pop-layer').fadeOut();
        pop_racer.classList.remove(`pop-rank${rank}`);
    }, 9000);
}

let scroller = 0;

function scroll(dir) {
    let top = 0;
    let speed = 1000;

    if (dir === 'up') {
        top = 0;
        speed = 1000;
        scroller = 0;
    } else if (dir === 'down') {
        top = $('.lb-footer').offset().top;
        speed = 50000;
        scroller = 30;
    } else {
        if (dir > 3) {
            dir = dir - 3;
            top = $(`.lb-rank${dir}`).offset().top;
            scroller = 20;
        } else {
            top = 0;
            scroller = 0;
        }
    }

    $('html, body').stop().animate({
        scrollTop: top
    }, speed);
}
