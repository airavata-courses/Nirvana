from statics import consumer,producer
import json
import datetime
import plotly.graph_objs as go
import plotly
import os
import base64
plotly.io.orca.config.executable = 'orca/orca.exe'
plotly.io.orca.config.save()


def generate_dates(from_date, to_date):
    delta = to_date - from_date  # as timedelta
    array_of_dates = []
    for i in range(delta.days + 1):
        day = from_date + datetime.timedelta(days=i)
        array_of_dates.append(day)
    return array_of_dates

def generate_array_of_dates(from_date, to_date):
        array_of_dates = []
        if ((not from_date) and (not to_date)):
            ## get current data
            now = datetime.datetime.now()
            array_of_dates = generate_dates(now, now)  ## pass both current date
        elif (from_date != None and (not to_date)):
            ## set date to be searched as from_date
            array_of_dates = generate_dates(
                datetime.datetime(from_date["year"], from_date["month"], from_date["day"], 12),
                datetime.datetime(from_date["year"], from_date["month"], from_date["day"], 12))  ## pass both from date
        else:
            ## range of date
            array_of_dates = generate_dates(
                datetime.datetime(from_date["year"], from_date["month"], from_date["day"], 12),
                datetime.datetime(to_date["year"], to_date["month"], to_date["day"], 12))  ## pass both from date
        return array_of_dates

def generate_graph(city_name, array_of_dates,recordings,key,data_type):
    data_to_plot = []
    for date in array_of_dates:
        data_to_plot.append(str(date.month)+"/"+str(date.day))
    fig = go.Figure(data=go.Scatter(x=data_to_plot, y=recordings))
    if not os.path.exists("images"):
        os.mkdir("images")
    img_name = key+"^^^"+str(datetime.datetime.now().timestamp())+"^^^"+data_type+ ".png"
    fig.write_image("images/"+img_name)
    base64_string = None
    with open("images/"+img_name, "rb") as img_file:
        base64_string = base64.b64encode(img_file.read())
    base64_string = base64_string.decode('utf-8')
    return base64_string


for message_in_consumer in consumer:
        key = str(message_in_consumer.key)[2:len(str(message_in_consumer.key)) - 1]
        message = str(message_in_consumer.value, 'utf-8')
        message = json.loads(message)

        city_name = message['city_name']
        from_date = json.loads(message['from_date'])
        to_date = json.loads(message['to_date'])
        message["records"] = json.loads(message["records"])
        print(message['records'])
        temprature_recordings = message['records']['temprature']
        precipitation_recordings = message['records']['precipitation']
        humidity_recordings = message['records']['humidity']
        wind_speed_recordings = message['records']['wind_speed']
        array_of_dates = generate_array_of_dates(from_date,to_date)
        print(temprature_recordings)

        data_to_send ={}
        data_to_send["temprature_recordings"] = generate_graph(city_name, array_of_dates,temprature_recordings,key,"temprature_recordings")
        data_to_send["precipitation_recordings"] = generate_graph(city_name, array_of_dates, temprature_recordings, key, "precipitation_recordings")
        data_to_send["humidity_recordings"] = generate_graph(city_name, array_of_dates, temprature_recordings, key, "humidity_recordings")
        data_to_send["wind_speed_recordings"] = generate_graph(city_name, array_of_dates, temprature_recordings, key, "wind_speed_recordings")

        producer.send("API_Consumer",
                      key=bytes(key, 'utf-8'), value=data_to_send)

