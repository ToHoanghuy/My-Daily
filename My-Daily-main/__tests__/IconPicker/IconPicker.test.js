import IconPicker from '../../src/Code/CustomComponents/IconPicker';
import {render, screen, fireEvent} from '@testing-library/react-native';
describe('Test IconPicker', () => {
  test('render icon picker', () => {
    const setOpen = jest.fn();
    const setIconPicker = jest.fn();
    render(
      <IconPicker
        open={true}
        setOpen={setOpen}
        setIconPicker={setIconPicker}
      />,
    );
    const title = screen.getByTestId('Title');
    expect(title.props.children).toBe('Category');
    fireEvent.press(screen.getByTestId('Close'));
    expect(setOpen).toBeCalled();
    fireEvent.press(screen.getByTestId('Choose'));
    expect(setIconPicker).toBeCalled();
    fireEvent.press(screen.getByTestId('PressItem0'));
    expect(screen.getByTestId('PressItem0').props.style[1].borderWidth).toBe(2);
  });
});
