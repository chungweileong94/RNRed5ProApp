import React, {useCallback, useLayoutEffect, useRef, useMemo} from 'react';
import {View, Alert, Text, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import IconButton from '../components/IconButton';
import {requestPermissions, MY_PERMISSIONS} from '../utils/permissions';
import SettingsModal from '../components/SettingsModal';
import {useLiveStreams} from '../api';
import ListItem from '../components/ListItem';

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

  const handleOnStreamPress = useCallback(
    streamId => () => {
      navigation.navigate('View', {streamId});
    },
    [navigation],
  );

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
          renderItem={({item}) => <ListItem label={item} onPress={handleOnStreamPress(item)} />}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyWrapper}>
                <Icon name="video-off" color="gray" size={18} />
                <Text style={styles.emptyLabel}>No Live Stream</Text>
              </View>
            </View>
          }
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
  emptyContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  emptyLabel: {
    fontSize: 18,
    color: 'gray',
    marginLeft: 8,
  },
});

export default HomeScreen;
