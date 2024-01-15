# NI cDAQ

Current implementation is base on `nidaqmx-python` librairy which requires the installation of the `NI-DAQmx driver`.

Once the driver installed:
```
python -m pip install nidaqmx
```

## Node to implement

- Todo [Connect]: display which DAQ to connect to and which sensor
- Todo [Connect sensor]: Base on the sensor type, add a analog or digital channel type like "add_ai_thrmcpl_chan("{device}/{channel}") 
- Todo: explore grpc serverk
- Todo: Custom Scale that specifies a conversion from the pre-scaled units measured by a channel to the scaled units associated with the sensor
    - Linear scale
    - Map range
    - Polynomial
    - Table
- Read stream 
- Write stream 



