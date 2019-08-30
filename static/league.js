/**
 * league.js
 */

let lb_title = document.querySelector('.lb-title');
let lb_items = document.querySelector('.lb-items');

let items = [];

function clear() {
    while (lb_items.lastChild) {
        lb_items.removeChild(lb_items.lastChild);
    }
}

function reload() {
    let url = '/leaderboard/' + league;
    console.log(`reload ${url}`);
    $.ajax({
        url: url,
        type: 'get',
        success: function (res, status) {
            if (res) {
                print(res);
            }
        }
    });
}

function print(res) {
    items = res;

    clear();

    addRow('lb-header', 'Position', 'Name', 'Time')

    items.sort(compare);

    let pos = 0;
    items.forEach(function (item) {
        pos++;
        addRow('lb-row', pos, item.name, item.time);
    });
}

function compare(a, b) {
    a2 = sec(a.time);
    b2 = sec(b.time);
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

function addRow(className, position, name, time) {
    let row = document.createElement('div');
    row.classList.add(className);
    addText(row, position);
    addText(row, name);
    addText(row, time);
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
});
