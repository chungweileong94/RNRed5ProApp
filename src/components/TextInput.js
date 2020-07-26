import React, {useState} from 'react';
import {TextInput as RNTextInput, StyleSheet, View} from 'react-native';

import {primaryColor, inactiveColor} from '../var/theme';

const TextInput = ({placeholder, value, onChangeText}) => {
  const [focusStyle, setFocusStyle] = useState({});

  const handleOnFocus = () => {
    setFocusStyle({
      borderColor: primaryColor,
    });
  };

  const handleOnBlur = () => {
    setFocusStyle({
      borderColor: inactiveColor,
    });
  };

  return (
    <View style={[styles.container, focusStyle]}>
      <RNTextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: inactiveColor,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  textInput: {
    paddingVertical: 8,
    fontSize: 16,
  },
});

export default TextInput;
