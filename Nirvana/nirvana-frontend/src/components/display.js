import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MapContainer from './map';
import { WeatherContext } from '../Contexts/weather_context'
import SimpleTabs from './tabs';

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
    
    return (
        <div className={classes.root}>
            <Grid container spacing={0}>
                <Grid item xs={6} sm={6}>
                    <SimpleTabs/>
                </Grid>
                <Grid item xs={1} sm={1}>
                    <MapContainer 
                        latitude = {dailyWeather.latitude}
                        longitude = {dailyWeather.longitude}
                       center = {{
                        lat: dailyWeather.latitude,
                        lng: dailyWeather.longitude
                    }}
                    />
                </Grid>
                
            </Grid>
        </div>
    );
}
