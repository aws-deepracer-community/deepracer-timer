/**
 * submit.js
 */

let lb_logo = document.querySelector('.lb-logo');
let lb_title = document.querySelector('.lb-title');

let lb_email = document.querySelector('.lb-email');
let lb_name = document.querySelector('.lb-name');
let lb_time = document.querySelector('.lb-time');

let items = [];

function reload() {
    let url = '/times/' + league;
    $.ajax({
        url: url,
        type: 'get',
        success: function (res, status) {
            if (res) {
                clear(res.logo, res.title);
            }
        },
    });
}

$(function () {
    reload();
});

function validateEmail(val) {
    var re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
}

function validateTime(val) {
    var re = /^([0-9]{2}\:[0-9]{2}\.[0-9]{3})$/;
    return re.test(val);
}

let lb_email_valid = false;
let lb_name_valid = false;
let lb_time_valid = false;

function clear(logo, title) {
    if (logo && logo !== '') {
        lb_logo.innerHTML = `<img src="${logo}">`;
    }

    lb_title.innerText = title;

    lb_email.value = '';
    lb_name.value = '';
    lb_time.value = '';
}

function submit() {
    if (!lb_email_valid || !lb_name_valid || !lb_time_valid) {
        return;
    }

    let url = '/times';
    let data = {
        league: league,
        email: lb_email.value,
        racerName: lb_name.value,
        lapTime: lb_time.value,
    };

    console.log('req', data);

    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=UTF-8',
        success: function (res, status) {
            console.log('res', res);
            if (res) {
                popup('Saved.');

                lb_email.value = '';
                lb_name.value = '';
                lb_time.value = '';

                // reload();
            }
        },
        dataType: 'json',
    });
}

function popup(message) {
    document.querySelector('.pop-message').innerText = message;

    $('.pop-layer').fadeIn();

    setTimeout(function () {
        $('.pop-layer').fadeOut();
    }, 3000);
}

function setColor(e, b) {
    if (b) {
        e.classList.add('text_normal');
        e.classList.remove('text_red');
    } else {
        e.classList.remove('text_normal');
        e.classList.add('text_red');
    }
}

document.getElementById('lb-email').addEventListener('keyup', function (event) {
    if (validateEmail(lb_email.value)) {
        lb_email_valid = true;
    } else {
        lb_email_valid = false;
    }
    setColor(lb_email, lb_email_valid);
});

document.getElementById('lb-name').addEventListener('keyup', function (event) {
    if (lb_name.value !== '') {
        lb_name_valid = true;
    } else {
        lb_name_valid = false;
    }
});

document.getElementById('lb-time').addEventListener('keyup', function (event) {
    if (validateTime(lb_time.value)) {
        lb_time_valid = true;
    } else {
        lb_time_valid = false;
    }
    setColor(lb_time, lb_time_valid);
});

document.getElementById('lb-btn-submit').addEventListener('click', function (event) {
    submit();
});
