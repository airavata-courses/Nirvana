import React, { useState, createContext } from "react";
export const WeatherContext = createContext();

export const WeatherProvider = props => {
    const [dailyWeather, setWeather] = useState({
        latitude : 10.0,
        longitude: 10.0,
        weather:{},
        future: {},
        viz:{}
    });


    return <WeatherContext.Provider value={[dailyWeather, setWeather]}>
        {props.children}
    </WeatherContext.Provider>
}