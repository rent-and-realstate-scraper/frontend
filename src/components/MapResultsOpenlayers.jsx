import React, {Component} from 'react'
import 'ol/ol.css'
import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {fromLonLat} from "ol/proj";


export class MapResultsOpenlayers extends Component {
    constructor(props) {
        super(props);
        this.state = {loading:true}
    };

    getLayers = () => {
        this.setState({loading:true});
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
        var vectorSource = new VectorSource({
            projection: projection, //HERE IS THE DATA SOURCE PROJECTION
            features: features
        });

        //vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

        var vectorLayer = new VectorLayer({
            source: vectorSource});

        var map = new Map({
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
        this.setState({loading:false});
    }

    setExtremeValues = () => {
        const propertyDisplayed = this.props.propertyDisplayed;
        let max = this.props.intervalsValuesObject[propertyDisplayed].max || 1;
        let min = this.props.intervalsValuesObject[propertyDisplayed].min || 0;
        let unit = "";
        const extremeValues = {propertyDisplayed, min, max, unit};
        this.setState({extremeValues});
    }
    componentDidMount() {
        this.getLayers();
    }

    render() {
        return (
            <div id="map" className='basemap'></div>
        )
    }
}