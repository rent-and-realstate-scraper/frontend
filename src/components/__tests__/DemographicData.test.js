import React from 'react';
import { shallow, mount } from 'enzyme';
import "../setupTests"
import configureMockStore from "redux-mock-store";
import waitUntil from 'async-wait-until';
import request from 'request';
import {DemographicData} from '../DemographicData';
import { Provider } from "react-redux";


const mockStore = configureMockStore();
const store = mockStore({});

describe('DemographicData shallow', () => {
    beforeAll(async ()=>{
        const nock = require('nock');
        const nockBack = nock.back;
        nockBack.fixtures = __dirname + '/fixtures';
        nockBack.setMode('record');
        // recording of the fixture
        nockBack('results-elections.json', nockDone => {
            request.get('https://electoral-data-hub-back.herokuapp.com/parties_results/geojson?cityName=Alcorc%C3%B3n&electionType=GEN&year=2016', (err, res, body) => {
                nockDone();
            });
        });

        nockBack.setMode('wild');
        /*
        nock('https://electoral-data-hub-back.herokuapp.com')
            .get('/parties_results/geojson?cityName=Alcorc%C3%B3n&electionType=GEN&year=2016')
            .reply(200, require("./fixtures/results-elections")[0].response);
         */
    });

    it('shows geographic data for nacionalidad',  async (done) => {
         const wrapperDemographic = shallow(
                <DemographicData match={{params: {nmun:"Alcorcón", mode:"nacionalidad"}}}/>
        );
        await waitUntil(() => wrapperDemographic.state('geoJson')!== null);
        //console.log(wrapperDemographic.state());
        expect(wrapperDemographic.state().geoJson.features.length).greaterThan(1);
        done();
    });

    it('shows geographic data for indicadores',  async (done) => {
        const wrapperIndicadores = shallow(
            <DemographicData match={{params: {nmun:"Alcorcón", mode:"indicadores"}}}/>
        );
        await waitUntil(() => wrapperIndicadores.state('geoJson')!== null);
        //console.log(wrapperDemographic.state());
        expect(wrapperIndicadores.state().geoJson.features.length).greaterThan(1);
        done();
    });

    it('shows geographic data for edad padron',  async (done) => {
        const wrapperIndicadores = shallow(
            <DemographicData match={{params: {nmun:"Alcorcón", mode:"edad_padron"}}}/>
        );
        await waitUntil(() => wrapperIndicadores.state('geoJson')!== null);
        //console.log(wrapperDemographic.state());
        expect(wrapperIndicadores.state().geoJson.features.length).greaterThan(1);
        expect(wrapperIndicadores.state().geoJson.features[0].properties["%_edad_de_0_a_24"]).not.undefined;
        expect(wrapperIndicadores.state().intervalsValuesObject["%_edad_de_0_a_24"]).not.undefined;

        done();
    });

});

describe('DemographicData with store', () => {
    it('renders correctly using store', () => {
        const wrapper = mount(
            <Provider store={store}>
                <DemographicData match={{params: {nmun:"Alcorcón", mode:"nacionalidad"}}}/>
            </Provider>
        );
        console.log(wrapper.state());
        //expect(wrapper).toMatchSnapshot();
        // On the first run of this test, Jest will generate a snapshot file automatically.
    });
});