import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const BluetoothScreen = () => {
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

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