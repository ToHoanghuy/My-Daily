import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import {db} from '../../../Firebase/Firebase';

import {convertTimestamptToDate} from '../../Screens/Finance/Notification/Notification';
const normalize = data => {
  let normal = new Map();
  data.map(item => {
    if (normal.has(item.name.EN)) {
      normal.get(item.name.EN).value += item.value;
    } else normal.set(item.name.EN, {...item});
  });
  return Array.from(normal, ([_, value]) => ({...value}));
};

const getDataMonthIncome = async (uid, year, month, wallet) => {
  let statisticMonth = {
    sumIncome: 0,
    income: [],
  };
  const getSumIO = await getDoc(
    doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}`),
  );
  if (getSumIO.exists()) {
    statisticMonth.sumIncome = getSumIO.data().income;
  }

  const snapShot = await getDocs(
    collection(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date`,
    ),
  );

  if (!snapShot.empty) {
    await new Promise(resolve => {
      snapShot.forEach(async doc => {
        const getIncome = await getDocs(
          collection(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${doc.id}/Income`,
          ),
        );
        getIncome.forEach(income => statisticMonth.income.push(income.data()));

        if (doc.id === snapShot.docs[snapShot.docs.length - 1].id) {
          statisticMonth.income = normalize(statisticMonth.income);
          resolve(statisticMonth);
        }
      });
    }).then(data => {
      return data;
    });
  }

  return statisticMonth;
};
const getDataMonthOutcome = async (uid, year, month, wallet) => {
  let statisticMonth = {
    sumOutcome: 0,
    outcome: [],
  };
  const getSumIO = await getDoc(
    doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}`),
  );
  if (getSumIO.exists()) {
    statisticMonth.sumOutcome = getSumIO.data().outcome;
  }

  const snapShot = await getDocs(
    collection(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date`,
    ),
  );

  if (!snapShot.empty) {
    await new Promise(resolve => {
      snapShot.forEach(async doc => {
        const getOutcome = await getDocs(
          collection(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${doc.id}/Outcome`,
          ),
        );

        getOutcome.forEach(outcome =>
          statisticMonth.outcome.push(outcome.data()),
        );

        if (doc.id === snapShot.docs[snapShot.docs.length - 1].id) {
          statisticMonth.outcome = normalize(statisticMonth.outcome);
          resolve(statisticMonth);
        }
      });
    }).then(data => {
      return data;
    });
  }

  return statisticMonth;
};
const getDataMonth = async (uid, year, month, wallet) => {
  let statisticMonth = {
    sumIncome: 0,
    sumOutcome: 0,
    income: [],
    outcome: [],
  };
  const getSumIO = await getDoc(
    doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}`),
  );
  if (getSumIO.exists()) {
    statisticMonth.sumIncome = getSumIO.data().income;
    statisticMonth.sumOutcome = getSumIO.data().outcome;
  }

  const snapShot = await getDocs(
    collection(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date`,
    ),
  );

  if (!snapShot.empty) {
    await new Promise(resolve => {
      snapShot.forEach(async doc => {
        const getIncome = await getDocs(
          collection(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${doc.id}/Income`,
          ),
        );
        const getOutcome = await getDocs(
          collection(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${doc.id}/Outcome`,
          ),
        );

        getIncome.forEach(income => statisticMonth.income.push(income.data()));

        getOutcome.forEach(outcome =>
          statisticMonth.outcome.push(outcome.data()),
        );

        if (doc.id === snapShot.docs[snapShot.docs.length - 1].id) {
          statisticMonth.income = normalize(statisticMonth.income);
          statisticMonth.outcome = normalize(statisticMonth.outcome);
          resolve(statisticMonth);
        }
      });
    }).then(data => {
      return data;
    });
  }

  return statisticMonth;
};

const getYears = async (uid, wallet, year) => {
  const getYears = await getDocs(
    query(
      collection(db, `/USER/${uid}/Wallet/${wallet}/Statistic`),
      where('year', '<=', year),
      orderBy('year', 'desc'),
      limit(1),
    ),
  );
  if (getYears.docs.length === 0) {
    return null;
  }
  return getYears.docs[0].data();
};
const getMonths = async (
  uid,
  wallet,
  year,
  monthStart = 1,
  monthEnd = 12,
  number = 12,
  ascend = 'asc',
) => {
  const getMonths = await getDocs(
    query(
      collection(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month`),
      where('month', '>=', monthStart),
      where('month', '<=', monthEnd),
      orderBy('month', ascend),
      limit(number),
    ),
  );
  return getMonths.docs.map(item => item.data());
};

const getDates = async (
  uid,
  wallet,
  year,
  month,
  date,
  ascend = 'desc',
  numberLimit = 1,
  startDay = 1,
) => {
  const getDates = await getDocs(
    query(
      collection(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date`,
      ),
      where('date', '<=', date),
      where('date', '>=', startDay),
      orderBy('date', ascend),
      limit(numberLimit),
    ),
  );
  return getDates.docs.map(item => item.data());
};
const getIncome = async (uid, wallet, year, month, date) => {
  const getIncome = await getDocs(
    query(
      collection(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/Income`,
      ),
    ),
  );
  return getIncome.docs.map(item => item.data());
};
const getOutcome = async (uid, wallet, year, month, date) => {
  const getOutcome = await getDocs(
    query(
      collection(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/Outcome`,
      ),
    ),
  );
  return getOutcome.docs.map(item => item.data());
};

