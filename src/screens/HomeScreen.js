import React, {useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import IconButton from '../components/IconButton';
import {requestPermissions, MY_PERMISSIONS} from '../utils/permissions';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleOnBroadcastPress = useCallback(async () => {
    const requestResult = await requestPermissions(MY_PERMISSIONS);

    if (!requestResult) {
      alert('Permissions required!');
      return;
    }

    navigation.navigate('Broadcast');
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton iconName="video" onPress={handleOnBroadcastPress} />,
    });
  }, [handleOnBroadcastPress, navigation]);

  return <View />;
};

export default HomeScreen;
