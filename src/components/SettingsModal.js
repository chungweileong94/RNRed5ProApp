import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import Modal from 'react-native-modal';
import {View, StyleSheet, Text, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {useKeyboardShowStatus} from '../utils';

import TextInput from './TextInput';
import Button from './Button';

const SettingsModal = (_, ref) => {
  const [isShow, setIsShow] = useState(false);
  const isKeyboardShow = useKeyboardShowStatus();
  const [form, setForm] = useState({
    host: '',
    license: '',
  });

  const handleOnChange = key => value => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleOnDismiss = () => {
    if (isKeyboardShow) {
      Keyboard.dismiss();
      return;
    }
    setIsShow(false);
  };

  const handleOnSave = async () => {
    await AsyncStorage.multiSet([
      ['host', form.host],
      ['license', form.license],
    ]);

    setIsShow(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setIsShow(true);
      },
    }),
    [],
  );

  useEffect(() => {
    (async function () {
      if (!isShow) return;

      const values = await AsyncStorage.multiGet(['host', 'license']);
      setForm(Object.fromEntries(values));
    })();
  }, [isShow]);

  return (
    <Modal
      isVisible={isShow}
      coverScreen
      statusBarTranslucent
      hardwareAccelerated
      useNativeDriver
      animationIn="zoomInUp"
      onBackdropPress={handleOnDismiss}
      onBackButtonPress={handleOnDismiss}
      avoidKeyboard
    >
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.form}>
          <TextInput placeholder="Host" value={form.host} onChangeText={handleOnChange('host')} />
          <TextInput placeholder="SDK License" value={form.license} onChangeText={handleOnChange('license')} />
        </View>
        <Button label="Save" leftIconName="save" onPress={handleOnSave} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  form: {
    marginBottom: 24,
  },
});

export default forwardRef(SettingsModal);
