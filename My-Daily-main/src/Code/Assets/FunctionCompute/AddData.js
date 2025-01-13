import {db} from '../../../Firebase/Firebase';
import {
  Timestamp,
  addDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
  collection,
} from 'firebase/firestore';
const addDataPlan = async (uid, plan) => {
  await setDoc(doc(db, `/USER/${uid}/Plan`, plan.planId), plan);
};
const addDataHistory = async (uid, id, history) => {
  await addDoc(collection(db, `/USER/${uid}/Plan/${id}/History`), history);
};
export {addDataPlan, addDataHistory};
const onAddWallet = async (uid, wallet, amount, currency) => {
  await setDoc(doc(db, `/USER/${uid}/Wallet`, wallet), {
    name: wallet,
    value: amount,
    currency: currency,
  });
};

const onAddStatistic_Year = async (
  uid,
  wallet,
  year,
  income = 0,
  outcome = 0,
) => {
  await setDoc(doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${year}`), {
    income: income,
    outcome: outcome,
    year: year,
  });
};

const onAddStatistic_Month = async (
  uid,
  wallet,
  year,
  month,
  income = 0,
  outcome = 0,
) => {
  await setDoc(
    doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}`),
    {
      income: income,
      outcome: outcome,
      month: month,
    },
  );
};
const onAddStatistic_Date = async (
  uid,
  wallet,
  year,
  month,
  date,
  income,
  outcome,
) => {
  await setDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}`,
    ),
    {
      income: income,
      outcome: outcome,
      date: date,
    },
  );
};

const onAddStatistic_INCOME_OUTCOME = async (
  uid,
  wallet,
  year,
  month,
  date,
  value,
  name,
  color,
  iconName,
  isIncome,
) => {
  await setDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name.EN}`,
    ),
    {
      color: color,
      iconName: iconName,
      isIncome: isIncome,
      name: name,
      value: value,
    },
  );
};
const onUpdate_Wallet = async (uid, wallet, value) => {
  await updateDoc(doc(db, `/USER/${uid}/Wallet/${wallet}`), {
    value: increment(value),
  });
};
const onUpdate_Year = async (uid, wallet, year, income = 0, outcome = 0) => {
  await updateDoc(doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${year}`), {
    income: increment(income),
    outcome: increment(outcome),
  });
};
const onUpdate_Month = async (
  uid,
  wallet,
  year,
  month,
  income = 0,
  outcome = 0,
) => {
  await updateDoc(
    doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}`),
    {
      income: increment(income),
      outcome: increment(outcome),
    },
  );
};
const onUpdate_Date = async (
  uid,
  wallet,
  year,
  month,
  date,
  income = 0,
  outcome = 0,
) => {
  await updateDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}`,
    ),
    {
      income: increment(income),
      outcome: increment(outcome),
    },
  );
};
const onUpdateStatistic_INCOME_OUTCOME = async (
  uid,
  wallet,
  year,
  month,
  date,
  value,
  name,
  color,
  iconName,
  isIncome,
) => {
  await updateDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name.EN}`,
    ),
    {
      value: increment(value),
    },
  );
};
const onAddStatistic_Detail = async (
  uid,
  name,
  value,
  is_Income,
  time,
  iconName,
  color,
  note,
  wallet,
  //amount,
  image,
  id,
  plan,
  //currency,
) => {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  //id = uuidv4();
  const isIncome = is_Income ? 'Income' : 'Outcome';
  const income = isIncome === 'Income' ? value : 0;
  const outcome = isIncome === 'Outcome' ? value : 0;
  const data = {
    color: color,
    detailID: id,
    iconName: iconName,
    image: image,
    note: note,
    time: time,
    value: value,
    plan: plan,
  };

  const getDocWallet = await getDoc(
    doc(db, `/USER/${uid}/Wallet/${wallet.name}`),
  );
  if (getDocWallet.exists()) {
    onUpdate_Wallet(uid, wallet.name, income - outcome);
  } else {
    onAddWallet(
      uid,
      wallet.name,
      wallet.value + income - outcome,
      wallet.currency,
    );
  }
  const getDocDateItem = await getDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet.name}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name.EN}`,
    ),
  );

  if (getDocDateItem.exists()) {
    onUpdate_Year(uid, wallet.name, year, income, outcome);
    onUpdate_Month(uid, wallet.name, year, month, income, outcome);
    onUpdate_Date(uid, wallet.name, year, month, date, income, outcome);
    onUpdateStatistic_INCOME_OUTCOME(
      uid,
      wallet.name,
      year,
      month,
      date,
      value,
      name,
      color,
      iconName,
      isIncome,
    );
  } else {
    const getDocDate = await getDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet.name}/Statistic/${year}/Month/${month}/Date/${date}`,
      ),
    );
    const getDocMonth = await getDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet.name}/Statistic/${year}/Month/${month}`,
      ),
    );
    const getDocYear = await getDoc(
      doc(db, `/USER/${uid}/Wallet/${wallet.name}/Statistic/${year}`),
    );
    const getDocIO = await getDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet.name}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name.EN}`,
      ),
    );
    if (getDocYear.exists()) {
      onUpdate_Year(uid, wallet.name, year, income, outcome);
    } else {
      onAddStatistic_Year(uid, wallet.name, year, income, outcome);
    }
    if (getDocMonth.exists()) {
      onUpdate_Month(uid, wallet.name, year, month, income, outcome);
    } else {
      onAddStatistic_Month(uid, wallet.name, year, month, income, outcome);
    }
    if (getDocDate.exists()) {
      onUpdate_Date(uid, wallet.name, year, month, date, income, outcome);
    } else {
      onAddStatistic_Date(uid, wallet.name, year, month, date, income, outcome);
    }
    if (getDocIO.exists()) {
      onUpdateStatistic_INCOME_OUTCOME(
        uid,
        wallet.name,
        year,
        month,
        date,
        value,
        name,
        color,
        iconName,
        isIncome,
      );
    } else {
      onAddStatistic_INCOME_OUTCOME(
        uid,
        wallet.name,
        year,
        month,
        date,
        value,
        name,
        color,
        iconName,
        isIncome,
      );
    }
  }
  await setDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet.name}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name.EN}/Detail/${id}`,
    ),
    data,
  );
};
const addNotificationToFirebase = async (
  uid,
  date,
  title,
  subTitle,
  id,
  futureNotify,
) => {
  await setDoc(doc(db, `/USER/${uid}/Notification/`, id), {
    id,
    date: date,
    title,
    subTitle,
    futureNotify,
  });
};
export {onAddStatistic_Detail, onAddWallet, addNotificationToFirebase};
