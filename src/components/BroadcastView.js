import React, {useRef, useImperativeHandle, forwardRef, useState, useCallback, useMemo} from 'react';
import {findNodeHandle, View, StyleSheet, InteractionManager} from 'react-native';
import {R5VideoView, publish, unpublish, swapCamera} from 'react-native-red5pro';
import {v4 as uuidv4} from 'uuid';
import Icon from 'react-native-vector-icons/Feather';
import KeepAwake from 'react-native-keep-awake';
import {useFocusEffect} from '@react-navigation/native';

const BroadcastView = ({host, licenseKey}, ref) => {
  const videoRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const config = useMemo(() => {
    const uid = uuidv4();

    if (!host || !licenseKey) {
      return null;
    }

    return {
      host,
      port: 8554,
      contextName: 'live',
      bufferTime: 0.5,
      streamBufferTime: 2,
      key: uid,
      bundleID: 'com.red5pro.reactnative',
      licenseKey,
      streamName: uid,
    };
  }, [host, licenseKey]);

  const onConfigured = () => {
    setIsConfigured(true);
  };

  const onPublisherStreamStatus = status => {
    setIsReady(true);
    console.log(status.nativeEvent.status);
  };

  const onUnpublishNotification = () => {
    console.log('Unpublished');
  };

  useImperativeHandle(
    ref,
    () => ({
      unpublish: () => {
        isReady && unpublish(findNodeHandle(videoRef.current));
      },
      swapCamera: () => {
        isReady && swapCamera(findNodeHandle(videoRef.current));
      },
    }),
    [isReady],
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (isConfigured && !isReady) {
          const {streamName} = config;
          publish(findNodeHandle(videoRef.current), streamName);
        }
      });

      return () => task.cancel();
    }, [config, isConfigured, isReady]),
  );

  return (
    <View style={styles.container}>
      <KeepAwake />
      {!!config && (
        <R5VideoView
          ref={videoRef}
          configuration={config}
          enableBackgroundStreaming
          // showDebugView
          // logLevel={R5LogLevel.DEBUG}
          onConfigured={onConfigured}
          onPublisherStreamStatus={onPublisherStreamStatus}
          onUnpublishNotification={onUnpublishNotification}
          style={styles.video}
        />
      )}
      {!isReady && (
        <View style={styles.placeHolder}>
          <Icon name="video" size={40} color="white" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {flex: 1, backgroundColor: 'black'},
  placeHolder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    opacity: 0.5,
  },
});

export default forwardRef(BroadcastView);
