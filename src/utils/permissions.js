import {
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {Platform} from 'react-native';

export const MY_PERMISSIONS =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
    : [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.READ_PHONE_STATE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ];

export const requestPermissions = async (permissions = []) => {
  const result = await checkMultiple(permissions);

  if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
    return false;
  }

  if (result === RESULTS.GRANTED) {
    return true;
  }

  const requestStatues = await requestMultiple(permissions);

  const requestResult = Object.values(requestStatues).reduce(
    (prev, curr) => prev && curr === RESULTS.GRANTED,
    true,
  );

  return requestResult;
};
