import {useState, useCallback, useEffect} from 'react';
import {Keyboard} from 'react-native';

export const useKeyboardShowStatus = () => {
  const [isShow, setIsShow] = useState(false);

  const handleKeyboardDidShow = useCallback(() => {
    setIsShow(true);
  }, []);

  const handleKeyboardDidHide = useCallback(() => {
    setIsShow(false);
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', handleKeyboardDidHide);
    };
  }, [handleKeyboardDidHide, handleKeyboardDidShow]);

  return isShow;
};
