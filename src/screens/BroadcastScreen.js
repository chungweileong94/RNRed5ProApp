import React, {useRef, useEffect, useCallback, useLayoutEffect} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import BroadcastView from '../components/BroadcastView';
import IconButton from '../components/IconButton';
import Button from '../components/Button';

const BroadcastScreen = () => {
  const navigation = useNavigation();
  const broadcastRef = useRef(null);

  const handleOnStopPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOnSwapCameraPress = useCallback(() => {
    broadcastRef.current.swapCamera();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton iconName="repeat" onPress={handleOnSwapCameraPress} />,
      headerLeft: () => null,
    });
  }, [handleOnSwapCameraPress, navigation]);

  useEffect(
    () => () => {
      broadcastRef.current.unpublish();
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <View style={styles.container}>
      <BroadcastView ref={broadcastRef} />
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
