import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, BackHandler, Image, Switch, Alert, Linking, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BleManager from 'react-native-ble-manager';

const BluetoothScreen = () => {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const navigation = useNavigation();
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  useEffect(() => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log('Bluetooth module initialized');
      checkBluetoothState();
    }).catch((error) => {
      console.error('Error initializing Bluetooth module:', error);
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  const checkBluetoothState = async () => {
    try {
      const isEnabled = await BleManager.checkState();
      setBluetoothEnabled(isEnabled === 'on');
    } catch (error) {
      console.error('Bluetooth Error:', error.message);
      Alert.alert('Error', 'Failed to check Bluetooth state.');
    }
  };

  const toggleBluetooth = async (value) => {
    try {
      if (value) {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];
  
        const granted = await PermissionsAndroid.requestMultiple(permissions);
  
        if (
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          await BleManager.enableBluetooth();
        } else {
          Alert.alert(
            'Permission Denied',
            'Bluetooth and Location permissions are required to enable Bluetooth.',
            [{ text: 'OK', onPress: () => setBluetoothEnabled(false) }]
          );
          return;
        }
      } else {
        const isBluetoothEnabled = await BleManager.checkState();
        if (isBluetoothEnabled) {
          Alert.alert(
            'Turn Off Bluetooth',
            'Turn off Bluetooth in control panel/settings.',
            [{ text: 'OK', onPress: () => setBluetoothEnabled(false) }]
          );
        } else {
          setBluetoothEnabled(false);
        }
      }
      setBluetoothEnabled(value);
    } catch (error) {
      console.error('Bluetooth Error:', error.message);
      Alert.alert('Error', 'Failed to toggle Bluetooth. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./Assets/topbar.png')}
        style={{ width: width, height: isMobile ? 50 : 100, resizeMode: 'cover' }}
      />
      <View style={[styles.content, { width: isMobile ? '100%' : '98%', marginLeft: isMobile ? 0 : 10 , marginRight: isMobile ? 5 : 10}]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('./Assets/bluetooth.png')} style={{ width: isMobile ? 50 : 80, height: isMobile ? 50 : 80, marginRight: 8, marginTop: isMobile ? 8 : 12}} />
          <Text style={{ color: 'white', fontSize: isMobile ? 24 : 28, marginTop: 8}}>Bluetooth</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={bluetoothEnabled ? "#4bb8f5" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleBluetooth}
            value={bluetoothEnabled}
            style={[styles.switchStyle, {marginLeft: isMobile ? 160 : 500, transform: isMobile ? [{ scaleX: 1.2 }, { scaleY: 1.2 }] : [{ scaleX: 1.6 }, { scaleY: 1.6 }]}]}
          />
        </View>
      </View>
      <View style={[styles.maincontent, ,{ width: isMobile ? '100%' : '98%', marginLeft: isMobile ? 0 : 10 , marginRight: isMobile ? 5 : 10}]}>

      </View>
      <View style={[styles.footer,{ width: isMobile ? '100%' : '98%', marginLeft: isMobile ? 0 : 10 , marginRight: isMobile ? 5 : 10}]}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
  },
  content: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    height: '10%',
    backgroundColor: '#444444',
    marginTop: 15,
    marginBottom: 10,
  },
  maincontent: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    height: '65%',
    backgroundColor: '#333333',
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    height: '10%',
    alignItems: 'center',
    backgroundColor: '#333333',
    marginBottom: 10,
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  switchStyle:{
    alignSelf: 'center',
    marginTop: 10,
  }
});

export default BluetoothScreen;