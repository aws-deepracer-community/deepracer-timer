#!/bin/bash

SHELL_DIR=$(dirname $0)

CMD=${1:-init}

CONFIG=~/.deepracer-timer
touch ${CONFIG}
. ${CONFIG}

command -v tput > /dev/null || TPUT=false

_echo() {
    if [ -z ${TPUT} ] && [ ! -z $2 ]; then
        echo -e "$(tput setaf $2)$1$(tput sgr0)"
    else
        echo -e "$1"
    fi
}

_read() {
    if [ -z ${TPUT} ]; then
        read -p "$(tput setaf 6)$1$(tput sgr0)" ANSWER
    else
        read -p "$1" ANSWER
    fi
}

_result() {
    _echo "# $@" 4
}

_command() {
    _echo "$ $@" 3
}

_success() {
    _echo "+ $@" 2
    exit 0
}

_error() {
    _echo "- $@" 1
    exit 1
}

_stop() {
    PID=$(ps -ef | grep node | grep server[.]js | head -1 | awk '{print $2}' | xargs)
    if [ "${PID}" != "" ]; then
        _command "kill -9 ${PID}"
        kill -9 ${PID}
    fi
}

_start() {
    pushd ${SHELL_DIR}

    rm -rf nohup.out

    _command "nohup node server.js &"
    nohup node server.js &

    PID=$(ps -ef | grep node | grep server[.]js | head -1 | awk '{print $2}' | xargs)
    if [ "{PID}" != "" ]; then
        _result "deepracer-timer started: ${PID}"
    fi

    popd
}

_config_read() {
    if [ -z ${SCAN_SHELL} ]; then
        _read "SCAN_SHELL [${SCAN_SHELL}]: " "${SCAN_SHELL}"
        if [ ! -z ${ANSWER} ]; then
            SCAN_SHELL="${ANSWER}"
        fi
    fi

    export SCAN_SHELL="${SCAN_SHELL}"
}

_config_save() {
    echo "# deepracer-timer config" > ${CONFIG}
    echo "export SCAN_SHELL=${SCAN_SHELL}" >> ${CONFIG}

    cat ${CONFIG}
}

_init() {
    pushd ${SHELL_DIR}
    git pull
    npm run build
    popd
}

_config_read
_config_save

case ${CMD} in
    init)
        _stop
        _init
        _start
        ;;
    start)
        _stop
        _start
        ;;
    stop)
        _stop
        ;;
esac
