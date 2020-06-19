import * as firebase from 'firebase';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

const firebaseConfig = {
  apiKey: "AIzaSyBM5fUa0k3FNP3pLGsPEDpYxWLbKJOvgro",
  authDomain: "testbase-2ccfb.firebaseapp.com",
  databaseURL: "https://testbase-2ccfb.firebaseio.com",
  projectId: "testbase-2ccfb",
  storageBucket: "testbase-2ccfb.appspot.com",
  messagingSenderId: "921784230454",
  appId: "1:921784230454:web:56c0dc94957899e9a52e97"
};
  
export function firebaseInitialize() {
  firebase.initializeApp(firebaseConfig);
};

export async function registerForPushNotificationsAsync() {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { error: 'The permission hasn’t been granted'};
    }
 
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      return { token };
    } catch ({ message }) {
      return { error: message };
    }
  }

  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('default', {
      name: 'default',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250],
    });
  }
  return {};
};
