import {View, Text, Button, Pressable} from 'react-native';
import React from 'react';
import Icons from '../../Assets/Data/Icons';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {db} from '../../../Firebase/Firebase';
import {COLORS} from '../../Assets/Data/Colors';
import {FONTAWESOME_ICONS} from '../../Assets/Data/Icons';
import {uuidv4} from '@firebase/util';

import {useState} from 'react';
const DATA_NAME = [
  {
    header: 'aliquaexcepteuradquienimcons',
    description: 'dodolorsinteuofficiafugiatmag',
  },
  {
    header: 'mollitcillumessepariaturlab',
    description: 'laboredeseruntcillumad',
  },
  {
    header: 'Iwona Sithole',
    description: 'Zboncak Harbor',
  },
  {
    header: 'Joanna Birgisdóttir',
    description: 'Forest Path',
  },
  {
    header: 'TanKhang178.3639774377912',
    description: 'Are you oke 111  ',
  },
  {
    header: 'Pedro Esteban',
    description: 'Georgiana Throughway',
  },
  {
    header: 'occaecatcupidatat',
    description: 'culpaadipisicingaliquipmagna',
  },
  {
    header: 'cupidatatculpaexcept',
    description: 'commodoipsummagnaquis',
  },
  {
    header: 'proidentnostrudv',
    description: 'reprehenderitdolaboriseai',
  },
  {
    header: 'Anton Ito',
    description: 'Carmelo Plaza',
  },
  {
    header: 'Nguyen Thi Nho',
    description: 'Nho',
  },
  {
    header: 'euametsitanimvelitn',
    description: 'doloreanimutsit',
  },
  {
    header: 'Horst Young',
    description: 'Dianna Inlet',
  },
  {
    header: 'nullaconsequatconse',
    description: 'adsunteaanimcillumexcept',
  },
  {
    header: 'elitofficiaduiseacommod',
    description: 'incididuntanima',
  },
  {
    header: 'Grzegorz Schäfer',
    description: 'Abbott Square',
  },
  {
    header: 'enimconsequatesteairurel',
    description: 'aliquipexercitationmo',
  },
  {
    header: 'nostrudoccaecatexLoremesti',
    description: 'aliquipsuntdeser',
  },
  {
    header: 'Kevin Malinowski',
    description: 'Curt Locks',
  },
  {
    header: 'Alberto Novotný',
    description: 'Cade Forks',
  },
  {
    header: 'Sombun Egorova',
    description: 'Tremblay Springs',
  },
  {
    header: 'ealaborisdolorcommodoreprehe',
    description: 'velitaliquipdolaboredes',
  },
  {
    header: 'ullamcoetlaborumenima',
    description: 'proidentsintullamcodolorfugi',
  },
  {
    header: 'Sunday Svobodová',
    description: 'Fannie Loaf',
  },
  {
    header: 'TanKhang248.1152249930248',
    description: 'Are you oke 111  ',
  },
  {
    header: 'Katsumi Martínez',
    description: 'Collins Lane',
  },
  {
    header: 'minimlaborisineuetinips',
    description: 'occaecatsitveniamLoremutinla',
  },
  {
    header: 'My name is Kkkkk',
    description: 'Helo helo',
  },
  {
    header: 'commodoreprehenderitinutinci',
    description: 'adelitnonipsumquis',
  },
  {
    header: 'Ngozi De-Jong',
    description: 'Howell Vista',
  },
  {
    header: 'Koichi Helgadóttir',
    description: 'Leffler Fields',
  },
  {
    header: 'excepteurreprehe',
    description: 'irureduisLoremipsu',
  },
  {
    header: 'Tal Ragnarsdóttir',
    description: 'Zboncak Harbor',
  },
  {
    header: 'Berglind Clarke',
    description: 'Curt Locks',
  },
  {
    header: 'Muhammad Chand',
    description: 'Dameon Mountain',
  },
  {
    header: 'idduisdoloreeueuutauteexerc',
    description: 'ullamcoeaullamcoaliquipdoloren',
  },
  {
    header: 'Emiko Köhler',
    description: 'Curt Locks',
  },
  {
    header: 'TanKhang194.01453223049063',
    description: 'Are you oke 111  ',
  },
  {
    header: 'Horst Æbelø',
    description: 'Dianna Inlet',
  },
  {
    header: 'mollitetauteessela',
    description: 'consecteturdoesselabori',
  },
  {
    header: 'TanKhang167.36815622885706',
    description: 'Are you oke 111  ',
  },
  {
    header: 'Laura Weiß',
    description: 'Chyna Plaza',
  },
  {
    header: 'Mo Gonzales',
    description: 'Stiedemann Field',
  },
  {
    header: 'utnullaeaadveniamni',
    description: 'nostrudametnonuteaearep',
  },
  {
    header: 'autepariaturipsumsuntdolorveni',
    description: 'eiusmoddoametoccaecatestcillum',
  },
  {
    header: 'Sommai Wojciechowski',
    description: 'Torphy Fords',
  },
  {
    header: 'Alina Ochieng',
    description: 'Forest Path',
  },
  {
    header: 'nullaminimsitfug',
    description: 'autefugiatnonenimadculpaveni',
  },
  {
    header: 'consequatnostrud',
    description: 'fugiatutexoccaecatconsectetur',
  },
  {
    header: 'Sawat Kongkaeo',
    description: 'Dorian Gateway',
  },
  {
    header: 'incididuntidvolup',
    description: 'irurelaborisveniamanimadipis',
  },
  {
    header: 'Hui Vega',
    description: 'Dameon Mountain',
  },
  {
    header: 'Asha Fröhlich',
    description: 'Harmon Lodge',
  },
  {
    header: 'nondoadipisicingc',
    description: 'nisieaaliqualabor',
  },
  {
    header: 'quialiquaconsequa',
    description: 'quiscommodoeunondolorL',
  },
  {
    header: 'sinteucillumexe',
    description: 'nisinisivoluptat',
  },
  {
    header: 'Radha Odhiambo',
    description: 'Price Spring',
  },
  {
    header: 'Ryoko Huber',
    description: 'Hauck Stream',
  },
  {
    header: 'adipisicingcommodop',
    description: 'cupidatatipsumdolorminimaliqu',
  },

  {
    header: 'sintexdositreprehenderitetci',
    description: 'magnapariaturadnisiulla',
  },
  {
    header: 'Thawi Harle',
    description: 'Conner Vista',
  },
  {
    header: 'cillumquisametnisiincididunte',
    description: 'laborumvelitqui',
  },
  {
    header: 'Bin Yamashita',
    description: 'Natalia Points',
  },
  {
    header: 'Amnuai Árnadóttir',
    description: 'Reynold Crossing',
  },
  {
    header: 'quienimcommodoculpainnu',
    description: 'enimvoluptatedositir',
  },

  {
    header: 'laborisenimLoremfugiatquirep',
    description: 'etoccaecatadipisic',
  },
];

