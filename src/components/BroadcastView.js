import React, {useRef, useMemo, useImperativeHandle, forwardRef, useState, useCallback, useEffect} from 'react';
import {findNodeHandle, View, StyleSheet} from 'react-native';
import {R5VideoView, R5LogLevel, publish, unpublish, swapCamera} from 'react-native-red5pro';
import {v4 as uuidv4} from 'uuid';
import Icon from 'react-native-vector-icons/Feather';
import KeepAwake from 'react-native-keep-awake';

const BroadcastView = (_, ref) => {
  const videoRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const configuration = useMemo(() => {
    const uid = uuidv4();

    return {
      host: '10.1.10.103',
      port: 8554,
      contextName: 'live',
      bufferTime: 0.5,
      streamBufferTime: 2,
      key: uid,
      bundleID: 'com.red5pro.reactnative',
      licenseKey: '53CT-7XXE-VFAB-1XRV',
      streamName: uid,
    };
  }, []);

  const onConfigured = () => {
    setIsConfigured(true);
  };

  const onPublisherStreamStatus = status => {
    setIsReady(true);
    console.log(status.nativeEvent.status);
  };

  const onUnpublishNotification = () => {
    console.log('Stop');
  };

  useImperativeHandle(
    ref,
    () => ({
      unpublish: () => {
        unpublish(findNodeHandle(videoRef.current));
      },
      swapCamera: () => {
        swapCamera(findNodeHandle(videoRef.current));
      },
    }),
    [],
  );

  useEffect(() => {
    let timeout = null;

    if (isConfigured && !isReady) {
      timeout = setTimeout(() => {
        const {streamName} = configuration;
        publish(findNodeHandle(videoRef.current), streamName);
      }, 500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [configuration, isConfigured, isReady]);

  return (
    <View style={styles.container}>
      <KeepAwake />
      <R5VideoView
        ref={videoRef}
        configuration={configuration}
        enableBackgroundStreaming
        showDebugView
        logLevel={R5LogLevel.DEBUG}
        onConfigured={onConfigured}
        onPublisherStreamStatus={onPublisherStreamStatus}
        onUnpublishNotification={onUnpublishNotification}
        style={styles.video}
      />
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
