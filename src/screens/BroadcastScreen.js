import React, {useRef, useEffect, useCallback, useLayoutEffect, useState} from 'react';
import {View, StyleSheet, BackHandler, Alert} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import BroadcastView from '../components/BroadcastView';
import IconButton from '../components/IconButton';
import Button from '../components/Button';

const BroadcastScreen = () => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const broadcastRef = useRef(null);
  const [host, setHost] = useState(null);
  const [license, setLicense] = useState(null);

  const handleOnStopPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOnSwapCameraPress = useCallback(() => {
    broadcastRef.current?.swapCamera();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton iconName="repeat" onPress={handleOnSwapCameraPress} />,
      headerLeft: () => null,
      headerStyle: {
        height: headerHeight,
      },
      headerTransparent: true,
    });
  }, [handleOnSwapCameraPress, headerHeight, navigation]);

  useEffect(() => {
    (async function () {
      const asyncStorageValues = await AsyncStorage.multiGet(['host', 'license']);
      const {host: _host, license: _license} = Object.fromEntries(asyncStorageValues);

      if (!_host || !_license) {
        Alert.alert('Configuration Failed', 'Please make sure you have setup the host & license key.');
        navigation.goBack();
        return;
      }

      setHost(_host);
      setLicense(_license);
    })();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      broadcastRef.current?.unpublish();
    };
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <View style={styles.container}>
      <BroadcastView ref={broadcastRef} host={host} licenseKey={license} />
      <View style={styles.startButtonWrapper}>
        <Button label="Stop" leftIconName="x" onPress={handleOnStopPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'black',
  },
  startButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 24,
  },
});

export default BroadcastScreen;
