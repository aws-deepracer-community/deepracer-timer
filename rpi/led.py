import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(4, GPIO.OUT)


def blink():
    print("Starting blinking fever!")

    iteracion = 0

    while iteracion < 30:
        GPIO.output(4, True)    # On
        time.sleep(1)           # Wait one second
        GPIO.output(4, False)   # Off
        time.sleep(1)           # Wait one second
        iteracion = iteracion + 2  # Add 2 second, one for each blink

    print("I'm done!")

    GPIO.cleanup()  # Clean the GPIO


blink()  # Call the function
