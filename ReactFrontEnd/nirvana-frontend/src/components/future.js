import React from 'react';
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
  console.log(dailyWeather.weather)
  let i = 0
  Object.keys(dailyWeather.weather).forEach(function(key) {
    rows.push(createData(i, key,
    dailyWeather.weather[key]["temperature"],
    dailyWeather.weather[key]["precipitation_intensity"],
    dailyWeather.weather[key]["humidity"],
    dailyWeather.weather[key]["wind_speed"],
    dailyWeather.weather[key]["visibility"]
    ))
    console.log("my printing", dailyWeather.weather[key]["temperature"]);
    i+=1
  });


  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}