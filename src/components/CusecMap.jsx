import React, { Component } from 'react';
import { GeoJSON, Map, TileLayer } from 'react-leaflet';
import MapLegend from './MapLegend';
import ColorMixerUtil from './utils/ColorMixerUtil';
import './styles/map.css';
import 'leaflet/dist/leaflet.css';
import PreferencesLegendDisplay from "./PreferencesLegendDisplay";

class CusecMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorMax: props.colorMax,
            colorMin: props.colorMin,
            opacity: props.opacity || 0.9
            }
        this.colorMixer = new ColorMixerUtil();
    }

    componentDidUpdate(prevProps, nextProps){
        if(prevProps.propertyDisplayed != this.props.propertyDisplayed || prevProps.colorMax != this.props.colorMax){
            const extremeValues = this.getExtremeValues();
            this.updateMap(extremeValues);
        }
    }
    updateMap = (extremeValues) =>{
        const legend = this.obtainLegened(extremeValues);
        const map = this.generateMap(extremeValues);
        this.setState({legend,map, extremeValues});
    }
    render() {
        return (
                    <div className="container-map">
                        <div className="row legend">
                            <div classname="col-sm-4"> {this.state.legend}</div>
                            {this.state.extremeValues &&
                            <div className="col-sm-4 edit-min-max"><PreferencesLegendDisplay
                                geoJson={this.props.geoJson}
                                propertyDisplayed={this.props.propertyDisplayed}
                                limits={{min:this.state.extremeValues.min, max:this.state.extremeValues.max}}
                                changeLimits={this.updateLimitsFromSlider}/>
                            </div>
                            }
                        </div>
                        <div className="">
                            <div className="map-box">{this.state.map}</div>
                        </div>
                    </div>
        );
    }

    updateLimitsFromSlider = (limits) =>{
        const extremeValues = this.state.extremeValues;
        extremeValues.max = limits.max;
        extremeValues.min = limits.min;
        this.updateMap(extremeValues);
    }


    generateMap = (extremeValues) => {
        let position;
        let zoom;
        console.log(this.props);
        if (this.props.centerMap){
            position = [40, -3];
            zoom = 5
        } else {
            position=this.getPosition();
            zoom = 12
        }
        const map = (
            < Map center={position} className="map-box" zoom={zoom} >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <GeoJSON key={JSON.stringify(this.props.geoJson)} data={this.props.geoJson} style={this.style(extremeValues)} onEachFeature={this.onEachFeature} />
            </Map >
        );
        return map;
    }

    getPosition = () => {
        let position;
        const mapDataPresent = (this.props.geoJson && this.props.geoJson.features && this.props.geoJson.features[0]);
        if ( mapDataPresent && this.props.geoJson.features[0].geometry.coordinates[0][0][0][0]) {
            position = [this.props.geoJson.features[0].geometry.coordinates[0][0][0][1], this.props.geoJson.features[0].geometry.coordinates[0][0][0][0]];
        } else if (mapDataPresent && this.props.geoJson.features[0].geometry.coordinates[0][0][0]) {
            position = [this.props.geoJson.features[0].geometry.coordinates[0][0][1], this.props.geoJson.features[0].geometry.coordinates[0][0][0]]
        } else {
            position = [40, -3];
        }
        return position;

    }

    style = (extremeValues) => {
        return (feature) => {
                const factor = (feature.properties[this.props.propertyDisplayed] - extremeValues.min) / extremeValues.max;
                const result = {
                    fillOpacity: this.state.opacity,
                    fillColor: this.colorMixer.colorMixer(this.props.colorMax, this.props.colorMin, factor),
                    weight: 0.5
                }
                return result;
            }

    }

    getExtremeValues = () => {
        let party;
        let max = 1;
        let min = 0;
        let unit = "";
        if (Object.keys(this.props.intervalsValuesObject).indexOf(this.props.propertyDisplayed)>-1){
            party = this.props.propertyDisplayed;
        } else{
            party = this.props.propertyDisplayed.replace("%", "");
        }
        if (this.props.intervalsValuesObject && this.props.intervalsValuesObject[party]) {
            if (this.props.propertyDisplayed.indexOf("%") > -1 && this.props.intervalsValuesObject[party].maxPercent) {
                max = this.props.intervalsValuesObject[party].maxPercent;
                min = this.props.intervalsValuesObject[party].minPercent;
                unit = "%"
            } else if (this.props.intervalsValuesObject[party].max) {
                max = this.props.intervalsValuesObject[party].max;
                min = this.props.intervalsValuesObject[party].min;
            }
        }
        return {party, min ,max, unit};
    }

    obtainLegened = (extremeValues) => {
        return (<MapLegend maxValue={extremeValues.max} minValue={extremeValues.min} colorMax={this.props.colorMax}
                colorMin={this.props.colorMin} unit={extremeValues.unit} label={this.props.propertyDisplayed}></MapLegend>);
    }

    onEachFeature = (feature, layer,propertyDisplayed) => {
        if (feature.properties) {
            //layer.bindPopup(JSON.stringify(feature.properties).replace(new RegExp(",", 'g'), ",\n").replace(new RegExp("\"", 'g'), ""));
            layer.bindPopup(this.getPopUp(feature));
        }
    }
    getPopUp = (feature) => {
        let outputStr = "";
        //outputStr = '<b> ' + this.props.propertyDisplayed + ':</b> ' + feature.properties[this.props.propertyDisplayed] + '<br></br>';
        for (const property of Object.keys(feature.properties).sort().slice(0,20)){
            outputStr = outputStr + '<div> <b>' + property + '</b>:' + feature.properties[property] + '</div> ';
        }
        return outputStr;
    }
}
export default CusecMap;
