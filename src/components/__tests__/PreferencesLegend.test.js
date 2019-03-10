import React from 'react';
import { shallow, mount } from 'enzyme';
import "../setupTests"
import PreferencesLegendDisplay from "../PreferencesLegendDisplay";
import configureStore from 'redux-mock-store'


describe('Preferences legend', () => {
    const initialState = {user:"user1"};
    const mockStore = configureStore();
    let store, container;

    beforeEach(()=>{
        store = mockStore(initialState)
    })

    it('renders ', async (done) => {
        const wrapper = shallow(
            <PreferencesLegendDisplay min={0} max={33.22} store={store}/>
        );

        done();
        // expect(leafLetClass.length).greaterThan(0);
        //expect(wrapper).toMatchSnapshot();
        // On the first run of this test, Jest will generate a snapshot file automatically.
    });
});
