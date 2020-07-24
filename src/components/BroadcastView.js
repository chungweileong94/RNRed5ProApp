import React, {useRef, useMemo, useImperativeHandle, forwardRef, useState} from 'react';
import {findNodeHandle, View, StyleSheet} from 'react-native';
import {R5VideoView, R5LogLevel, publish, unpublish, swapCamera} from 'react-native-red5pro';
import {v4 as uuidv4} from 'uuid';

const BroadcastView = (_, ref) => {
  const videoRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const configuration = useMemo(
    () => ({
      host: '10.1.10.102',
      port: 8554,
      contextName: 'live',
      bufferTime: 0.5,
      streamBufferTime: 2,
      key: uuidv4(),
      bundleID: 'com.red5pro.reactnative',
      licenseKey: '53CT-7XXE-VFAB-1XRV',
      streamName: 'test',
    }),
    [],
  );

  const onConfigured = () => {
    setIsConfigured(true);
  };

  const onPublisherStreamStatus = status => {
    console.log(status.nativeEvent.status);
  };

  const onUnpublishNotification = () => {
    console.log('Stop');
  };

  useImperativeHandle(
    ref,
    () => ({
      publish: () => {
        if (!isConfigured) return;
        const {streamName} = configuration;
        publish(findNodeHandle(videoRef.current), streamName);
      },
      unpublish: () => {
        unpublish(findNodeHandle(videoRef.current));
      },
      swapCamera: () => {
        swapCamera(findNodeHandle(videoRef.current));
      },
    }),
    [configuration, isConfigured],
  );

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {flex: 1, backgroundColor: 'black'},
});

export default forwardRef(BroadcastView);
