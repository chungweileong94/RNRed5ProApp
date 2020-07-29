import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import {Alert, View, StyleSheet} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {useHeaderHeight} from '@react-navigation/stack';

import ViewerView from '../components/ViewerView';

const ViewerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const viewerRef = useRef(null);
  const [host, setHost] = useState(null);
  const [license, setLicense] = useState(null);
  const headerHeight = useHeaderHeight();
  const {streamName} = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        height: headerHeight,
      },
      headerTransparent: true,
    });
  }, [headerHeight, navigation]);

  useEffect(() => {
    (async function () {
      const asyncStorageValues = await AsyncStorage.multiGet(['host', 'license']);
      const {host: _host, license: _license} = Object.fromEntries(asyncStorageValues);

      if (!_host || !_license || !streamName) {
        Alert.alert('Configuration Failed', 'Please make sure you have setup the host & license key.');
        navigation.goBack();
        return;
      }

      setHost(_host);
      setLicense(_license);
    })();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      viewerRef.current.unsubscribe();
    };
  }, [navigation, streamName]);

  return (
    <View style={styles.container}>
      <ViewerView ref={viewerRef} host={host} licenseKey={license} streamName={streamName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'black',
  },
});

export default ViewerScreen;
