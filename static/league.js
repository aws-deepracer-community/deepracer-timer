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
    let isNewRacer = false;
    if (items.length > 0 && items.length !== res.items.length) {
        isNewRacer = true;
    }

    let newRecordPos;
    let newRecordName;
    let newRecordTime;

    res.items.sort(compare);

    for (let i = 0; i < items.length; i++) {
        if (items[i].lapTime !== res.items[i].lapTime) {
            newRecordPos = i + 1;
            newRecordName = res.items[i].racerName;
            newRecordTime = res.items[i].lapTime;
            break;
        }
    }

    if (isNewRacer && !newRecordName) {
        let j = res.items.length - 1;
        newRecordPos = res.items.length;
        newRecordName = res.items[j].racerName;
        newRecordTime = res.items[j].lapTime;
    }

    if (isNewRacer || newRecordName) {
        console.log(`new ${isNewRacer} ${newRecordPos} ${newRecordName} ${newRecordTime}`);
    }

    items = res.items;
}

function print(res) {
    clear(res.title);
    addRow('lb-header', 'Position', 'Name', 'Time')

    let pos = 0;
    res.items.forEach(function (item) {
        pos++;
        addRow('lb-row', pos, item.racerName, item.lapTime);
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

function addRow(className, position, racerName, lapTime) {
    let row = document.createElement('div');
    row.classList.add(className);
    addText(row, position);
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
    }, 30000);
});
