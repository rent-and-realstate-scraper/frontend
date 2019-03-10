import React from 'react';
import { shallow, mount } from 'enzyme';
import "../setupTests"
import {DemographicData} from '../DemographicData';
import CusecMap from "../CusecMap";
import waitUntil from 'async-wait-until';


const intervalsValuesObject = require('./fixtures/sample_intervals');
const geoJson = require('./fixtures/sample_cusec_data');
const colorMax = "rgb(0, 153, 0)";
const colorMin = "rgb(254, 251, 233)";
const selectedStyleOption = "%_edad_de_25_a_49";

describe('Cusec map', () => {
    it('renders calculates parameters necesary to render map and renders map correctly', async (done) => {
        const wrapper = shallow(
            <CusecMap intervalsValuesObject={intervalsValuesObject}
                      geoJson={geoJson}
                      colorMax={colorMax} colorMin={colorMin}
                      propertyDisplayed={undefined}/>
        );
        wrapper.setProps({propertyDisplayed:selectedStyleOption});

        await waitUntil(() => wrapper.state('legend')!== undefined);
        const state = wrapper.state();
        expect(state.extremeValues).not.undefined;
        expect(state.extremeValues.min).not.undefined;
        expect(state.map).not.undefined;

        done();
        // expect(leafLetClass.length).greaterThan(0);
        //expect(wrapper).toMatchSnapshot();
        // On the first run of this test, Jest will generate a snapshot file automatically.
    });
});