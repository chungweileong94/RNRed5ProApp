import React, {useCallback, useLayoutEffect, useRef, useMemo} from 'react';
import {View, Alert, Text, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import IconButton from '../components/IconButton';
import {requestPermissions, MY_PERMISSIONS} from '../utils/permissions';
import SettingsModal from '../components/SettingsModal';
import {useLiveStreams} from '../api';

const HomeScreen = () => {
  const navigation = useNavigation();
  const settingsModalRef = useRef(null);
  const {isLoading, error, data, refetch} = useLiveStreams();

  const liveStreams = useMemo(() => {
    if (isLoading || error) {
      return [];
    }

    return data?.data;
  }, [data?.data, error, isLoading]);

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
      <View style={styles.container}>
        <FlatList
          data={liveStreams}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <View style={styles.liveStreamItem}>
              <Text style={styles.listStreamText}>{item}</Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        />
      </View>
      <SettingsModal ref={settingsModalRef} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  liveStreamItem: {
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  listStreamText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
