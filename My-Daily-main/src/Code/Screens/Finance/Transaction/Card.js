import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import {useState} from 'react';
import {collection, getDocs, query} from 'firebase/firestore';
import {db} from '../../../../Firebase/Firebase';
import {useEffect} from 'react';
import {styles} from './ListCard';
import {useSelector} from 'react-redux';
import {useCallback} from 'react';
const ITEM_HEIGHT = 60;

const Card = ({
  currency,
  wallet,
  date,
  month,
  year,
  setInout,
  setOpenDetailIO,
  setOpenDetail,
  language,
}) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState([]);
  const uid = useSelector(state => state.UserSetting).id;
  useEffect(() => {
    const getDB = async (wallet, year, month, date) => {
      const getIncome = await getDocs(
        query(
          collection(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/Income/`,
          ),
        ),
      );

      const getOutcome = await getDocs(
        query(
          collection(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/Outcome`,
          ),
        ),
      );
      if (getIncome.empty) {
        new Promise(resolve => {
          let tmp = [];
          getOutcome.docs.map(async item => {
            const getDetailOutcome = await getDocs(
              collection(
                db,
                `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/Outcome/${
                  item.data().name.EN
                }/Detail`,
              ),
            );
            getDetailOutcome.forEach(value => {
              tmp.push({
                item: value.data(),
                income: 'Outcome',
                name: item.data().name,
              });
            });
            if (item.id === getOutcome.docs[getOutcome.docs.length - 1].id) {
              resolve(tmp);
            }
          });
        }).then(data => setDetail(data));
      } else if (getOutcome.empty) {
        new Promise(resolve => {
          let tmp = [];
          getIncome.docs.map(async item => {
            const getDetailIncome = await getDocs(
              collection(
                db,
                `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/Income/${
                  item.data().name.EN
                }/Detail`,
              ),
            );
            getDetailIncome.forEach(value => {
              tmp.push({
                item: value.data(),
                income: 'Income',
                name: item.data().name,
              });
            });
            if (item.id === getIncome.docs[getIncome.docs.length - 1].id) {
              resolve(tmp);
            }
          });
        }).then(data => setDetail(data));
      } else {
        Promise.all([
          new Promise(resolve => {
            let tmp = [];
            getIncome.docs.map(async item => {
              const getDetailIncome = await getDocs(
                collection(
                  db,
                  `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/Income/${
                    item.data().name.EN
                  }/Detail`,
                ),
              );
              getDetailIncome.docs.map(value => {
                tmp.push({
                  item: value.data(),
                  income: 'Income',
                  name: item.data().name,
                });
              });
              if (item.id === getIncome.docs[getIncome.docs.length - 1].id) {
                resolve(tmp);
              }
            });
          }),

          new Promise(resolve => {
            let tmp = [];
            getOutcome.docs.map(async item => {
              const getDetailOutcome = await getDocs(
                collection(
                  db,
                  `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${date}/Outcome/${
                    item.data().name.EN
                  }/Detail`,
                ),
              );
              getDetailOutcome.forEach(value => {
                tmp.push({
                  item: value.data(),
                  income: 'Outcome',
                  name: item.data().name,
                });
              });
              if (item.id === getOutcome.docs[getOutcome.docs.length - 1].id) {
                resolve(tmp);
              }
            });
          }),
        ]).then(([value1, value2]) => {
          setDetail([...value1, ...value2].flat());
        });
      }
    };

    getDB(wallet, year, month, date).then(() => setLoading(false));
  }, []);
  const CardDetail = useCallback(
    (item, index) => {
      return (
        <Pressable
          key={index}
          onPress={() => {
            setInout({item: item, year: year, month: month, date: date});
            setOpenDetailIO(true);
          }}
          style={{
            height: ITEM_HEIGHT,
          }}>
          <View
            style={[
              styles.cardPressable,
              {
                paddingVertical: 8,
                flexWrap: 'wrap',
                flex: 1,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '60%',
              }}>
              <View
                style={[
                  styles.icon,
                  {
                    backgroundColor: item.item.color,
                  },
                ]}>
                <FontAwesome
                  name={item.item.iconName}
                  size={20}
                  color={'#FFFFFF'}
                />
              </View>

              <Text numberOfLines={1} style={styles.itemTxt}>
                {language === 'English' ? item.name.EN : item.name.VN}
              </Text>
            </View>

            <Text
              style={[
                styles.itemTxt,
                {
                  textAlign: 'right',
                  color:
                    item.income === 'Income'
                      ? ColorCustom.blue
                      : ColorCustom.orange,
                },
              ]}>
              {item.item.value.toPrecision(4)} {currency}
            </Text>
          </View>
        </Pressable>
      );
    },
    [detail],
  );

  return (
    <>
      {loading ? (
        <ActivityIndicator color={ColorCustom.green} size={'large'} />
      ) : (
        <ScrollView
          style={{
            height: detail.length > 6 ? 6 * 60 : detail.length * 60,
          }}
          renderToHardwareTextureAndroid
          removeClippedSubviews
          nestedScrollEnabled>
          {detail.map((item, index) => {
            return CardDetail(item, index);
          })}
        </ScrollView>
      )}
    </>
  );
};

export default Card;
