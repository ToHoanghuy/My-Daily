import {Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import BarChart from '../../src/Code/CustomComponents/ChartComponent/BarChart';

const currency = 'VND';
const legendIncome = 'Income';
const legendOutcome = 'Outcome';
const computeMonetary = (value, yAxisTitle) => {
  return Math.round((value / Math.pow(10, yAxisTitle * 3)) * 100) / 100;
};
describe('Test feature of bar chart component', () => {
  test('render bar chart', () => {
    const TEST_CASE = [
      {month: 'Jan', income: 1023, outcome: 2123},
      {month: 'Feb', income: 4432, outcome: 1234},
      {month: 'Mar', income: 13123344, outcome: 32424},
      {month: 'Apr', income: 998, outcome: 1234},
      {month: 'Jun', income: 998, outcome: 1234},
      {month: 'Jul', income: 998, outcome: 1234},
      {month: 'Aug', income: 1233, outcome: 1234},
      {month: 'Sep', income: 998, outcome: 456},
      {month: 'Oct', income: 133, outcome: 1234},
      {month: 'Nov', income: 998, outcome: 1234},
      {month: 'Dec', income: 998, outcome: 1234},
    ];
    render(
      <BarChart
        typeStatistic={'Year'}
        height={500}
        backgroundColor={'white'}
        paddingLeft={50}
        paddingRight={40}
        paddingTop={50}
        paddingBottom={30}
        data={TEST_CASE}
        gap_xAxis={80}
        barWidth={30}
        barColorIncome={'#59e012'}
        barColorOutcome={'#FF5C00'}
        barRadius={10}
        title_xAxis={'Month'}
        title_yAxis={currency}
        itemPress={{month: 1, valueIncome: 100, valueOutcome: 150}}
        setItemPress={() => {}}
        language={'English'}
        legendIncome={legendIncome}
        legendOutcome={legendOutcome}
      />,
    );
    {
      /*Test show title legend */
    }
    const titleIncomes = screen.getAllByTestId('titleIncome');
    const titleOutcomes = screen.getAllByTestId('titleOutcome');
    titleIncomes.map(titleIncome =>
      expect(titleIncome.props.children).toBe(legendIncome),
    );
    titleOutcomes.map(titleOutcome =>
      expect(titleOutcome.props.children).toBe(legendOutcome),
    );
    {
      /*Test show result IO */
    }
    let sumIncome = TEST_CASE.reduce(
      (preValue, curValue) => preValue + curValue.income,
      0,
    );

    let sumOutcome = TEST_CASE.reduce(
      (preValue, curValue) => preValue + curValue.outcome,
      0,
    );

    expect(
      screen.getByTestId('resultIncome&titleyAxis').props.children.join(''),
    ).toBe(`${sumIncome} ${currency}`);
    expect(
      screen.getByTestId('resultOutcome&titleyAxis').props.children.join(''),
    ).toBe(`${sumOutcome} ${currency}`);

    {
      /*Test show value on top of each bar */
    }
    const list_value_outcome = [
      ...screen
        .getAllByTestId('value_Outcome')
        .map(value => +value.props.children.props.children),
    ];
    const list_value_testcase_outcome = [
      ...TEST_CASE.map(test => test.outcome),
    ];
    expect(list_value_outcome).toStrictEqual(list_value_testcase_outcome);

    const list_value_income = [
      ...screen
        .getAllByTestId('value_Income')
        .map(value => +value.props.children.props.children),
    ];
    const list_value_testcase_income = [...TEST_CASE.map(test => test.income)];
    expect(list_value_income).toStrictEqual(list_value_testcase_income);
  });
});
