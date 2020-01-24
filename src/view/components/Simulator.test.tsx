import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl';
import App from '../App';

test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
  });

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IntlProvider locale="en"><App/></IntlProvider>, div);
  ReactDOM.unmountComponentAtNode(div);
});