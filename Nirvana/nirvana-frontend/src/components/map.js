import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
const mapStyles = {
    width: '40%',
    height: '40%'
};
export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            center: this.props.center,
            data: this.props.data
        };
    }
    componentDidUpdate(previousProps, previousState){
        if (previousProps.latitude !== this.props.latitude || previousProps.longitude !== this.props.longitude){
            
            this.setState(this.props, ()=>{
                console.log("Hii!")
                console.log(this.state)
            });
        }

    }

    render() {
        // if(this.state.latitude !=this.props.latitude || this.state.latitude !=this.props.latitude){
            
        // }
        
        return (
            <Map
                google={this.props.google}
                zoom={14}
                style={mapStyles}
                center = {this.state.center}
                initialCenter={{
                    lat: this.state.latitude,
                    lng: this.state.longitude
                }}
            />
        );
    }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyBxER6al8Y-J38QoPWfOeAR626QvPu5g6U'
})(MapContainer);