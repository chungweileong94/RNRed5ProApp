import React from 'react';
import {View, Pressable, Text, StyleSheet, Platform} from 'react-native';

const ListItem = ({label, onPress}) => {
  return (
    <View style={styles.wrapper}>
      <Pressable android_ripple={{color: '#0003'}} onPress={onPress} style={styles.pressable}>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    margin: 8,
  },
  pressable: ({pressed}) => ({
    paddingVertical: 24,
    paddingHorizontal: 20,
    ...(Platform.OS === 'ios' ? {backgroundColor: pressed ? '#0003' : 'transparent'} : {}),
  }),
  label: {
    fontWeight: 'bold',
  },
});

export default ListItem;
