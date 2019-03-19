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


export class MapResultsOpenlayers extends Component {
    constructor(props) {
        super(props);
        this.state = {loading:true,
            colorMax: props.colorMax,
            colorMin: props.colorMin,
            opacity: props.opacity || 0.9}
        this.colorMixer = new ColorMixerUtil();
    };

    componentDidMount() {
        this.getLayers();
    }

    getLayers = () => {
        this.setExtremeValues();
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
        this.setExtremeValues();

        const styleFunction = (feature) => {
            console.log(this.props.propertyDisplayed);
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

                // at this point, the style for the current level is in the cache
                // so return it (as an array!)
                return [styleCache];
            }
        }
        //vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: styleFunction
        });

        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayer
            ],
            target: 'map',
            view: new View({
                projection: projection,
                center: fromLonLat([-3, 40]),
                zoom: 8
            })
        });
        if (this.state.map){
            this.setState({loading:false});

        }
        this.setState({map});
    }

    setExtremeValues = () => {
        const propertyDisplayed = this.props.propertyDisplayed;
        let max = this.props.intervalsValuesObject[propertyDisplayed].max || 1;
        let min = this.props.intervalsValuesObject[propertyDisplayed].min || 0;
        let unit = "";
        const extremeValues = {propertyDisplayed, min, max, unit};
        this.setState({extremeValues});
    }

    render() {
        return (
            <div id="map" className='basemap'></div>
        )
    }
}
