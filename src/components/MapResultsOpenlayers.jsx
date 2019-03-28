import React, {Component} from 'react'
import 'ol/ol.css'
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke,  Style} from 'ol/style.js';
import {fromLonLat} from "ol/proj";
import ColorMixerUtil from "./utils/ColorMixerUtil";
import {omit} from 'lodash';
import MapLegend from "./MapLegend";
import PreferencesLegendDisplay from "./PreferencesLegendDisplay";
import Modal from "react-responsive-modal";
import {Link} from "react-router-dom";


export class MapResultsOpenlayers extends Component {
    constructor(props) {
        super(props);
        this.state = {loading:true,
            projection: "EPSG:3857",
            colorMax: props.colorMax,
            colorMin: props.colorMin,
            opacity: props.opacity || 0.9,
            renderModal: false}
        this.colorMixer = new ColorMixerUtil();
    };

    setStateAsync = updater => new Promise(resolve => this.setState(updater, resolve))

    async componentDidMount() {
        await this.getLayers();
        await this.obtainLegened();
    }

    getLayers = async () => {
        await this.setExtremeValues();
        const projection = this.state.projection;
        const geojson = this.props.geojson;

        geojson.crs = {
            'type': 'name',
            'properties': {
                'name': projection
            }
        };
        const features = (new GeoJSON()).readFeatures(geojson, {
            featureProjection: projection,
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
                        color: fillColor,
                        opacity:fillOpacity
                    }),
                    stroke: new Stroke({
                        color: 'green',
                        width: 1
                    }),
                    opacity:fillOpacity
                });

                return [styleCache];
            }
        }

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            opacity:this.state.opacity,
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

        this.addClickEvents(map);
    }

    setExtremeValues = async () => {
        const propertyDisplayed = this.props.propertyDisplayed;
        let max = this.props.intervalsValuesObject[propertyDisplayed].max || 1;
        let min = this.props.intervalsValuesObject[propertyDisplayed].min || 0;
        let unit = "";
        const extremeValues = {propertyDisplayed, min, max, unit};
        await this.setStateAsync({extremeValues});
    }

    addClickEvents = (map)=>{
        map.on('click', (evt) => {
            const feature = map.forEachFeatureAtPixel(evt.pixel,
                function (feature, layer) {
                    return feature;
                });
            const data = omit(feature.values_, ['geometry']);
            this.setState({selectedFeatureData:data, renderModal:true});
        });
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
                {this.getModal()}
                <div className="container-map">
                    <div className="row legend">
                        <div className="col-sm-4"> {this.state.legend}</div>
                    </div>
                    <div className="">
                        <div id="mapOL" className='map-box'></div>
                    </div>
                </div>
            </div>
        )
    }

    getModal() {
        if (this.state.selectedFeatureData){
            const dataKeys = Object.keys(this.state.selectedFeatureData);
            return (
                <Modal open={this.state.renderModal} onClose={this.onCloseModal} center>
                    <h4>Datos</h4>
                    <div className="table-responsive table-big">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">parametro</th>
                                <th scope="col">valor</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dataKeys.map((key, index) =>
                                <tr key={index}>
                                    <td>{key}:</td>
                                    <td>{this.state.selectedFeatureData[key]}</td>
                                </tr>
                            )}

                            </tbody>
                        </table>
                    </div>
                </Modal>
            );
        }

    }

    onCloseModal = () => {
        this.setState({renderModal: false});
    };

}
