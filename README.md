# deepracer-timer

* SEE: https://nalbam.github.io/2019/11/07/deepracer-timer-en.html

## Usage

```bash
git clone https://github.com/aws-deepracer-community/deepracer-timer.git
```

```
================================================================================
     _                                            _   _
  __| | ___  ___ _ __  _ __ __ _  ___ ___ _ __   | |_(_)_ __ ___   ___ _ __
 / _  |/ _ \/ _ \ '_ \| '__/ _' |/ __/ _ \ '__|  | __| | '_ ' _ \ / _ \ '__|
| (_| |  __/  __/ |_) | | | (_| | (_|  __/ |     | |_| | | | | | |  __/ |
 \__,_|\___|\___| .__/|_|  \__,_|\___\___|_|      \__|_|_| |_| |_|\___|_|
                |_|
================================================================================
 Usage: ./run.sh {init|status|start|restart|stop|log}
================================================================================
```

## Open with

* http://localhost:3000/timer (default timeout 4 minutes)
* http://localhost:3000/timer/3 (3 minute timeout)

## Screen

![screen](images/screen.png)

## Keymap

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

## Hardware

* [Thin Film Pressure Sensor, SF15-600](https://www.amazon.com/dp/B08SJ3722C/)
* [LM386 Sound Sensor](https://www.waveshare.com/sound-sensor.htm)
