FROM python:3.11.9-slim-bookworm

RUN apt-get update && apt-get install -y gcc libgpiod2

RUN pip install adafruit-circuitpython-dht RPi.GPIO requests

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

CMD ["python", "-u", "humidity.py"]