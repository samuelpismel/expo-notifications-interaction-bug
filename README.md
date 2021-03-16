The Bug
===

* The `addNotificationResponseReceivedListener` is not been triggered when the app is killed and it is started via an notification interaction.
* The bug does not occur in Expo Go, only when we install the built apk.

How to test:
=

1. Create a build and install it in your phone via `adb install`
1. Click on Send Notification button
1. Close the app and remove it from memory
1. Click on the notification to open the app
1. The response data should have appeared but it will not
1. If you click in the reload button the response data will appear

<p align="center">

![Debug App Image](https://github.com/samuelpismel/expo-notifications-interaction-bug/blob/master/assets/expo-notification-app-debug.png?raw=true)

</p>
