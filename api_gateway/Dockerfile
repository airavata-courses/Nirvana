FROM python:3.7
WORKDIR /app
COPY ./app app
COPY requirements.txt /app/
RUN pip3 install -r requirements.txt
EXPOSE 5000
CMD python app/app.py
