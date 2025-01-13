import HeaderDrawer from '../../src/Code/CustomComponents/HeaderDrawer';
import {render, fireEvent, screen} from '@testing-library/react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

const onLeftPress = jest.fn();
const TEST_CASE = [
  {
    onLeftPress: onLeftPress,
    title: 'Overview',
    onRightPress: jest.fn(),
    isNotice: true,
    numberOfNotice: 2,
  },
  {
    onLeftPress: onLeftPress,
    title: 'Transactions',
  },
  {
    onLeftPress: onLeftPress,
    title: 'Statistic',
    isSetting: true,
    setDrawerHeight: jest.fn(),
    buttonList: [
      {
        icon_type: Entypo,
        icon_name: 'dots-three-vertical',
        onPress: jest.fn(),
      },
    ],
  },
  {
    onLeftPress: onLeftPress,
    title: 'Planning',
    buttonList: [
      {
        icon_type: Feather,
        icon_name: 'edit',
        onPress: jest.fn(),
      },
      {
        icon_type: Entypo,
        icon_name: 'dots-three-vertical',
        onPress: jest.fn(),
      },
    ],
    isSetting: true,
    setDrawerHeight: jest.fn(),
  },
  {
    onLeftPress: onLeftPress,
    title: 'Setting',
  },
  {
    onLeftPress: onLeftPress,
    title: 'Introduction',
  },
  {
    onLeftPress: onLeftPress,
    title: 'Contact Us',
  },
];
describe('TEST HEADER DRAWER', () => {
  test.each(TEST_CASE)('Render ($title)', ({...Props}) => {
    render(
      <HeaderDrawer
        onPressLeft={Props.onLeftPress}
        isNotice={Props.isNotice}
        numberOfNotice={Props.numberOfNotice}
        title={Props.title}
        buttonList={Props.buttonList}
        isSetting={Props.isSetting}
        setDrawerHeight={Props.setDrawerHeight}
      />,
    );
    fireEvent.press(screen.getByTestId('header-left-press'));
    expect(Props.onLeftPress).toBeCalled();
    Props.buttonList?.map((btn, index) => {
      fireEvent.press(
        screen.getByTestId(`header-right-${Props.title}-${index}`),
      );
      expect(btn.onPress).toBeCalled();
    });
  });
});
