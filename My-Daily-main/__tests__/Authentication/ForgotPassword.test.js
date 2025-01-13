import ForgotPassword from '../../src/Code/Screens/AuthScreens/ForgotPassword';
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {store} from '../../src/ReduxToolKit/Store';
const navigation = jest.fn();
const PASSWORD_CASE = [
  {
    email: '',
    error: 1,
    resend: 0,
  },
  {
    email: '111',
    error: 1,
    resend: 0,
  },
  {
    email: 'nguyenthiphuongtien12e@gmail.com',
    error: 0,
    resend: 1,
  },
];
describe('TEST FORGOT PASSWORD', () => {
  test.each(PASSWORD_CASE)('Case ($email)', async ({email, error}) => {
    render(
      <Provider store={store}>
        <ForgotPassword navigation={navigation} />
      </Provider>,
    );
    fireEvent.changeText(screen.getByPlaceholderText('Email'), email);
    fireEvent.press(screen.getByTestId('button-svg'));
    expect(screen.queryAllByTestId('error-txt')).toHaveLength(error);
    //await act(() => new Promise(resolve => setImmediate(resolve)));
    //console.log('AAA', screen.getByTestId('error-txt').props);
  });
});
