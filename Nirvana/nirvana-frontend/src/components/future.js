import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {WeatherContext} from '../Contexts/weather_context';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function SimpleTable() {

  const rows = [];
  function createData(id, day, temprature, precipitation, humidity, windSpeed,visibility) {
    return { id, day, temprature, precipitation, humidity, windSpeed, visibility };
  }
  const [dailyWeather, setWeather] = useContext(WeatherContext);
  let i = 0
  Object.keys(dailyWeather.future).forEach(function(key) {
    rows.push(createData(i, key,
    dailyWeather.future[key]["temperature"],
    dailyWeather.future[key]["precipitation_intensity"],
    dailyWeather.future[key]["humidity"],
    dailyWeather.future[key]["wind_speed"],
    dailyWeather.future[key]["visibility"]
    ))
    i+=1
  });


  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Day</TableCell>
            <TableCell align="right">Temprature</TableCell>
            <TableCell align="right">Precipitation</TableCell>
            <TableCell align="right">Humidity</TableCell>
            <TableCell align="right">Wind Speed</TableCell>
            <TableCell align="right">Visibility</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.day}
              </TableCell>
              <TableCell align="right">{row.temprature}</TableCell>
              <TableCell align="right">{row.precipitation}</TableCell>
              <TableCell align="right">{row.humidity}</TableCell>
              <TableCell align="right">{row.windSpeed}</TableCell>
              <TableCell align="right">{row.visibility}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}