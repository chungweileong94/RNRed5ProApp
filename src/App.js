import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import BroadcastScreen from './screens/BroadcastScreen';

const AppStack = createStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <AppStack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
          <AppStack.Screen name="Home" component={HomeScreen} />
          <AppStack.Screen name="Broadcast" component={BroadcastScreen} options={{gestureEnabled: false}} />
        </AppStack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
