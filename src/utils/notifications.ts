import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('laundry-reminders', {
      name: 'Laundry Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#42a5f5',
      sound: 'default',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get notification permissions!');
      return;
    }
  } else {
    // alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function schedulePickupNotification(
  recordId: string,
  minutesUntilPickup: number,
  enableAlarm: boolean
) {
  const trigger = {
    seconds: minutesUntilPickup * 60,
  };

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧺 Laundry Ready!',
      body: 'Your laundry should be ready for pickup now.',
      data: { recordId },
      sound: enableAlarm ? 'default' : undefined,
      priority: enableAlarm 
        ? Notifications.AndroidNotificationPriority.MAX 
        : Notifications.AndroidNotificationPriority.HIGH,
      vibrate: enableAlarm ? [0, 250, 250, 250] : [0, 250],
    },
    trigger,
  });

  return notificationId;
}

export async function schedulePickupNotificationAtTime(
  recordId: string,
  pickupTime: Date,
  enableAlarm: boolean
) {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧺 Laundry Ready!',
      body: 'Your laundry should be ready for pickup now.',
      data: { recordId },
      sound: enableAlarm ? 'default' : undefined,
      priority: enableAlarm 
        ? Notifications.AndroidNotificationPriority.MAX 
        : Notifications.AndroidNotificationPriority.HIGH,
      vibrate: enableAlarm ? [0, 250, 250, 250] : [0, 250],
    },
    trigger: {
      date: pickupTime,
    },
  });

  return notificationId;
}

export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
