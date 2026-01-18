import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './src/Navigation';
import { registerForPushNotificationsAsync } from './src/utils/notifications';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <>
      <Navigation />
      <StatusBar style="light" />
    </>
  );
}