const AddWallet = () => {
  const onAddWallet = async () => {
    console.log('ADD WALLET');
    await setDoc(doc(db, `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet`, 'SCB'), {
      name: 'SCB',
      value: 0,
    });
  };
  const onAddStatistic_Year = async (wallet, year, income = 0, outcome = 0) => {
    await setDoc(
      doc(
        db,
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}`,
      ),
      {
        income: income,
        outcome: outcome,
        year: year,
      },
    );
  };

  const onAddStatistic_Month = async (
    wallet,
    year,
    month,
    income = 0,
    outcome = 0,
  ) => {
    await setDoc(
      doc(
        db,
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}`,
      ),
      {
        income: income,
        outcome: outcome,
        month: month,
      },
    );
  };
  const onAddStatistic_Date = async (
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
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}`,
      ),
      {
        income: income,
        outcome: outcome,
        date: date,
      },
    );
  };

  const onAddStatistic_INCOME_OUTCOME = async (
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
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name}`,
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
  const onUpdate_Wallet = async (wallet, value) => {
    await updateDoc(
      doc(db, `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}`),
      {
        value: increment(value),
      },
    );
  };
  const onUpdate_Year = async (wallet, year, income = 0, outcome = 0) => {
    await updateDoc(
      doc(
        db,
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}`,
      ),
      {
        income: increment(income),
        outcome: increment(outcome),
      },
    );
  };
  const onUpdate_Month = async (
    wallet,
    year,
    month,
    income = 0,
    outcome = 0,
  ) => {
    await updateDoc(
      doc(
        db,
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}`,
      ),
      {
        income: increment(income),
        outcome: increment(outcome),
      },
    );
  };
  const onUpdate_Date = async (
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
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}`,
      ),
      {
        income: increment(income),
        outcome: increment(outcome),
      },
    );
  };
  const onUpdateStatistic_INCOME_OUTCOME = async (
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
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name}`,
      ),
      {
        value: increment(value),
      },
    );
  };
  const TF = [true, false];

  const onAddStatistic_Detail = async date => {
    const year = 2022;
    const month = 12;
    // const date = 1;
    const wallet = 'SCB';
    const isIncome = TF[Math.floor(Math.random() * 2)] ? 'Income' : 'Outcome';
    //const isIncome = 'Outcome';
    const randomID = Math.floor(Math.random() * Math.pow(10, 20));
    const name = DATA_NAME[Math.floor(Math.random() * DATA_NAME.length)].header;
    //const name = 'Sawat Kongkaeo';
    const color = COLORS[Math.floor(Math.random() * 140)];
    const value = Math.floor(Math.random() * 4000);
    const income = isIncome === 'Income' ? value : 0;
    const outcome = isIncome === 'Outcome' ? value : 0;
    const iconName =
      FONTAWESOME_ICONS[Math.floor(Math.random() * FONTAWESOME_ICONS.length)]
        .en;
    const data = {
      color: color,
      detailID: randomID,
      iconName: iconName,
      image: [],
      note: DATA_NAME[Math.floor(Math.random() * DATA_NAME.length)].description,
      time: Timestamp.fromDate(
        new Date(
          `${year}-${month}-${date} ${Math.floor(
            Math.random() * 24 + 1,
          )}:${Math.floor(Math.random() * 58 + 1)}:${Math.floor(
            Math.random() * 58 + 1,
          )}`,
        ),
      ),
      value: value,
    };
    const getDocDateItem = await getDoc(
      doc(
        db,
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name}`,
      ),
    );
    onUpdate_Wallet(wallet, income - outcome);

    if (getDocDateItem.exists()) {
      onUpdate_Year(wallet, year, income, outcome);
      onUpdate_Month(wallet, year, month, income, outcome);
      onUpdate_Date(wallet, year, month, date, income, outcome);
      onUpdateStatistic_INCOME_OUTCOME(
        wallet,
        year,
        month,
        date,
        value,
        name,
        color,
        iconName,
        isIncome,
      );
      console.log('Insert');
    } else {
      console.log('ADD');
      const getDocDate = await getDoc(
        doc(
          db,
          `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}`,
        ),
      );
      const getDocMonth = await getDoc(
        doc(
          db,
          `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}`,
        ),
      );
      const getDocYear = await getDoc(
        doc(
          db,
          `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}`,
        ),
      );
      const getDocIO = await getDoc(
        doc(
          db,
          `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name}`,
        ),
      );
      if (getDocYear.exists()) {
        onUpdate_Year(wallet, year, income, outcome);
      } else {
        onAddStatistic_Year(wallet, year, income, outcome);
      }
      if (getDocMonth.exists()) {
        console.log('Update month');

        onUpdate_Month(wallet, year, month, income, outcome);
      } else {
        console.log('Add month');
        onAddStatistic_Month(wallet, year, month, income, outcome);
      }
      if (getDocDate.exists()) {
        console.log('Update Date');
        onUpdate_Date(wallet, year, month, date, income, outcome);
      } else {
        console.log('Add date');
        onAddStatistic_Date(wallet, year, month, date, income, outcome);
      }
      if (getDocIO.exists()) {
        onUpdateStatistic_INCOME_OUTCOME(
          wallet,
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
          wallet,
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
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/${isIncome}/${name}/Detail/${randomID}`,
      ),
      data,
    );
  };
  const onAddDataStatistic = () => {
    for (let date = 1; date <= 31; date++) {
      onAddStatistic_Detail(date);
    }
  };

  const addNotification = async () => {
    const id = uuidv4();
    await setDoc(
      doc(db, `/USER/XdmQ02CvTYSG5lcUCRnOmvrb6uk2/Notification/`, id),
      {
        id,
        date: Timestamp.fromDate(new Date()),
        title: 'HELLO',
        subTitle: 'Nat ta',
        futureNotify: false,
      },
    );
  };
  const onAdd = async () => {
    let id = Math.floor(Math.random() * 10000);
    await setDoc(
      doc(
        db,
        `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Wallet/VCB/Statistic/2021/Month/1/Date/1/Outcome/Monitor/Detail/${id}`,
      ),
      {
        color: 'red',
        detailID: id,
        iconName: 'hat',
        image: [],
        plan: [],
        note: 'HELLO',
        time: Timestamp.fromDate(new Date()),
        value: 500,
        plan: [],
      },
    );
  };
  const addPlan = async () => {
    let planId = Math.floor(Math.random() * 1000000000);
    console.log(planId);
    const plan = {
      budget: Math.floor(Math.random() * 10000),
      currency: 'VND',
      currennt: Math.floor(Math.random() * 100),
      dateFinish: Timestamp.fromDate(new Date()),
      dateStart: Timestamp.fromDate(new Date()),
      isIncomePlan: false,
      planId: planId.toString(),
      planName: DATA_NAME[Math.floor(Math.random() * DATA_NAME.length)].header,
      status: true,
    };
    await setDoc(
      doc(db, `/USER/6MOoScnG18WPA5kNBGktABoiURF3/Plan/`, planId.toString()),
      {
        ...plan,
      },
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Pressable
        onPress={onAddWallet}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD WALLET</Text>
      </Pressable>
      <Pressable
        onPress={onAddStatistic_Year}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD STATISTIC YEAR</Text>
      </Pressable>

      <Pressable
        onPress={onAddStatistic_Month}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD STATISTIC MONTH</Text>
      </Pressable>

      <Pressable
        onPress={onAddStatistic_Date}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD STATISTIC DATE</Text>
      </Pressable>

      <Pressable
        onPress={onAddStatistic_INCOME_OUTCOME}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD STATISTIC INCOME</Text>
      </Pressable>
      <Pressable
        onPress={onAddStatistic_Detail}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD STATISTIC DETAIL</Text>
      </Pressable>

      <Pressable
        onPress={onUpdate_Date}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>UPDATE STATISTIC DETAIL </Text>
      </Pressable>

      <Pressable
        onPress={onAddDataStatistic}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD STATISTIC </Text>
      </Pressable>

      <Pressable
        onPress={addNotification}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD NOTIFICATION </Text>
      </Pressable>
      <Pressable
        onPress={onAdd}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD DETAIL </Text>
      </Pressable>
      <Pressable
        onPress={addPlan}
        style={{
          width: '70%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#3eb0d8',
          paddingVertical: 10,
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <Text style={{color: 'white'}}>ADD PLAN </Text>
      </Pressable>
    </View>
  );
};

export default AddWallet;
