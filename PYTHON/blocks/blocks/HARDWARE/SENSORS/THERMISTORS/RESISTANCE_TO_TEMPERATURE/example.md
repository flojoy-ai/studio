In this example, two measurements are extracted from an Arduino and plotted.

Here is a list of nodes to add:

- `OPEN_SERIAL`
- `SINGLE_MEASUREMENT_SERIAL` x2
- `VECTOR_INDEXING` x4
- `LINE` x2
- `RESISTANCE_TO_TEMPERATURE` x2
- `APPEND` x2
- `FEEDBACK` x2
- `LOOP`

Connect the nodes as seen in the example. Next set the number of loops to zero with the `LOOP` node parameters. Connect the 3 serial nodes to the desired serial device in the node parameters.

The `SINGLE_MEASUREMENT_SERIAL` should be returning two seperate measurements in the form of a `Vector`. Therefore, the `VECTOR_INDEXING` nodes should be set to 0 and 1 to extract the first and second measurements respectively (light intensity and temperature (in resistance)).

The `RESISTANCE_TO_TEMPERATURE` nodes convert the resistance of the thermistor to temperature.

The Arduino code used is:

```c
#define THERMISTORPIN A2
#define lightsensor A0
#define THERMISTORNOMINAL 10000
#define SERIESRESISTOR 10000


void setup(void) {
  Serial.begin(9600);
}

void loop(void) {
  uint8_t i;
  float reading;
  
  // convert the value to resistance
  reading = analogRead(THERMISTORPIN);
  reading = 1023 / reading - 1;
  reading = SERIESRESISTOR / reading;

  Serial.print(analogRead(lightsensor));
  Serial.print(",");
  Serial.println(reading);

  delay(40);
}
```
