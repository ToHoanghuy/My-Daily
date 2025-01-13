import {updateDoc, doc} from 'firebase/firestore';
import {db, storage} from '../../../Firebase/Firebase';
import {increment} from 'firebase/firestore';
import {ConvertMoney} from '../../CustomComponents/ConvertMoney';
import {
  getStorage,
  ref,
  deleteObject,
  getDownloadURL,
  uploadString,
} from 'firebase/storage';

const updateDataPlan = async (uid, id, plan) => {
  await updateDoc(doc(db, `/USER/${uid}/Plan`, id), plan);
};
const updateCurrentPlan = async (uid, id, oldValue = 0, newValue) => {
  await updateDoc(doc(db, `/USER/${uid}/Plan`, id), {
    current: increment(-oldValue + newValue),
  });
};

const updateIO = async (
  uid,
  walletName,
  IO,
  note,
  newValue,
  currency,
  imagePicker,
  currentImage,
) => {
  let io = IO.item.income;
  let wallet = walletName.name;
  let data = IO.item.item;
  let toCurrency = walletName.currency;
  let listCurrentId = imagePicker.map(image => image.imageID);
  let tmpURL = [...currentImage];
  data.image.map(image => {
    if (!listCurrentId.includes(image.imageID))
      deleteObject(
        ref(
          getStorage(),
          `/InOutImage/${uid}/${data.detailID}/${image.imageID}`,
        ),
      );
  });
  if ([...imagePicker, ...currentImage].length > 0) {
    await new Promise(resolve => {
      imagePicker.forEach(async (image, index) => {
        const storageRef = ref(
          storage,
          `InOutImage/${uid}/${data.detailID}/${image.imageID}`,
        );
        if (typeof global.atob === 'undefined') {
          global.atob = value => Buffer.from(value, 'base64').toString();
        }
        const Blob = global.Blob;
        delete global.Blob;
        await uploadString(storageRef, image.base64, 'base64', {
          contentType: image.type,
        })
          .then(() => {
            getDownloadURL(storageRef).then(url => {
              tmpURL.push({url: url, imageID: image.imageID});
              if (index === imagePicker.length - 1) {
                resolve(tmpURL);
              }
            });
          })
          .then(() => (global.Blob = Blob));
      });
    }).then(async listImage => {
      if (newValue === data.value) {
        await updateDoc(
          doc(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${io}/${IO.item.name.EN}/Detail/${data.detailID}`,
          ),
          {
            note: note,
            image: listImage,
          },
        );
      } else {
        ConvertMoney(currency, toCurrency, newValue).then(async value => {
          let gap = value - data.value;
          await updateDoc(
            doc(
              db,
              `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${io}/${IO.item.name.EN}/Detail/${data.detailID}`,
            ),
            {
              value: increment(gap),
              note: note,
              image: listImage,
            },
          );
          await updateDoc(
            doc(
              db,
              `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${io}/${IO.item.name.EN}`,
            ),
            {
              value: increment(gap),
            },
          );
          if (io === 'Income') {
            await updateDoc(
              doc(
                db,
                `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}`,
              ),
              {
                income: increment(gap),
              },
            );
            await updateDoc(
              doc(
                db,
                `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}`,
              ),
              {
                income: increment(gap),
              },
            );
            await updateDoc(
              doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}`),
              {
                income: increment(gap),
              },
            );
            await updateDoc(doc(db, `/USER/${uid}/Wallet/${wallet}`), {
              value: increment(gap),
            });
          } else {
            await updateDoc(
              doc(
                db,
                `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}`,
              ),
              {
                outcome: increment(gap),
              },
            );
            await updateDoc(
              doc(
                db,
                `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}`,
              ),
              {
                outcome: increment(gap),
              },
            );
            await updateDoc(
              doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}`),
              {
                outcome: increment(gap),
              },
            );
            await updateDoc(doc(db, `/USER/${uid}/Wallet/${wallet}`), {
              value: increment(-gap),
            });
          }
        });
      }
    });
  } else {
    if (newValue === data.value) {
      await updateDoc(
        doc(
          db,
          `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${io}/${IO.item.name.EN}/Detail/${data.detailID}`,
        ),
        {
          note: note,
          image: [],
        },
      );
    } else {
      ConvertMoney(currency, toCurrency, newValue).then(async value => {
        let gap = value - data.value;
        await updateDoc(
          doc(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${io}/${IO.item.name.EN}/Detail/${data.detailID}`,
          ),
          {
            value: increment(gap),
            note: note,
            image: [],
          },
        );
        await updateDoc(
          doc(
            db,
            `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${io}/${IO.item.name.EN}`,
          ),
          {
            value: increment(gap),
          },
        );
        if (io === 'Income') {
          await updateDoc(
            doc(
              db,
              `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}`,
            ),
            {
              income: increment(gap),
            },
          );
          await updateDoc(
            doc(
              db,
              `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}`,
            ),
            {
              income: increment(gap),
            },
          );
          await updateDoc(
            doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}`),
            {
              income: increment(gap),
            },
          );
          await updateDoc(doc(db, `/USER/${uid}/Wallet/${wallet}`), {
            value: increment(gap),
          });
        } else {
          await updateDoc(
            doc(
              db,
              `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}`,
            ),
            {
              outcome: increment(gap),
            },
          );
          await updateDoc(
            doc(
              db,
              `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}`,
            ),
            {
              outcome: increment(gap),
            },
          );
          await updateDoc(
            doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}`),
            {
              outcome: increment(gap),
            },
          );
          await updateDoc(doc(db, `/USER/${uid}/Wallet/${wallet}`), {
            value: increment(-gap),
          });
        }
      });
    }
  }
};
export {updateDataPlan, updateCurrentPlan, updateIO};
