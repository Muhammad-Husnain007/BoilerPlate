import { Image, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Statrted');
    }, 3000);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../assests/Logo.png')}
        style={{ width: 191, height: 48 }}
      />
    </View>
  );
};

export default SplashScreen;