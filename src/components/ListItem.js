import React from 'react';
import {View, Pressable, Text, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {primaryColor} from '../var/theme';

const ListItem = ({label, iconName, onPress}) => {
  return (
    <View style={styles.wrapper}>
      <Pressable android_ripple={{color: '#0003'}} onPress={onPress} style={styles.pressable}>
        <Icon name={iconName} size={24} color={primaryColor} />
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    ...(Platform.OS === 'ios' ? {backgroundColor: pressed ? '#0003' : 'transparent'} : {}),
  }),
  label: {
    flex: 1,
    fontSize: 18,
    lineHeight: 20,
    marginLeft: 12,
  },
});

export default ListItem;
