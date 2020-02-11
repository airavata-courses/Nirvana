import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MapContainer from './map';
import { WeatherContext } from '../Contexts/weather_context'


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function Display() {
    const [dailyWeather, setWeather] = useContext(WeatherContext);
    const classes = useStyles();
    console.log("Hello: " + dailyWeather)
    
    return (
        <div className={classes.root}>
            <Grid container spacing={3}>



                <Grid item xs={4} sm={4}>
                    <Paper className={classes.paper}>xs=6 sm=3</Paper>
                </Grid>
                <Grid item xs={6} sm={6}>
                    <MapContainer 
                    latitude = {dailyWeather['latitude']}
                    longitude = {dailyWeather['longitude']}
                    center = {dailyWeather['center']}
                    />
                </Grid>
                <Grid item xs={2} sm={2}>
                    <Paper className={classes.paper}>xs=6 sm=3</Paper>
                </Grid>
            </Grid>
        </div>
    );
}
