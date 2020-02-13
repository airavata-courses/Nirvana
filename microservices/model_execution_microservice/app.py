from static import producer, consumer,json
import datetime
from darksky.api import DarkSky, DarkSkyAsync
from darksky.types import languages, units, weather
import requests


API_KEY_DARKSKY = "5b994c5d23bd07739c49ba20239157d7"
def getFutureData(latitude,longitude):
    darksky = DarkSky(API_KEY_DARKSKY)
    return_data = {
        "latitude": latitude,
        "longitude": longitude,
        "center": {
            "lat": latitude,
            "lng": longitude
        },
        "weather": {
        }
    }

    ## generating array of dates
    array_of_dates = []
    for i in range(1,10):
        NextDay_Date = datetime.datetime.today() + datetime.timedelta(days=i)
        array_of_dates.append(NextDay_Date)

    for t in array_of_dates:
        forecast = darksky.get_time_machine_forecast(
            latitude, longitude,
            extend=False,  # default `False`
            lang=languages.ENGLISH,  # default `ENGLISH`
            values_units=units.US,  # default `auto`
            exclude=[weather.MINUTELY, weather.ALERTS],  # default `[]`,
            timezone='UTC',  # default None - will be set by DarkSky API automatically
            time=t
        )
        data = {'temperature': forecast.currently.temperature,
                'precipitation_intensity': forecast.currently.precip_intensity,
                'humidity': forecast.currently.humidity,
                'pressure': forecast.currently.pressure,
                'wind_speed': forecast.currently.wind_speed,
                'visibility': forecast.currently.visibility,
                'dew_point': forecast.currently.dew_point,
                'summary': forecast.currently.summary}
        return_data['weather'][t.timestamp()] = data
    producer.send("API_Consumer", key=message_in_consumer.key, value=return_data)

for message_in_consumer in consumer:
    message = str(message_in_consumer.value, 'utf-8')
    message = json.loads(message)
    lat = message["lat"]
    lon = message["lon"]
    getFutureData(lat,lon)

