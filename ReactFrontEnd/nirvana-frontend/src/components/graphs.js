import React, { useContext } from 'react';
import {WeatherContext} from '../Contexts/weather_context';
export default function Graphs() {
  const base64_prefix = 'data:image/png;base64,'
  const [dailyWeather, setWeather] = useContext(WeatherContext);
  let recordings = JSON.parse(dailyWeather.viz)
  return (
    <div>
        <img src = {base64_prefix+recordings.temprature_recordings} style = {{width:"100%"}}></img> <br/>
        <img src = {base64_prefix+recordings.precipitation_recordings} style = {{width:"100%"}}></img> <br/>
        <img src = {base64_prefix+recordings.humidity_recordings} style = {{width:"100%"}}></img> <br/>
        <img src = {base64_prefix+recordings.wind_speed_recordings} style = {{width:"100%"}}></img> <br/>
    </div>
  );
}