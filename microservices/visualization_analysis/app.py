from static import consumer
import json
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns




def generate_graph(city_name, from_date, to_date):
    sns.set_style("darkgrid")
    plt.plot(np.cumsum(np.random.randn(1000, 1)))
    plt.show()


for message_in_consumer in consumer:
        key = str(message_in_consumer.key)[2:len(str(message_in_consumer.key)) - 1]
        message = str(message_in_consumer.value, 'utf-8')
        message = json.loads(message)
        city_name = message['city_name']
        from_date = message['from_date']
        to_date = message['to_date']
        generate_graph(city_name, from_date, to_date)