import React, { Component } from 'react';
import { updateUser, getUser } from '../redux/actions';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import "react-vis/dist/main.scss";
import "./styles/preferences.css"
import { FaEdit } from 'react-icons/fa';
import HistogramDataUtil from './utils/HistogramDataUtil';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, VerticalBarSeries} from 'react-vis';

class PreferencesLegendDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderModal:false,
            geoJson:this.props.geoJson,
            propertyDisplayed:this.props.propertyDisplayed,
            limitsSlider:this.props.limits,
        }
        this.histogramUtil = new HistogramDataUtil();


    }
    componentDidUpdate(prevProps, nextProps){
        if (prevProps.limits !== this.props.limits){
            const histData = Object.values(this.histogramUtil.getIntervalData(this.props.geoJson,this.props.propertyDisplayed));
            this.setState({data:histData, limitsSlider:this.props.limits});
        }
        if (prevProps.propertyDisplayed !== this.props.propertyDisplayed){
            this.setState({propertyDisplayed:this.props.propertyDisplayed, geoJson:this.props.geoJson});
        }
    }

    componentDidMount(){
        const histData = Object.values(this.histogramUtil.getIntervalData(this.props.geoJson,this.props.propertyDisplayed));
        this.setState({data:histData, limitsSlider:this.props.limits});
        this.setState({propertyDisplayed:this.props.propertyDisplayed, geoJson:this.props.geoJson});
    }


    onEditPreferences = ()=>{
        this.setState({renderModal:true});
    }
    onCloseModal = () =>{
        this.setState({renderModal:false});
    }
    handleChangeComplete = (color) => {
        this.setState({limitsSlider:color});
        //this.props.changeLimits(color);
      };

    handleUseLimits = () => {
        this.props.changeLimits(this.state.limitsSlider);
        this.setState({renderModal:false});
    }
    render() {
        return (
            <div>
                <button className="btn btn-light" onClick={this.onEditPreferences}><FaEdit />Editar límites</button>
            <Modal  className="modal-custom-container" open={this.state.renderModal} onClose={this.onCloseModal} center>
                <div className="modal-min-max">
                    <XYPlot color="blue"
                        width={300}
                        height={300}>
                        <HorizontalGridLines />
                        <VerticalBarSeries
                            data={this.state.data}/>
                        <XAxis title="puntos porcentuales (%)" unit="%"/>
                        <YAxis title={"repeticiones"}/>
                    </XYPlot>
                    <div className="slider-min-max">
                        {this.state.limitsSlider && <InputRange
                            maxValue={100}
                            minValue={0}
                            step={0.5}
                            value={this.state.limitsSlider}
                            onChange={value => this.handleChangeComplete(value)}/>
                        }
                        <button className="btn btn-dark button-use" onClick={ this.handleUseLimits }>Usar nuevos límites</button>
                    </div>

                </div>
            </Modal>
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => ({
    user:state.user
});

const mapActionsToProps = {
    onUpdateUser: updateUser,
    onGetUser: getUser,
};

export default connect(mapStateToProps, mapActionsToProps)(PreferencesLegendDisplay);
