import React, {Component} from 'react'
import 'ol/ol.css'
import {Map, View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import {fromLonLat} from 'ol/proj'
import XYZ from 'ol/source/XYZ'
import {defaults, ScaleLine} from 'ol/control'
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

export class MapResultsOpenlayers extends Component {
    constructor(props) {
        super(props);
        this.state = {crs:"EPSG:900913"}
    };

    getLayers = () => {
        const geojson = this.props.geojson;
        console.log(geojson);
        const crsStr = this.state.crs;
        geojson.crs = {
            'type': 'name',
                'properties': {
                'name': crsStr
            }
        };

        const vectorSource = new VectorSource({
            renderMode: 'image',
            format: new GeoJSON(),
            projection: crsStr,
            features: (new GeoJSON()).readFeatures(geojson)
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource
        });

        const tileLayer = new TileLayer({
            title: "annotation",
            source: new XYZ({
                url: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });


        let map = new Map({
            target: 'basemap',
            layers: [
                vectorLayer,
                tileLayer
            ],
            view: new View({
                projection: crsStr,
                center: fromLonLat([-3, 40]),
                zoom: 8
            })
        })

    }

    componentDidMount() {
        this.getLayers();

    }


    render() {
        return (
            <div id="basemap" className='basemap'></div>
        )
    }
}