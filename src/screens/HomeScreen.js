import React, {useCallback, useLayoutEffect, useRef} from 'react';
import {View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import IconButton from '../components/IconButton';
import {requestPermissions, MY_PERMISSIONS} from '../utils/permissions';
import SettingsModal from '../components/SettingsModal';

const HomeScreen = () => {
  const navigation = useNavigation();
  const settingsModalRef = useRef(null);

  const handleOnBroadcastPress = useCallback(async () => {
    const requestResult = await requestPermissions(MY_PERMISSIONS);

    if (!requestResult) {
      Alert.alert('Permissions required', 'We need those permissions for live stream.');
      return;
    }

    navigation.navigate('Broadcast');
  }, [navigation]);

  const handleOnSettingsPress = () => {
    settingsModalRef.current.show();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton iconName="video" onPress={handleOnBroadcastPress} />,
      headerLeft: () => <IconButton iconName="settings" onPress={handleOnSettingsPress} />,
    });
  }, [handleOnBroadcastPress, navigation]);

  return (
    <>
      <View />
      <SettingsModal ref={settingsModalRef} />
    </>
  );
};

export default HomeScreen;
