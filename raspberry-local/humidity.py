import adafruit_dht
import board
from time import sleep

from req import Req

# Initialize the DHT sensor
dht_device = adafruit_dht.DHT22(board.D4)

while True:
    try:
        # Read the humidity and temperature from the sensor
        temperature = dht_device.temperature
        humidity = dht_device.humidity

        if humidity is not None and temperature is not None:
            print("Temp={0:0.1f}*C  Humidity={1:0.1f}%".format(temperature, humidity))
            Req(format(temperature, '.1f'), format(humidity, '.1f'))
        else:
            print("Failed to retrieve data from humidity sensor")
    except RuntimeError as error:
        # Errors happen fairly often with DHT sensors, just print the error and retry
        print(error.args[0])
    except Exception as error:
        dht_device.exit()
        raise error

    # Sleep for 15 minutes (900 seconds) before taking another reading
    sleep(900)