const getAllPlan = async (uid, limit = 5) => {
  const getPlans = await getDocs(
    query(collection(db, `/USER/${uid}/Plan`), orderBy('dateStart', 'desc')),
  );
  if (getPlans.docs.length > 0) {
    const allPlans = getPlans.docs.map(plan => ({
      ...plan.data(),
      dateStart: convertTimestamptToDate(plan.data().dateStart),
      dateFinish: convertTimestamptToDate(plan.data().dateFinish),
    }));
    return [...allPlans];
  } else return [];
};
const getDataWallet = async uid => {
  let wallets = [];
  const snapShot = await getDocs(collection(db, `/USER/${uid}/Wallet`));
  snapShot.forEach(e => wallets.push(e.data()));
  return wallets;
};
const getFromDateToDate = async (
  uid,
  wallet,
  startYear,
  startMonth,
  endMonth,
  startDate,
  endDate,
) => {
  let tmp = [];
  if (startMonth === endMonth) {
    await getDates(
      uid,
      wallet,
      startYear,
      startMonth + 1,
      endDate,
      'asc',
      endDate - startDate + 1,
      startDate,
    ).then(date => {
      let tmpDate = Array.from(date, ({date, income, outcome}) => ({
        month: `${date}/${startMonth + 1}`,
        income,
        outcome,
      }));
      tmp.push(tmpDate);
    });
    return tmp.flat();
  } else {
    const maxStartMonth = new Date(startYear, startMonth, 0).getDate();
    Promise.all([
      await getDates(
        uid,
        wallet,
        startYear,
        startMonth + 1,
        maxStartMonth,
        'asc',
        maxStartMonth - startDate + 1,
        startDate,
      ).then(date => {
        let tmpDate = Array.from(date, ({date, income, outcome}) => ({
          month: `${date}/${startMonth + 1}`,
          income,
          outcome,
        }));

        tmp.push(tmpDate);
      }),
      await getDates(
        uid,
        wallet,
        startYear,
        endMonth + 1,
        endDate,
        'asc',
        endDate,
      ).then(date => {
        let tmpDate = Array.from(date, ({date, income, outcome}) => ({
          month: `${date}/${endMonth + 1}`,
          income,
          outcome,
        }));

        tmp.push(tmpDate);
      }),
    ]);
    return tmp.flat();
  }
};
const getNotification = async (uid, next = '') => {
  let q;
  if (next === '') {
    q = query(
      collection(db, `/USER/${uid}/Notification`),
      orderBy('date', 'desc'),
      limit(8),
    );
  } else {
    q = query(
      collection(db, `/USER/${uid}/Notification`),
      orderBy('date', 'desc'),
      startAfter(next),
      limit(8),
    );
  }

  const snapShot = await getDocs(q);
  let tmp = [];
  new Promise(resolve => {
    snapShot.forEach(doc => {
      tmp.push({id: doc.id, value: doc.data()});
    });
    if (tmp.length === snapShot.docs.length) {
      resolve(tmp);
    }
  }).then(value => {
    return value;
  });

  return tmp;
};
async function getDataExchange(uid, wallet) {
  let IO = {
    income: [],
    outcome: [],
  };
  const year = new Date().getFullYear();

  await new Promise(resolve => {
    getYears(uid, wallet, year).then(yearIndex => {
      if (yearIndex !== null) {
        getMonths(uid, wallet, yearIndex.year, 1, 12, 1, 'desc').then(
          monthIndex => {
            if (monthIndex.length !== 0) {
              getDates(
                uid,
                wallet,
                yearIndex.year,
                monthIndex[0].month,
                31,
                'desc',
                2,
                1,
              ).then(dateIndex => {
                if (dateIndex.length !== 0) {
                  dateIndex.map(date => {
                    Promise.all([
                      getIncome(
                        uid,
                        wallet,
                        year,
                        monthIndex[0].month,
                        date.date,
                      ),
                      getOutcome(
                        uid,
                        wallet,
                        year,
                        monthIndex[0].month,
                        date.date,
                      ),
                    ]).then(([income, outcome]) => {
                      IO.income.push(income);
                      IO.outcome.push(outcome);
                      if (dateIndex[dateIndex.length - 1].date === date.date) {
                        IO = {
                          income: normalize(IO.income.flat()),
                          outcome: normalize(IO.outcome.flat()),
                        };
                        resolve(IO);
                      }
                    });
                  });
                } else {
                  resolve({
                    income: [],
                    outcome: [],
                  });
                }
              });
            } else {
              resolve({
                income: [],
                outcome: [],
              });
            }
          },
        );
      } else {
        resolve({
          income: [],
          outcome: [],
        });
      }
    });
  }).then(value => {
    return value;
  });
  return IO;
}

export {
  getDataMonth,
  getYears,
  getMonths,
  getDates,
  getIncome,
  getOutcome,
  normalize,
  getDataWallet,
  getAllPlan,
  getDataMonthIncome,
  getDataMonthOutcome,
  getFromDateToDate,
  getNotification,
  getDataExchange,
};
