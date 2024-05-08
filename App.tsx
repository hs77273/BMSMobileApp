import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainAppScreen from './source/MainAppScreen.js';
import BluetoothScreen from './source/BluetoothScreen.js';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={MainAppScreen} />
        <Stack.Screen name="BluetoothScreen" component={BluetoothScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;