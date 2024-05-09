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
      <Text style={[styles.title, { fontSize: isMobile ? 24 : 36 }]}>
        BLUETOOTH SCREEN
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BluetoothScreen;