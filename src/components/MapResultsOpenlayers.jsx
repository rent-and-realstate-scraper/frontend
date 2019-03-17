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
        this.state = {}
    };

    getLayers = () => {
        const vectorSource = new VectorSource({
            features: (new GeoJSON()).readFeatures(this.props.geojson)
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
            controls: new defaults({
                attributionOptions: {
                    collapsible: false
                }
            }).extend([
                new ScaleLine()
            ]),
            target: 'basemap',
            layers: [
                tileLayer,
                vectorLayer
            ],
            view: new View({
                center: fromLonLat([40, -3]),
                zoom: 10
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