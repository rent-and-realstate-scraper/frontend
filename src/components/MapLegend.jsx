import React, { Component } from 'react';
import ColorMixerUtil from './utils/ColorMixerUtil';

class MapLegend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxValue: props.maxValue,
            minValue: props.minValue,
            unit: props.unit,
            colorMax: props.colorMax,
            colorMin: props.colorMin,
            legend: null,
            width:0,
            height:0
        };
        this.colorMixer = new ColorMixerUtil();

    }
    render() {
        return (<div>{this.generateLegend()}</div>);
    }

    generateLegend = () => {
        let parts = [];
        const size = 15;
        for (let i = 0; i <= size; i++) { parts.push(i / size) }
        const min = Math.round(this.props.minValue * 1000) / 1000 + this.props.unit;
        const max = Math.round(this.props.maxValue * 1000) / 1000 + this.props.unit;
        const color1 = this.props.colorMax;
        const color2 = this.props.colorMin;
        if (this.state.width<400){
            return (<div>
                <div><b>{this.props.label + ":"}&nbsp;&nbsp;</b></div>
                <span>{min}</span>
                {parts.map((part, index) =>
                    <span key={index} style={{ backgroundColor: this.colorMixer.colorMixer(color1, color2, part) }}>&nbsp;</span>)}
                <span>&nbsp;{max}</span>
            </div>);
        } else {
            return (<div>
                <b>{this.props.label + ":"}&nbsp;&nbsp;</b>
                <span>{min}</span>
                {parts.map((part, index) =>
                    <span key={index} style={{ backgroundColor: this.colorMixer.colorMixer(color1, color2, part) }}>&nbsp;</span>)}
                <span>&nbsp;{max}</span>
            </div>);
        }
        
    }
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
      }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }
      
    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
}

export default MapLegend;
