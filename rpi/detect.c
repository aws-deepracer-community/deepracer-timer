#include <stdio.h>
#include <wiringPi.h>

#define PIN 4

int main(void)
{
    if (wiringPiSetup() == -1)
    {
        return 1;
    }

    while (1)
    {
        int p = analogRead(PIN);

        printf("pressure: %d\n", p);

        delay(1000);
    }

    return 0;
}
