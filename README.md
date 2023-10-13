# deepracer-timer

* SEE: https://nalbam.github.io/2019/11/07/deepracer-timer-en.html

## usage

```bash
./run.sh init
./run.sh start
./run.sh restart
./run.sh status
./run.sh stop
```

## open with

* http://localhost:3000/timer (default timeout 4 minutes)
* http://localhost:3000/timer/3 (3 minute timeout)

## screen

![screen](images/screen.png)

## keymap

| Action  | Key | Description |
| ------- | --- | ----------- |
| Start   |  Q  | Start the timer. |
| Pause   |  W  | Pause the timer. |
| Passed  |  E  | Record the lap time. |
| Reset   |  R  | Reset the timer to 0. |
| Clear   |  T  | Clear the timer and all lap times. |
| Drop    |  D  | Cancel the last lap time. |
| Reject  |  F  | Cancel the last lap time and merge it into the timer. |

## gpio

![GPIO](images/GPIO-Pinout-Diagram-2.png)

```text
VCC  : 1, 17
GND  : 6, 9, 14, 20, 25, 30, 34, 39
DOUT : 11, 13
```
