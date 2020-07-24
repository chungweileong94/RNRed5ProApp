import React, {useRef, useMemo, useImperativeHandle, forwardRef, useState, useCallback} from 'react';
import {findNodeHandle, View, StyleSheet} from 'react-native';
import {R5VideoView, R5LogLevel, publish, unpublish, swapCamera, unmuteAudio, unmuteVideo} from 'react-native-red5pro';
import {v4 as uuidv4} from 'uuid';
import Icon from 'react-native-vector-icons/Feather';

const BroadcastView = (_, ref) => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const configuration = useMemo(
    () => ({
      host: '10.1.10.103',
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

  const onConfigured = useCallback(() => {
    const {streamName} = configuration;
    publish(findNodeHandle(videoRef.current), streamName);
  }, [configuration]);

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
    opacity: 0.5,
  },
});

export default forwardRef(BroadcastView);
