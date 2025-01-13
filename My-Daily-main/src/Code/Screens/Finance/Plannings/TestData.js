import {uuidv4} from '@firebase/util';
const TestData = [...new Array(5)].fill({
  budget: 100000,
  current: 0,
  currency: 'VND',
  dateFinish: new Date(),
  dateStart: new Date(),
  isIncomePlan: false,
  planName: 'Plan',
  planId: uuidv4(),
  status: false,
});

export default TestData;
