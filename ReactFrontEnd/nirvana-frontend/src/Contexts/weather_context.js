import React, { useState, createContext } from "react";
export const WeatherContext = createContext();

export const WeatherProvider = props => {
    const [dailyWeather, setWeather] = useState({
        latitude: 10.0,
        longitude: 10.0,
        center: {
            lat: 10.0,
            lng: 10.0
        }
    });


    return <WeatherContext.Provider value={[dailyWeather, setWeather]}>
        {props.children}
    </WeatherContext.Provider>
}