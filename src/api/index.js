import {useQuery} from 'react-query';
import AsyncStorage from '@react-native-community/async-storage';

export const useLiveStreams = () =>
  useQuery(
    'liveStream',
    async () => {
      const host = await AsyncStorage.getItem('host');
      const res = await fetch(`http://${host}:5080/api/v1/applications/live/streams?accessToken=abc123`);
      const data = await res.json();
      return data;
    },
    {
      refetchInterval: 5000,
    },
  );
