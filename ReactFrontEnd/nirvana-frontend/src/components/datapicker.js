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



// first data
let lat = 0;
let lon = 0;
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
    if (response.ok) {
      response.json().then(json => {
        console.log("response 1 data")
        console.log(json)
        lat = json.latitude
        lon = json.longitude
        result_context.weather = json.weather
        setWeather({weather : json.weather,
        latitude: lat,
        longitude:lon})
        // make array of data
        // setWeather(json)
      });
      var numberOfDaysToAdd = 8;
      new_to_date.setDate(new_to_date.getDate() + numberOfDaysToAdd); 

      let dataToSend = {
        from_date: {
          year: new_from_date.getFullYear(),
          month: new_from_date.getMonth()+1,
          day: new_from_date.getDate()
        },
        to_date: {
          year: new_to_date.getFullYear(),
          month: new_to_date.getMonth()+1,
          day: new_to_date.getDate()
        },
        city_name: city_name
      }
      getDataFuture(headers,{"lat":lat, "lon":lon},dataToSend)
    }
    else {
      console.log("server error -- response 1")
    }
  })
}

// data 2
const getDataFuture = (headers, payload,payload_for_viz) => {
  // console.log(payload)
  fetch(api_gateway_url + 'retrieveDataFuture', {
    method: 'POST',
    headers: headers,
    body:JSON.stringify(payload),
    async:true
  }).then(response => {
    if (response.ok) {
      response.json().then(json => {
        console.log("response 2 data")
        console.log(json)
        let temprature  = [];
        let precipitation = [];
        let humidity = [];
        let windSpeed = [];
        for (var key in json.weather) {
          temprature.push(json.weather[key].temperature);
          precipitation.push(json.weather[key].precipitation_intensity);
          humidity.push(json.weather[key].humidity);
          windSpeed.push(json.weather[key].wind_speed);
        }
        let temp_str = JSON.stringify(
          {
            temprature: temprature,
            precipitation: precipitation,
            humidity: humidity,
            wind_speed:windSpeed
          }
        );
        payload_for_viz.records = temp_str;

        result_context.future = json.weather
        setWeather({future : json.weather, 
        weather: result_context.weather,
        latitude: lat,
        longitude:lon})

        getDataViz(headers,payload_for_viz)

      });    
    }
    else {
      console.log("server error -- response 2")
    }
  })
}

// data 3
const getDataViz = (headers, payload)=>{
  // console.log("send data to svc 3")
  // console.log(payload)
  fetch(api_gateway_url + 'retrieveDataViz', {
    method: 'POST',
    headers: headers,
    body:JSON.stringify(payload),
    async:true
  }).then(response => {
    if (response.ok) {
      response.json().then(json => {
        console.log("response 3 data")
        console.log(json)
        setWeather({viz : json,
          weather: result_context.weather,
          future : result_context.future,
          latitude: lat,
          longitude:lon})
        // make array of data
      });
    }
    else {
      console.log("server error -- response 3")
    }
  })
}

const handleDataRetrieval = ()=>{
  // console.log(from_date)
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
  // console.log(payload);
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
      required/>

      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          name = "from_date"
          label="Date picker dialog"
          format="MM/dd/yyyy"
          value={from_date || new Date()}
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
          value={to_date || new Date()}
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

