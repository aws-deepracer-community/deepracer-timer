#!/bin/bash

SHELL_DIR=$(dirname $0)

CMD=$1

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
  pushd ${SHELL_DIR}

  sudo pm2 stop server.js

  popd
}

_start() {
  pushd ${SHELL_DIR}

  sudo pm2 start server.js

  popd
}

_status() {
  sudo pm2 list
}

_log() {
  sudo pm2 logs
}

_init() {
  command -v node >/dev/null || NODEJS="false"
  if [ "${NODEJS}" == "false" ]; then
    sudo curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    sudo apt install -y nodejs
  fi

  command -v pm2 >/dev/null || PM2="false"
  if [ "${PM2}" == "false" ]; then
    sudo npm install pm2 -g
  fi

  pushd ${SHELL_DIR}
  git pull
  npm run build
  popd
}

_hangul() {
  sudo apt install -y ibus ibus-hangul fonts-unfonts-core
}

case ${CMD} in
init)
  _stop
  _init
  _start
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
status)
  _status
  ;;
log)
  _log
  ;;
hangul | korean)
  _hangul
  ;;
*)
  _usage
  ;;
esac
