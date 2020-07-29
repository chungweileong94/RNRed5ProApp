import React, {useRef, useMemo, forwardRef, useCallback, useState, useImperativeHandle} from 'react';
import {View, findNodeHandle, InteractionManager, StyleSheet, ActivityIndicator} from 'react-native';
import {R5VideoView, subscribe, unsubscribe, R5ScaleMode} from 'react-native-red5pro';
import {v4 as uuidv4} from 'uuid';
import KeepAwake from 'react-native-keep-awake';
import {useFocusEffect} from '@react-navigation/native';

const ViewerView = ({host, licenseKey, streamName}, ref) => {
  const videoRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const config = useMemo(() => {
    const uid = uuidv4();

    if (!host || !licenseKey || !streamName) {
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
      streamName,
    };
  }, [host, licenseKey, streamName]);

  const onConfigured = () => {
    setIsConfigured(true);
  };

  const onSubscriberStreamStatus = status => {
    setIsReady(true);
    console.log(status.nativeEvent.status);
  };

  useImperativeHandle(
    ref,
    () => ({
      unsubscribe: () => {
        isReady && unsubscribe(findNodeHandle(videoRef.current));
      },
    }),
    [isReady],
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (isConfigured && !isReady && streamName) {
          subscribe(findNodeHandle(videoRef.current), streamName);
        }
      });

      return () => task.cancel();
    }, [isConfigured, isReady, streamName]),
  );

  return (
    <View style={styles.container}>
      <KeepAwake />
      {!!config && (
        <R5VideoView
          ref={videoRef}
          configuration={config}
          enableBackgroundStreaming
          scaleMode={R5ScaleMode.SCALE_TO_FILL}
          // showDebugView
          // logLevel={R5LogLevel.DEBUG}
          onConfigured={onConfigured}
          onSubscriberStreamStatus={onSubscriberStreamStatus}
          style={styles.video}
        />
      )}
      {!isReady && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
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
  loadingContainer: {
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

export default forwardRef(ViewerView);
