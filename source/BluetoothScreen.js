import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, BackHandler, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BluetoothScreen = () => {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./Assets/topbar.png')}
        style={{ width: width, height: isMobile ? 50 : 100, resizeMode: 'cover' }}
      />
      <View style={styles.content}></View>
      <View style={[styles.footer,{ width: isMobile ? '100%' : '98%', marginLeft: isMobile ? 0 : 10 , marginRight: isMobile ? 5 : 10}]}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    height: '10%',
    alignItems: 'center',
    backgroundColor: '#555555',
    marginBottom: 5,
  },
});

export default BluetoothScreen;