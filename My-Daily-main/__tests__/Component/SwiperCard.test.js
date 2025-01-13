import SwiperCard from '../../src/Code/CustomComponents/SwiperCard';
import {render, screen, fireEvent} from '@testing-library/react-native';
import ColorCustom from '../../src/Code/Assets/Constants/ColorCustom';
const setPressType = jest.fn();
const onPress = jest.fn();
const OUTCOME_CASE = [
  {current: 0, budget: 100, iconColor: '#25A90F', alarm: 0},
  {current: 50, budget: 100, iconColor: '#25A90F', alarm: 0},
  {current: 100, budget: 100, iconColor: '#25A90F', alarm: 0},
  {current: 150, budget: 100, iconColor: '#DF2828', alarm: 1},
];
const INCOME_CASE = [
  {current: 0, budget: 100, iconColor: '#DF2828', alarm: 1},
  {current: 50, budget: 100, iconColor: '#DF2828', alarm: 1},
  {current: 100, budget: 100, iconColor: '#25A90F', alarm: 0},
  {current: 150, budget: 100, iconColor: '#25A90F', alarm: 0},
];
describe('TEST SWIPER CARD', () => {
  test.each(OUTCOME_CASE)(
    'OUTCOME ($current)',
    ({current, budget, iconColor, alarm}) => {
      render(
        <SwiperCard
          width={200}
          isIncome={false} //Outcome
          title={'Plan Outcome'}
          setPressType={setPressType}
          onPress={onPress}
          dateStart={'2023-05-31'}
          dateEnd={'2023-06-02'}
          percent={((current / budget) * 100).toFixed(0)}
          current={current}
          budget={budget}
          currency={'USD'}
          language={'Over quotar'}
          navigation={{
            navigate: jest.fn(),
            addListener: jest.fn().mockImplementation((event, callback) => {
              callback();
              return {
                remove: jest.fn(),
              };
            }),
          }}
        />,
      );
      const icon = screen.getByTestId('emoji-icon');
      const borderColor =
        screen.getByTestId('border-color').props.style[1].borderColor;
      const progressColor =
        screen.getByTestId('current-color').props.children.props.style[0]
          .backgroundColor;
      expect(icon.props.style[0].color).toBe(iconColor);
      expect(borderColor).toBe(ColorCustom.orange);
      expect(progressColor).toBe(iconColor);
      expect(screen.queryAllByTestId('alarm-txt')).toHaveLength(alarm);
      const rightPress = screen.queryAllByTestId('right-action-item-press');
      rightPress.forEach((press, index) => {
        fireEvent.press(press);
        expect(setPressType).toBeCalled();
        expect(onPress).toBeCalled();
      });
    },
  );
  test.each(INCOME_CASE)(
    'INCOME ($current)',
    ({current, budget, iconColor, alarm}) => {
      render(
        <SwiperCard
          width={200}
          isIncome={true}
          title={'Plan Income'}
          setPressType={setPressType}
          onPress={onPress}
          dateStart={'2023-05-31'}
          dateEnd={'2023-06-02'}
          percent={((current / budget) * 100).toFixed(0)}
          current={current}
          budget={budget}
          currency={'USD'}
          language={'Under quotar'}
          navigation={{
            navigate: jest.fn(),
            addListener: jest.fn().mockImplementation((event, callback) => {
              callback();
              //returning value for `navigationSubscription`
              return {
                remove: jest.fn(),
              };
            }),
          }}
        />,
      );
      const icon = screen.getByTestId('emoji-icon');
      expect(icon.props.style[0].color).toBe(iconColor);
      const borderColor =
        screen.getByTestId('border-color').props.style[1].borderColor;
      const progressColor =
        screen.getByTestId('current-color').props.children.props.style[0]
          .backgroundColor;
      expect(borderColor).toBe(ColorCustom.blue);
      expect(progressColor).toBe(iconColor);
      expect(screen.queryAllByTestId('alarm-txt')).toHaveLength(alarm);
    },
  );
});
