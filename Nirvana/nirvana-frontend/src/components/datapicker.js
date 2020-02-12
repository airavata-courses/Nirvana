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
import axios from 'axios';
import { api_gateway_url } from "../constants/constants";
export default function DatePickers() {

  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');
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

const handleDataRetrieval = ()=>{
  console.log(from_date)
  const jwt = cookie.load('jwt');

  // const session_id = cookie.load('session_id');

  var new_from_date = new Date(from_date)
  var new_to_date = new Date(to_date)
  var email = cookie.load("email")
  const payload = {
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
  const headers = {
    email: email,
    Authorization: jwt,
    // insert session id here
    // session_id: session_id
  }
  console.log(payload);
  axios.get(api_gateway_url +"retrieveData", {headers, params:payload}).
  then(res=>{
    console.log(res)
    setWeather(res.data)
  })
  // const res = {
  //   "weather":{
  //     "1580922000.0": {
  //       "temperature": 65.14,
  //       "precipitation_intensity": 0,
  //       "humidity": 0.79,
  //       "pressure": 1015.1,
  //       "wind_speed": 4.17,
  //       "visibility": 10,
  //       "dew_point": 58.3,
  //       "summary": "Mostly Cloudy"
  //     },
  //     "1581008400.0": {
  //       "temperature": 66.44,
  //       "precipitation_intensity": 0,
  //       "humidity": 0.73,
  //       "pressure": 1017,
  //       "wind_speed": 3.26,
  //       "visibility": 10,
  //       "dew_point": 57.52,
  //       "summary": "Clear"
  //     },
  //     "1581094800.0": {
  //       "temperature": 67.89,
  //       "precipitation_intensity": 0,
  //       "humidity": 0.69,
  //       "pressure": 1018.7,
  //       "wind_speed": 4.72,
  //       "visibility": 10,
  //       "dew_point": 57.35,
  //       "summary": "Overcast"
  //     },
  //     "1581181200.0": {
  //       "temperature": 67.96,
  //       "precipitation_intensity": 0,
  //       "humidity": 0.58,
  //       "pressure": 1019.6,
  //       "wind_speed": 7.29,
  //       "visibility": 10,
  //       "dew_point": 52.62,
  //       "summary": "Overcast"
  //     },
  //     "1581267600.0": {
  //       "temperature": 65.41,
  //       "precipitation_intensity": 0,
  //       "humidity": 0.5,
  //       "pressure": 1017.9,
  //       "wind_speed": 4.28,
  //       "visibility": 10,
  //       "dew_point": 46.27,
  //       "summary": "Clear"
  //     }
  //   },
  //   "latitude": 22.5726,
  //   "longitude": 88.3639,
  //   "center": {
  //     lat: 22.5726,
  //     lng: 88.3639
  //   }
  // }
  // setWeather(res)
  
}


  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date());

 

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    
    <TextField id="outlined-basic" 
      label="Search City" 
      onChange={updateCityName}
      variant="outlined"/>

      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          name = "from_date"
          label="Date picker dialog"
          format="MM/dd/yyyy"
          value={selectedDate}
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
          value={selectedDate}
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
