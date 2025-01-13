import {store} from '../../ReduxToolKit/Store';

const ConvertMoney = async (from, to, exchangeMoney) => {
  let tmp = exchangeMoney;
  if (from !== to && exchangeMoney !== 0) {
    await new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('apikey', store.getState().LinkAPI);
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
      };
      fetch(
        `https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${
          exchangeMoney * 1000
        }`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          tmp = JSON.parse(result).result;
          resolve(Math.round(tmp * 100) / 100);
          //resolve(JSON.parse(result).result);
        })
        .catch(error => {
          reject(error);
        });
    })
      .then(data => {
        return data;
      })
      .catch(e => {
        return null;
      });
  }
  return Math.round(tmp * 100) / 100;
};
const ConvertRate = async (symbols, base) => {
  let tmp = {};
  if (symbols.length !== 0) {
    await new Promise((resolve, reject) => {
      const myHeaders = new Headers();
      myHeaders.append('apikey', store.getState().LinkAPI);
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
      };
      fetch(
        `https://api.apilayer.com/fixer/latest?symbols=${symbols}&base=${base}`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          tmp = JSON.parse(result).rates;
          resolve(tmp);
        })
        .catch(error => {
          reject(error);
        });
    })
      .then(data => {
        return data;
      })
      .catch(() => {
        return null;
      });
  }
  return tmp;
};
export {ConvertMoney, ConvertRate};
