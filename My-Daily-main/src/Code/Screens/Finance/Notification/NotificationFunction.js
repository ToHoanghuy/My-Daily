import notifee, {
  AndroidBadgeIconType,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import {addNotificationToFirebase} from '../../../Assets/FunctionCompute/AddData';
import {PermissionsAndroid} from 'react-native';
//const dispatch = useDispatch();
const Importance = [
  AndroidImportance.NONE,
  AndroidImportance.MIN,
  AndroidImportance.LOW,
  AndroidImportance.DEFAULT,
  AndroidImportance.HIGH,
];
export const addNotification = async (
  uid,
  chanelID,
  chanelName,
  title,
  subTitle,
  importance,
  date, //Date
  isIncome,
  id,
) => {
  //const id = uuidv4();
  addNotificationToFirebase(uid, date, title, subTitle, id, false);
  const channelId = await notifee.createChannel({
    id: chanelID,
    name: chanelName,
    badge: true,
    lights: true,
    lightColor: 'white',
    vibration: true,
    vibrationPattern: [400, 600],
  });
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATION,
    );
    if (granted === 'granted') {
      await notifee.displayNotification({
        id: id,
        title: `<p>${title}</p>`,
        subtitle: !isIncome
          ? `<p style="color:#fb0102">Warning!!!</p>`
          : `<p style="color:#038103">Congratulation!!!</p>`,
        body: subTitle,
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          showTimestamp: true,
          badgeIconType: AndroidBadgeIconType.SMALL,
          visibility: AndroidVisibility.PRIVATE,
          importance: Importance[importance],
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: chanelID,
            launchActivity: 'default',
          },
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
  // Display a notification
};

export const addScheduleNotification = async (
  chanelID,
  chanelName,
  title,
  subTitle, //Date()
  id,
) => {
  const channelId = await notifee.createChannel({
    id: chanelID,
    name: chanelName,
    badge: true,
    lights: true,
    lightColor: 'white',
    vibration: true,
    vibrationPattern: [400, 600],
  });

  //Trigger
  await notifee.createTriggerNotification(
    {
      id: id,
      title: `<p>${title}</p>`,
      subtitle: `<p style="color:#fb0102">Warning!!!</p>`,
      body: subTitle,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        badgeIconType: AndroidBadgeIconType.SMALL,
        visibility: AndroidVisibility.PRIVATE,
        pressAction: {
          id: chanelID,
          launchActivity: 'default',
        },
      },
    },
    trigger,
  );
};
