import React from 'react';
import {View, Pressable, Text, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Button = ({label, leftIconName, onPress}) => {
  return (
    <View style={styles.iosShadowWrapper}>
      <View style={styles.container}>
        <Pressable android_ripple={{color: '#0003'}} style={styles.pressable} onPress={onPress}>
          {!!leftIconName && <Icon name={leftIconName} size={16} style={styles.leftIcon} />}
          <Text style={styles.text}>{label}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iosShadowWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  container: {
    borderRadius: 25,
    overflow: 'hidden',

    elevation: 4,
  },
  pressable: ({pressed}) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    ...(Platform.OS === 'ios' ? {backgroundColor: pressed ? '#e7e7e7' : 'white'} : {backgroundColor: 'white'}),
  }),
  leftIcon: {
    marginRight: 8,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Button;
