import React, { Component } from 'react';
import { updateUser, getUser } from '../redux/actions';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import { SketchPicker } from 'react-color';
import ColorMixerUtil from './utils/ColorMixerUtil';
import { FaEdit } from 'react-icons/fa';

class PreferencesMapMenu extends Component {
    constructor(props) {
        super(props);
        this.colorMixer = new ColorMixerUtil();

        this.state = {
            colorMax: props.colorMax,
            colorMin: props.colorMin,
            opacity: props.opacity || 0.9,
            renderModal:false
        }

    }
    componentDidMount(){
       
    }

    onEditPreferences = ()=>{
        this.setState({renderModal:true});
    }
    onCloseModal = () =>{
        this.setState({renderModal:false});
    }
    handleChangeComplete = (color) => {
        this.setState({ colorMax: this.colorMixer.covertFromColorPickerOutput(color.rgb) });
        console.log(color.rgb);
        this.props.updateColor(this.state.colorMax);
      };
    render() {
        return (
            <div>
                <button className="btn btn-light" onClick={this.onEditPreferences}><FaEdit /> Editar colores</button>
            <Modal open={this.state.renderModal} onClose={this.onCloseModal} center>
                <SketchPicker
                    color={ this.state.colorMax }
                    onChangeComplete={ this.handleChangeComplete }
                />
                <br></br>
                <div className="form-group row">
                    <label htmlFor="sel1" className="col-3 col-form-label">opacidad</label>
                    <div className="col-2">
                            <input type="text" className="form-control option" id="sel1" value={this.props.opacity} onChange={this.handleChangeOpacity}>
                            </input>
                    </div>
                </div>
            <button className="btn btn-dark" onClick={ this.onCloseModal }>Usar color</button>
            </Modal>
            </div>
        );
    }

    handleChangeOpacity = (event) => {
        this.setState({opacity:event.target.value})
        this.props.updateOpacity(event.target.value);
    }
}



const mapStateToProps = (state, ownProps) => ({
    user:state.user
});

const mapActionsToProps = {
    onUpdateUser: updateUser,
    onGetUser: getUser,
};

export default connect(mapStateToProps, mapActionsToProps)(PreferencesMapMenu);
