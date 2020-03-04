from darksky.api import DarkSky, DarkSkyAsync
from darksky.types import languages, units, weather
import requests
import json
import datetime
API_KEY_LOCATIONIQ = "17bb61bd241d91"
API_KEY_DARKSKY = "b16862373c8444b2359349e22a2887c3"
## step 1
def city_name_to_coordinates(name):
    url = "https://us1.locationiq.com/v1/search.php"
    data = {
        'key': API_KEY_LOCATIONIQ,
        'q': name,
        'format': 'json'
    }
    response = requests.get(url, params=data)
    lat , lon = json.loads(response.text)[0]['lat'] , json.loads(response.text)[0]['lon']
    return lat, lon
def api_call_to_dark_sky(array_of_dates, latitude, longitude):
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
        return_data['weather'][str(t.day) + "-" + str(t.strftime("%b")) + "-" + str(t.year)] = data
    return return_data
## step 2
def darksky_api_call(name,from_date, to_date):
    array_of_dates = []
    if( (not from_date) and (not to_date) ):
        ## get current data
        now = datetime.datetime.now()
        array_of_dates = generate_dates(now,now) ## pass both current date
    elif( from_date!= None and (not to_date ) ):        ## set date to be searched as from_date
        array_of_dates = generate_dates(datetime.datetime(from_date["year"], from_date["month"], from_date["day"],12) ,
                       datetime.datetime(from_date["year"], from_date["month"], from_date["day"],12)) ## pass both from date
    else:
        ## range of date
        array_of_dates = generate_dates(datetime.datetime(from_date["year"], from_date["month"], from_date["day"], 12),
                       datetime.datetime(to_date["year"], to_date["month"], to_date["day"], 12))  ## pass both from date
    ## api call to darksky
    lat, lon = city_name_to_coordinates(name)
    return api_call_to_dark_sky(array_of_dates, lat, lon)
    
def generate_dates(from_date, to_date):
    delta = to_date - from_date  # as timedelta
    array_of_dates = []
    for i in range(delta.days + 1):
        day = from_date + datetime.timedelta(days=i)
        array_of_dates.append(day)
    return array_of_dates