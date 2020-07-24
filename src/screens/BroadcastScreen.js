import React, {useRef, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import BroadcastView from '../components/BroadcastView';
import IconButton from '../components/IconButton';
import Button from '../components/Button';

const BroadcastScreen = () => {
  const navigation = useNavigation();
  const broadcastRef = useRef(null);

  const handleOnStartPress = useCallback(() => {
    broadcastRef.current.publish();
  }, []);

  const handleOnSwapCameraPress = useCallback(() => {
    broadcastRef.current.swapCamera();
  }, []);

  useEffect(() => {
    navigation.setOptions({headerRight: () => <IconButton iconName="repeat" onPress={handleOnSwapCameraPress} />});
  }, [handleOnStartPress, handleOnSwapCameraPress, navigation]);

  return (
    <View style={styles.container}>
      <BroadcastView ref={broadcastRef} />
      <View style={styles.startButtonWrapper}>
        <Button label="Start" leftIconName="play" onPress={handleOnStartPress} />
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
