import React from 'react';
import {View, Pressable, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const IconButton = ({iconName, onPress, containerStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable android_ripple={{color: '#0003'}} style={styles.pressable} onPress={onPress}>
        <Icon name={iconName} size={24} color="#000" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: 'hidden',
    margin: 4,
  },
  pressable: ({pressed}) => ({
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'ios' ? {opacity: pressed ? 0.4 : 1} : {}),
  }),
});

export default IconButton;
