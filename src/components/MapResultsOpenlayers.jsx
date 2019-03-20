import React, {Component} from 'react'
import 'ol/ol.css'
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke,  Style} from 'ol/style.js';
import {fromLonLat} from "ol/proj";
import ColorMixerUtil from "./utils/ColorMixerUtil";
import {get} from 'lodash';
import MapLegend from "./MapLegend";
import PreferencesLegendDisplay from "./PreferencesLegendDisplay";


export class MapResultsOpenlayers extends Component {
    constructor(props) {
        super(props);
        this.state = {loading:true,
            colorMax: props.colorMax,
            colorMin: props.colorMin,
            opacity: props.opacity || 0.9}
        this.colorMixer = new ColorMixerUtil();
    };

    setStateAsync = updater => new Promise(resolve => this.setState(updater, resolve))

    async componentDidMount() {
        await this.getLayers();
        await this.obtainLegened();
    }

    getLayers = async () => {
        await this.setExtremeValues();
        const projection = "EPSG:3857";
        const geojson = this.props.geojson;

        geojson.crs = {
            'type': 'name',
            'properties': {
                'name': projection
            }
        };
        const features = (new GeoJSON()).readFeatures(geojson, {
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:4326'
        });
        const vectorSource = new VectorSource({
            projection: projection,
            features: features
        });

        const styleFunction = (feature) => {
            if(feature){
                const factor = (feature.get(this.props.propertyDisplayed) - this.state.extremeValues.min) / this.state.extremeValues.max;
                const fillOpacity = this.state.opacity;
                const fillColor = this.colorMixer.colorMixer(this.state.colorMax, this.state.colorMin, factor);
                const styleCache = new Style({
                    fill: new Fill({
                        color: fillColor
                    }),
                    opacity:fillOpacity
                });

                return [styleCache];
            }
        }

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: styleFunction
        });
        const position = this.getPosition();
        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayer
            ],
            target: 'mapOL',
            view: new View({
                projection: projection,
                center: fromLonLat(position, projection),
                zoom: 12
            })
        });
        this.setState({loading:false});
    }

    setExtremeValues = async () => {
        const propertyDisplayed = this.props.propertyDisplayed;
        let max = this.props.intervalsValuesObject[propertyDisplayed].max || 1;
        let min = this.props.intervalsValuesObject[propertyDisplayed].min || 0;
        let unit = "";
        const extremeValues = {propertyDisplayed, min, max, unit};
        await this.setStateAsync({extremeValues});
    }


    obtainLegened = async () => {
        if( this.state.extremeValues){
            const legend = <MapLegend maxValue={this.state.extremeValues.max} minValue={this.state.extremeValues.min} colorMax={this.props.colorMax}
                               colorMin={this.props.colorMin} unit={this.state.extremeValues.unit} label={this.props.propertyDisplayed}></MapLegend>;
            await this.setStateAsync({legend});
        }
    }

    getPosition = () => {
        let position;
        const mapDataPresent = (this.props.geojson && this.props.geojson.features && this.props.geojson.features[0]);
        if ( mapDataPresent && this.props.geojson.features[0].geometry.coordinates[0][0][0][0]) {
            position = [this.props.geojson.features[0].geometry.coordinates[0][0][0][0], this.props.geojson.features[0].geometry.coordinates[0][0][0][1]];
        } else if (mapDataPresent && this.props.geojson.features[0].geometry.coordinates[0][0][0]) {
            position = [this.props.geojson.features[0].geometry.coordinates[0][0][0], this.props.geojson.features[0].geometry.coordinates[0][0][1]]
        } else {
            position = [-3, 40];
        }
        return position;

    }

    render() {
        return (
            <div>
                <div className="container-map">
                    <div className="row legend">
                        <div className="col-sm-4"> {this.state.legend}</div>
                        {this.state.extremeValues &&
                        <div className="col-sm-4 edit-min-max"><PreferencesLegendDisplay
                            geoJson={this.props.geojson}
                            propertyDisplayed={this.props.propertyDisplayed}
                            limits={{min: this.state.extremeValues.min, max: this.state.extremeValues.max}}
                            changeLimits={this.updateLimitsFromSlider}/>
                        </div>
                        }
                    </div>
                    <div className="">
                        <div id="mapOL" className='map-box'></div>
                    </div>
                </div>
            </div>
        )
    }
}
