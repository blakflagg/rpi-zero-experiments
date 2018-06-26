import React from 'react';
import { shallow } from 'enzyme';
import LoadingPage from '../../components/LoadingPage';
import { ENETRESET } from 'constants';

test ('should correctly render LoadingPage', () => {
  const wrapper = shallow(<LoadingPage />);
  expect(wrapper).toMatchSnapshot();
});