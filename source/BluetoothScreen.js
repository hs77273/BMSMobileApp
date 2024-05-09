import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { useNavigation} from '@react-navigation/native';

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
    <View style={[styles.container, { backgroundColor: 'black' }]}>
      <View style={styles.footer}>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer:{
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    backgroundColor: '#555555',
    marginBottom: 5
  }
});

export default BluetoothScreen;