import {useQuery} from 'react-query';
import AsyncStorage from '@react-native-community/async-storage';

export const useLiveStreams = () =>
  useQuery(
    'liveStream',
    async () => {
      const controller = new AbortController();
      const {signal} = controller;

      const host = await AsyncStorage.getItem('host');
      const res = await fetch(`http://${host}:5080/api/v1/applications/live/streams?accessToken=abc123`, {
        method: 'GET',
        signal,
      });

      const data = await res.json();

      const promiseWrapper = Promise.resolve(data);
      promiseWrapper.cancel = () => controller.abort();
      return promiseWrapper;
    },
    {
      refetchInterval: 5000,
    },
  );
