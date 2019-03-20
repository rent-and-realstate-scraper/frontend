import React, { Component } from 'react';
import { getScrapedCities, getScrapingResults } from './services/summariesService';
import {get} from 'lodash';
import { connect } from 'react-redux';
import { updateExecutionId, getExecutionId } from '../redux/actions';
import 'leaflet/dist/leaflet.css';
import MapResults from "./MapResults";
import {MapResultsOpenlayers} from "./MapResultsOpenlayers";

class ScrapingSummariesOL extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 1,
            skip: 0,
            scraping_id: props.match.params.scraping_id,
            selectedCity: "",
            styleOptions: [],
            selectedStyleOption: "",
            colorMax: "rgb(0, 153, 0)",
            colorMin: "rgb(254, 251, 233)",
            opacity:0.7,
            scrapedCities: null,
            retrievedExec: null,
            propertyDisplayed:undefined,
            map:undefined
        }
        this.changeCity = this.changeCity.bind(this);
    }

    async componentDidMount() {
        if (this.state.scraping_id) {
            const citiesObj = await getScrapedCities(this.state.scraping_id);
            const cities = [];
            citiesObj.map((city) => { cities.push(city.city_name) });
            this.setState({ scrapedCities: cities });
            if (cities[0]) {
                await this.setResultsAndGeoJson(cities[0]);
            }
            if (this.state.geoJson) {
                this.setStyleOptions();
            }
        }
    }

    setResultsAndGeoJson = async (city) => {
        this.setState({geoJson:undefined, intervalsValuesObject:undefined})
        const data = await getScrapingResults(city, this.state.scraping_id);
        const geoJson = data.geojson;
        const intervalsValuesObject = data.intervals;
        // const result = await getResults(city, this.state.scraping_id);

        this.setState({ geoJson: geoJson, intervalsValuesObject });
        //this.setState({ result: result });
    }


    render() {
        return (
             <div>
                    <br></br>
                    <br></br>
                    <br></br>
            {this.state.scrapedCities && <div className="form-inline col-sm-6 col-lg-3">
                <label htmlFor="sel1">Select city:</label>
                <select className="form-control" id="sel1" onChange={this.changeCity} value={this.state.selectedCity}>
                    {this.state.scrapedCities.map((city, index) => <option key={index} value={city}>{city}</option>)}
                </select>
            </div>}
            <br></br>
            {this.state.styleOptions && <div className="form-inline col-sm-6 col-lg-3">
                <label htmlFor="sel1">option:</label>
                <select className="form-control" id="sel1" onChange={this.changeOption} value={this.state.selectedStyleOption}>
                    {this.state.styleOptions.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>
            </div>}
            <br></br>
                <div>
                    {this.generateMap()}
                </div>

        </div>);
    }

    changeCity = async (event) => {
        const city = event.target.value;
        this.setState({ selectedCity: city });
        await this.setResultsAndGeoJson(city);
        await this.setStyleOptions();

    }

    changeOption = async (event) => {
        const option = get(event,'target.value');
        this.setState({ selectedStyleOption: undefined }, () =>{
            this.setState({ selectedStyleOption: option });
        });

    }


    generateMap = () => {
            if(this.state.intervalsValuesObject && this.state.geoJson && this.state.selectedStyleOption) {
                const propertyDisplayed = this.state.selectedStyleOption;
                const map =
                    <MapResultsOpenlayers intervalsValuesObject={this.state.intervalsValuesObject.options}
                                          colorMax={this.state.colorMax} colorMin={this.state.colorMin}
                                          propertyDisplayed={propertyDisplayed}
                                          opacity={this.state.opacity}
                                          geojson={this.state.geoJson}

                    />;
                return map;
            } else {
                return (<span>loading</span>)
            }
        }


    setStyleOptions = () => {
        console.log(this.state.geoJson);
        console.log(this.state.intervalsValuesObject);

        if (this.state.intervalsValuesObject && this.state.geoJson){
            if (this.state.geoJson.features[0]){
                const sample = this.state.geoJson.features[0].properties;
                const styleOptions = [];
                Object.keys(sample).map((key) => {
                        if (key !=="date" && key!=="name")
                        styleOptions.push(key);
                });

                this.setState({ styleOptions, selectedStyleOption: styleOptions[0] });
                this.setState({selectedStyleOption: styleOptions[1]});
                this.setState({selectedStyleOption: styleOptions[0]})

            }
        }
    }


}

const mapStateToProps = state => ({
    scrapingId: state.scrapingId
});

const mapActionsToProps = {
    onUpdateExecutionId: updateExecutionId,
    onGetExecutionId: getExecutionId,
};

export default connect(mapStateToProps, mapActionsToProps)(ScrapingSummariesOL);
