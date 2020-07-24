import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

const LoadingOverlay = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="purple" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingOverlay;
