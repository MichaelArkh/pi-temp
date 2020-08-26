from datetime import datetime
import json
import requests


class Req:
    def __init__(self, temp: float, humidity: float):
        self.temperature = temp
        self.humidity = humidity
        self.save()

    def save(self):
        # ROOM_ID is the corresponding table.
        with open('settings.json') as f:
            data = json.load(f)
            req = requests.post(data['API_LINK'], json={
                "token": data['API_TOKEN'],
                "temp": self.temperature,
                "humidity": self.humidity,
                "table": data['ROOM_ID']
            })
            print(req.json()['message'])
