import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionSpecs, CardStyleInterpolators} from '@react-navigation/stack';
import {StatusBar, Platform} from 'react-native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
// eslint-disable-next-line import/no-unresolved
import {getDefaultHeaderHeight} from '@react-navigation/stack/src/views/Header/HeaderSegment';

import HomeScreen from './screens/HomeScreen';
import BroadcastScreen from './screens/BroadcastScreen';
import {primaryColor} from './var/theme';
import ViewerScreen from './screens/ViewerScreen';
import urls from './var/urls';

const AppStack = createStackNavigator();

const App = () => {
  const windowDimen = useWindowDimensions();

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerStatusBarHeight: Platform.select({android: 0}),
            headerStyle: {
              backgroundColor: primaryColor,
              ...Platform.select({
                android: {
                  height: getDefaultHeaderHeight(windowDimen, StatusBar.currentHeight),
                },
              }),
            },
            headerTintColor: '#fff',
            headerTitleContainerStyle: {
              paddingTop: StatusBar.currentHeight,
            },
            headerLeftContainerStyle: {
              paddingTop: StatusBar.currentHeight,
            },
            headerRightContainerStyle: {
              paddingTop: StatusBar.currentHeight,
            },
            headerTitleAlign: 'center',
            transitionSpec: {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <AppStack.Screen name={urls.HOME} component={HomeScreen} />
          <AppStack.Screen name={urls.BROADCAST} component={BroadcastScreen} options={{gestureEnabled: false}} />
          <AppStack.Screen name={urls.VIEWER} component={ViewerScreen} />
        </AppStack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
