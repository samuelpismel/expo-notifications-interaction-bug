import React from 'react';

import {
  Text,
  View,
  Button,
  Platform,
} from 'react-native';

import Constants from 'expo-constants';

import * as Updates from 'expo-updates';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default class App extends React.Component {

  state = {
    data: null,
  }

  componentDidMount() {
    registerForPushNotificationsAsync();

    this.onResponseReceivedListener = Notifications.addNotificationResponseReceivedListener(
      this.onResponseReceived,
    );
  }

  onResponseReceived = async (response) => {
    console.log(JSON.stringify(response));

    const { data } = response?.notification?.request?.content;

    this.setState({ data });
  };

  componentWillUnmount() {
    Notifications.removeNotificationSubscription(
      this.onResponseReceivedListener,
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 25,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <View>
          <Text>The bug:</Text>
          <Text>• The `addNotificationResponseReceivedListener` is not been triggered when the app is killed and it is started via an notification interaction.</Text>
          <Text>• The bug does not occur in Expo Go, only when we install the built apk.</Text>
          <Text></Text>
          <Text>How to test:</Text>
          <Text>1. Create a build and install it in your phone via adb install</Text>
          <Text>2. Click on Send Notification button</Text>
          <Text>3. Close the app and remove it from memory</Text>
          <Text>4. Click on the notification to open the app</Text>
          <Text>5. The response data should have appeared but it will not</Text>
          <Text>6. If you click in the reload button the response data will appear</Text>
        </View>

        <Button
          title="Send Notification"
          onPress={async () => {
            await sendPushNotification();
          }}
        />

        <View>
          <Text>Response data:</Text>
          <Text>
            {JSON.stringify(this.state.data, null, 2)}
          </Text>
        </View>

        <Button
          title="Reload App"
          onPress={() => Updates.reloadAsync()}
        />
      </View>
    );
  }

}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendPushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      subtitle: 'this is the sub',
      body: 'What would you like to do with it?',
      data: {
        text: `The date is: `,
        date: Date().toString(),
      },
      categoryIdentifier: 'myCategoryName',
      badge: 1,
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS,
    );

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}
