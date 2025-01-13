import {deleteObject, getStorage, ref} from 'firebase/storage';
import {db} from '../../../Firebase/Firebase';
import {
  deleteDoc,
  doc,
  getDocs,
  collection,
  updateDoc,
  increment,
  getDoc,
} from 'firebase/firestore';

const deleteDataPlan = async (uid, id) => {
  const getHistory = await getDocs(
    collection(db, `/USER/${uid}/Plan/${id}/History`),
  );
  if (!getHistory.empty) {
    getHistory.forEach(async history => {
      await deleteDoc(doc(db, `/USER/${uid}/Plan/${id}/History`, history.id));
    });
  }
  await deleteDoc(doc(db, `/USER/${uid}/Plan`, id));
};
const deleteIO = async (uid, walletName, IO) => {
  let wallet = walletName.name;
  let inout = IO.item.income;
  await deleteDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${inout}/${IO.item.name.EN}/Detail/${IO.item.item.detailID}`,
    ),
  );

  if (IO.item.income === 'Income') {
    await updateDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/Income/${IO.item.name.EN}`,
      ),
      {
        value: increment(-IO.item.item.value),
      },
    );

    await updateDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}`,
      ),
      {
        income: increment(-IO.item.item.value),
      },
    );
    await updateDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}`,
      ),
      {
        income: increment(-IO.item.item.value),
      },
    );
    await updateDoc(
      doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}`),
      {
        income: increment(-IO.item.item.value),
      },
    );
    await updateDoc(doc(db, `/USER/${uid}/Wallet/${wallet}`), {
      value: increment(-IO.item.item.value),
    });
  } else {
    await updateDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/Outcome/${IO.item.name.EN}`,
      ),
      {
        value: increment(-IO.item.item.value),
      },
    );

    await updateDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}`,
      ),
      {
        outcome: increment(-IO.item.item.value),
      },
    );
    await updateDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}`,
      ),
      {
        outcome: increment(-IO.item.item.value),
      },
    );
    await updateDoc(
      doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}`),
      {
        outcome: increment(-IO.item.item.value),
      },
    );
    await updateDoc(doc(db, `/USER/${uid}/Wallet/${wallet}`), {
      value: increment(IO.item.item.value),
    });
  }
};
const deleteAddition = async (uid, walletName, IO) => {
  let wallet = walletName.name;
  let inout = IO.item.income;
  const getDate = await getDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}`,
    ),
  );
  const getMonth = await getDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}`,
    ),
  );
  const getYear = await getDoc(
    doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}`),
  );
  const getDetail = await getDoc(
    doc(
      db,
      `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${inout}/${IO.item.name.EN}`,
    ),
  );
  if (getDetail.exists && getDetail.data().value === 0) {
    await deleteDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}/${inout}/${IO.item.name.EN}`,
      ),
    );
  }
  if (
    getDate.exists &&
    getDate.data().income === 0 &&
    getDate.data().outcome === 0
  ) {
    await deleteDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}/Date/${IO.date}`,
      ),
    );
  }
  if (
    getMonth.exists &&
    getMonth.data().income === 0 &&
    getMonth.data().outcome === 0
  ) {
    await deleteDoc(
      doc(
        db,
        `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}/Month/${IO.month}`,
      ),
    );
  }
  if (
    getYear.exists &&
    getYear.data().income === 0 &&
    getYear.data().outcome === 0
  ) {
    await deleteDoc(
      doc(db, `/USER/${uid}/Wallet/${wallet}/Statistic/${IO.year}`),
    );
  }
};
const deleteImage = async (uid, id, listImage) => {
  if (listImage.length > 0) {
    new Promise(resolve => {
      listImage.map(image => {
        const imageRef = ref(
          getStorage(),
          `/InOutImage/${uid}/${id}/${image.imageID}`,
        );
        deleteObject(imageRef);
        if (image.imageID === listImage[listImage.length - 1].imageID)
          resolve();
      });
    });
  }
};
const deleteWallet = async (uid, walletName) => {
  await deleteDoc(doc(db, `/USER/${uid}/Wallet/${walletName}`));
  const getYears = await getDocs(
    collection(db, `/USER/${uid}/Wallet/${walletName}/Statistic`),
  );
  getYears.docs.map(async year => {
    await deleteDoc(
      doc(db, `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}`),
    );

    const getMonths = await getDocs(
      collection(
        db,
        `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month`,
      ),
    );
    getMonths.docs.map(async month => {
      await deleteDoc(
        doc(
          db,
          `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}`,
        ),
      );

      const getDates = await getDocs(
        collection(
          db,
          `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date`,
        ),
      );
      getDates.docs.map(async date => {
        await deleteDoc(
          doc(
            db,
            `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}`,
          ),
        );
        const getIncomes = await getDocs(
          collection(
            db,
            `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}/Income`,
          ),
        );
        getIncomes.docs.map(async income => {
          await deleteDoc(
            doc(
              db,
              `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}/Income/${income.id}`,
            ),
          );

          const getDetails = await getDocs(
            collection(
              db,
              `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}/Income/${income.id}/Detail`,
            ),
          );
          getDetails.docs.map(async detail => {
            deleteImage(uid, detail.id, detail.data().image);
            await deleteDoc(
              doc(
                db,
                `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}/Income/${income.id}/Detail/${detail.id}`,
              ),
            );
          });
        });

        const getOutcomes = await getDocs(
          collection(
            db,
            `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}/Outcome`,
          ),
        );
        getOutcomes.docs.map(async outcome => {
          await deleteDoc(
            doc(
              db,
              `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}/Outcome/${outcome.id}`,
            ),
          );

          const getDetails = await getDocs(
            collection(
              db,
              `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}/Outcome/${outcome.id}/Detail`,
            ),
          );
          getDetails.docs.map(async detail => {
            deleteImage(uid, detail.id, detail.data().image);
            await deleteDoc(
              doc(
                db,
                `/USER/${uid}/Wallet/${walletName}/Statistic/${year.id}/Month/${month.id}/Date/${date.id}/Outcome/${outcome.id}/Detail/${detail.id}`,
              ),
            );
          });
        });
      });
    });
  });
};

export {deleteDataPlan, deleteIO, deleteAddition, deleteWallet};
