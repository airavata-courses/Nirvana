import React, { Component } from 'react'
import PrimarySearchAppBar from './navbar';
import { WeatherProvider } from '../Contexts/weather_context';
import Display from './display';

export default class Dashboard extends Component {
    render() {
        return (
            <WeatherProvider>
                <div>
                    <PrimarySearchAppBar/>
                </div>
                <Display/>
            </WeatherProvider>
            
        )
    }
}
