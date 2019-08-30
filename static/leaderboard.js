/**
 * leaderboard.js
 */

let items = [];

function clear() {
    while (lb_items.lastChild) {
        lb_items.removeChild(lb_items.lastChild);
    }
}

function reload() {
    let url = '/leaderboard.json?league=' + league;
    $.ajax({
        url: url,
        type: 'get',
        success: function (res, status) {
            if (res) {
                items = res.items;
                print();
            }
        }
    });
}

function print() {
    clear();

    addRow('lb-header', 'Position', 'Name', 'Time')

    items.sort(compare);

    let pos = 0;
    items.forEach(function (e) {
        pos++;
        addRow('lb-row', pos, e.name, e.time);
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

$(function () {
    reload();
    setInterval(function () {
        reload();
    }, 1000);
});

let socket = io();
socket.on('leaderboard', function (name) {

});
