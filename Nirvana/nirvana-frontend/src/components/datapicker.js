import 'date-fns';
import React, {useState, useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {WeatherContext} from '../Contexts/weather_context';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { TextField, Button } from '@material-ui/core';
import cookie from 'react-cookies'
import axios, * as others from 'axios';
import { api_gateway_url } from "../constants/constants";
export default function DatePickers() {
  const [from_date, setFromDate] = useState(new Date());
  const [to_date, setToDate] = useState(new Date());
  const [city_name, setCityName] = useState('');
  const [dailyWeather, setWeather] = useContext(WeatherContext);

const updateFromDate = date => {
  setFromDate(Date.parse(date));
}


const updateToDate = date => {
  setToDate(Date.parse(date));
}


const updateCityName = e => {
  setCityName(e.target.value);
}


let lat = 0;
let lon = 0;
let temprature  = [];
let precipitation = [];
let humidity = [];
let windSpeed = [];
let get_data = {};
let get_future = {};
let get_viz={};
let result_context ={
weather : get_data,
future : get_future,
viz : get_viz 
};


const getData = (headers, payload, new_from_date, new_to_date)=>{
  fetch(api_gateway_url + 'retrieveData', {
    method: 'POST',
    headers: headers,
    body:JSON.stringify(payload),
    async:true
  }).then(response => {
      if (response.ok) 
      {
         response.json().then(json => {
          lat = json.latitude
          lon = json.longitude
          result_context.weather = json.weather
          setWeather({weather : json.weather,
          latitude: lat,
          longitude:lon})

          
          Object.keys(json.weather).forEach(function(key) {
            temprature.push(json.weather[key].temperature);
            precipitation.push(json.weather[key].precipitation_intensity);
            humidity.push(json.weather[key].humidity);
            windSpeed.push(json.weather[key].wind_speed); 
          });
          let dataToSend = {
            from_date: JSON.stringify({
              year: new_from_date.getFullYear(),
              month: new_from_date.getMonth()+1,
              day: new_from_date.getDate()
            }),
            to_date: JSON.stringify({
              year: new_to_date.getFullYear(),
              month: new_to_date.getMonth()+1,
              day: new_to_date.getDate()
            }),
            city_name: city_name,
            records: JSON.stringify({
              temprature : temprature,
              precipitation : precipitation,
              humidity : humidity,
              wind_speed : windSpeed
            })
          }
          console.log("response 1")
          getDataFuture(headers,{"lat":lat, "lon":lon},dataToSend)
        });
      
    }
    else {
    }
  })
}


const getDataViz = (headers, payload)=>{
  fetch(api_gateway_url + 'retrieveDataViz', {
    method: 'POST',
    headers: headers,
    body:JSON.stringify(payload),
    async:true
  }).then(response => {
    if (response.ok) {
      response.json().then(json => {
        setWeather({viz : json,
        weather: result_context.weather,
        future : result_context.future,
        latitude: lat,
        longitude:lon})
        console.log("response 3")



      });
    }
    else {
    }
  })
}


const getDataFuture = (headers, payload,payload_for_viz, first_json, weather_data) => {
  fetch(api_gateway_url + 'retrieveDataFuture', {
    method: 'POST',
    headers: headers,
    body:JSON.stringify(payload),
    async:true
  }).then(response => {
    if (response.ok) {
      response.json().then(json => {
        result_context.future = json.weather
        setWeather({future : json.weather, 
        weather: result_context.weather,
        latitude: lat,
        longitude:lon})
        console.log("response 2")
        getDataViz(headers,payload_for_viz)
      });
    }
    else {
    }
  })
}

const handleDataRetrieval = ()=>{
  temprature = []
  precipitation = []
  humidity = []
  windSpeed = []
  const jwt = cookie.load('jwt');

  const session_id = cookie.load('session_id');

  var new_from_date = new Date(from_date)
  var new_to_date = new Date(to_date)
  var email = cookie.load("email")
  const payload = {
    from_date: JSON.stringify({
      year: new_from_date.getFullYear(),
      month: new_from_date.getMonth()+1,
      day: new_from_date.getDate()
    }),
    to_date: JSON.stringify({
      year: new_to_date.getFullYear(),
      month: new_to_date.getMonth()+1,
      day: new_to_date.getDate()
    }),
    city_name: city_name
  }
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'email': email,
    'Authorization': jwt,
    // insert session id here
    'session_id': session_id
  }
  let session_payload = {
    "user_action": city_name + " " + new_from_date + " " + new_to_date,
  }

  getData(headers, payload, new_from_date, new_to_date);
}

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    
    <TextField id="outlined-basic" 
      label="Search City" 
      onChange={updateCityName}
      variant="outlined"
      required
    />

      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          name = "from_date"
          label="Date picker dialog"
          format="MM/dd/yyyy"
          value={from_date}
          onChange={updateFromDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          name = "to_date"
          label="Date picker dialog"
          format="MM/dd/yyyy"
          value={to_date}
          onChange={updateToDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <Button variant="contained" color="primary" onClick={handleDataRetrieval}>
          Submit
        </Button>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

