#!/bin/bash

SHELL_DIR=$(dirname $0)

CMD=${1}

command -v tput >/dev/null || TPUT=false

_bar() {
  _echo "================================================================================"
}

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

_pid() {
  PID=$(ps -ef | grep node | grep " server[.]js" | head -1 | awk '{print $2}' | xargs)
}

################################################################################

_usage() {
  _bar
  echo "     _                                            _   _                      "
  echo "  __| | ___  ___ _ __  _ __ __ _  ___ ___ _ __   | |_(_)_ __ ___   ___ _ __  "
  echo " / _  |/ _ \/ _ \ '_ \| '__/ _' |/ __/ _ \ '__|  | __| | '_ ' _ \ / _ \ '__| "
  echo "| (_| |  __/  __/ |_) | | | (_| | (_|  __/ |     | |_| | | | | | |  __/ |    "
  echo " \__,_|\___|\___| .__/|_|  \__,_|\___\___|_|      \__|_|_| |_| |_|\___|_|    "
  echo "                |_|                                                          "
  _bar
  echo " Usage: ./$(basename $0) {init|status|start|restart|stop|log} "
  _bar
  _status
  _bar
}

_stop() {
  _pid

  if [ "${PID}" != "" ]; then
    _command "kill -9 ${PID}"
    kill -9 ${PID}

    _result "deepracer-timer is killed: ${PID}"
  fi
}

_status() {
  _pid

  if [ "${PID}" != "" ]; then
    _result "deepracer-timer was started: ${PID}"
  else
    _result "deepracer-timer is stopped"
  fi
}

_start() {
  _pid

  if [ "${PID}" != "" ]; then
    _error "deepracer-timer has already started: ${PID}"
  fi

  pushd ${SHELL_DIR}

  echo "# _start" >nohup.out
  _command "nohup node server.js &"
  nohup node server.js &

  popd

  _pid

  if [ "${PID}" != "" ]; then
    _result "deepracer-timer was started: ${PID}"
  fi
}

_init() {
  pushd ${SHELL_DIR}
  git pull
  npm run build
  popd
}

_log() {
  tail -n 500 -f ${SHELL_DIR}/nohup.out
}

case ${CMD} in
init)
  _stop
  _init
  _start
  ;;
status)
  _status
  ;;
start)
  _start
  ;;
restart)
  _stop
  _start
  ;;
stop)
  _stop
  ;;
log)
  _log
  ;;
*)
  _usage
  ;;
esac
