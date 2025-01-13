export const DataConfig = (currentDate = new Date()) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const maxDateOfCurrMonth = new Date(year, month, 0).getDate();
  const maxDateOfPrevMonth = new Date(year, month - 1, 0).getDate();
  const lastDayOfPrevMonth = new Date(
    year,
    month - 2,
    maxDateOfPrevMonth,
  ).getDay();
  const firstDayOfNextMonth = new Date(year, month, 1).getDay();
  let DATA = [];
  for (let i = 0; i <= lastDayOfPrevMonth; i++) {
    DATA.push(
      new Date(year, month - 2, maxDateOfPrevMonth - lastDayOfPrevMonth + i),
    );
  }
  for (let i = 1; i <= maxDateOfCurrMonth; i++) {
    DATA.push(new Date(year, month - 1, i));
  }
  for (let i = 1; i <= 7 - firstDayOfNextMonth; i++) {
    DATA.push(new Date(year, month, i));
  }
  return DATA;
};
export const Month = {
  EN: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  VN: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
};
export const Day = {
  EN: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  VN: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};
