import {View, Text, Pressable} from 'react-native';
import React from 'react';
import notifee, {
  AndroidBadgeIconType,
  AndroidImportance,
  AndroidVisibility,
  EventType,
  TriggerType,
} from '@notifee/react-native';
import {useEffect} from 'react';
import {uuidv4} from '@firebase/util';
const TestNotification = () => {
  useEffect(() => {
    notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS && detail.pressAction.id) {
        console.log('User pressed ', detail.pressAction.launchActivity);
      }
    });
  }, []);
  useEffect(() => {
    notifee.onBackgroundEvent(({type, detail}) => {
      if (type === EventType.PRESS && detail.pressAction.id) {
        console.log('User pressed ', detail.pressAction.launchActivity);
      }
    });
  });
  const Importance = [
    AndroidImportance.NONE,
    AndroidImportance.MIN,
    AndroidImportance.LOW,
    AndroidImportance.DEFAULT,
    AndroidImportance.HIGH,
  ];
  async function onDisplayNotification(
    chanelID,
    chanelName,
    title,
    content,
    importance,
  ) {
    const id = uuidv4();

    const channelId = await notifee.createChannel({
      id: chanelID,
      name: chanelName,
      badge: true,
      lights: true,
      lightColor: 'white',
      vibration: true,
      vibrationPattern: [400, 600],
    });
    // Display a notification
    await notifee.displayNotification({
      id: id,
      title: `<p>${title}</p>`,
      subtitle: `<p style="color:#fb0102">Warning!!!</p>`,
      body: content,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        showTimestamp: true,
        badgeIconType: AndroidBadgeIconType.SMALL,
        visibility: AndroidVisibility.PRIVATE,
        importance: Importance[importance],
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'PlanOvercome',
          launchActivity: 'default',
        },
      },
    });
  }
  const scheduleTimeNotification = async (
    chanelID,
    chanelName,
    title,
    content,
    importance,
    time,
  ) => {
    const id = uuidv4();
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: time,
    };
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
        title: title,
        body: content,
        android: {
          channelId,
          importance: Importance[importance],
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
  const deleteNotification = async notificationId => {
    console.log('Delete', notificationId);
    // const channelId = await notifee.createChannel({
    //   id: 'PlanOvercome',
    //   name: 'Outcome overcome the amount of money has in wallet',
    //   badge: true,
    // });
    await notifee.deleteChannel('Default Channel');
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Pressable
        onPress={() =>
          onDisplayNotification(
            'PlanOvercome',
            'Outcome overcome the amount of money has in wallet',
            'Outcome over wallet limit',
            'Please!! Check your wallet to have another plan.',
            4,
          )
        }
        style={{
          backgroundColor: 'orange',
          padding: 20,
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 24,
          }}>
          Push Notification
        </Text>
      </Pressable>
      <Pressable
        onPress={() =>
          scheduleTimeNotification(
            'PlanOvercome',
            'Outcome overcome the amount of money has in wallet',
            'Outcome over wallet limit',
            'Please!! Check your wallet to have another plan.',
            4,
            new Date(Date.now()).getTime() + 1000 * 60 * 6,
          )
        }
        style={{
          backgroundColor: 'orange',
          padding: 20,
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 24,
          }}>
          Schedule Notification
        </Text>
      </Pressable>
      <Pressable
        onPress={() => deleteNotification('PlanOvercome')}
        style={{
          backgroundColor: 'orange',
          padding: 20,
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 24,
          }}>
          Delete Notification
        </Text>
      </Pressable>
    </View>
  );
};

export default TestNotification;
