import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, BackHandler, Image, Switch, Button, FlatList, TouchableOpacity, PermissionsAndroid, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BluetoothScreen = () => {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const navigation = useNavigation();
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    BleManager.start({ showAlert: false });

    const handleDiscoverPeripheral = (peripheral) => {
      console.log('Discovered Peripheral', peripheral);
      setDevices((prevDevices) => {
        if (!prevDevices.find(device => device.id === peripheral.id)) {
          return [...prevDevices, peripheral];
        }
        return prevDevices;
      });
    };

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    return () => {
      bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const toggleBluetooth = async () => {
    if (isBluetoothOn) {
      Alert.alert(
        'Turn Off Bluetooth',
        'Please use the device control panel to turn off Bluetooth.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
    } else {
      await requestPermissions();
      await BleManager.enableBluetooth()
        .then(() => {
          console.log('Bluetooth is enabled');
          setIsBluetoothOn(true);
        })
        .catch((error) => {
          console.log('The user refused to enable Bluetooth', error);
        });
    }
  };
  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused()) {
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const startScan = () => {
    if (isBluetoothOn) {
      BleManager.scan([], 5, true)
        .then((results) => {
          console.log('Scanning...');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const connectToDevice = (id) => {
    BleManager.connect(id)
      .then(() => {
        console.log('Connected to ' + id);
      })
      .catch((error) => {
        console.error('Connection error', error);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./Assets/topbar.png')}
        style={{ width: width, height: isMobile ? 50 : 100, resizeMode: 'cover' }}
      />
      <View style={[styles.content, { width: isMobile ? '100%' : '98%', marginLeft: isMobile ? 0 : 10, marginRight: isMobile ? 5 : 10 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('./Assets/bluetooth.png')}
            style={{ width: isMobile ? 50 : 80, height: isMobile ? 50 : 80, marginRight: 8, marginTop: isMobile ? 8 : 12 }}
          />
          <Text style={{ color: 'white', fontSize: isMobile ? 24 : 28, marginTop: 8 }}>Bluetooth</Text>
          <Switch
            value={isBluetoothOn}
            onValueChange={toggleBluetooth}
            color={isBluetoothOn ? '#4bb8f5' : '#f4f3f4'}
            style={[styles.switchStyle, { marginLeft: isMobile ? 160 : 500, transform: isMobile ? [{ scaleX: 1.2 }, { scaleY: 1.2 }] : [{ scaleX: 1.6 }, { scaleY: 1.6 }] }]}
          />
        </View>
      </View>
      <View style={[styles.maincontent, { width: isMobile ? '100%' : '98%', marginLeft: isMobile ? 0 : 10, marginRight: isMobile ? 5 : 10 }]}>
        <Button title="Scan for Devices" onPress={startScan} disabled={!isBluetoothOn} />
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
              <View>
                <Text style={{ color: 'white' }}>{item.name || 'Unnamed Device'}</Text>
                <Text style={{ color: 'white' }}>{item.id}</Text>
              </View>
              <TouchableOpacity onPress={() => connectToDevice(item.id)}>
                <Text style={{ color: 'blue' }}>Connect</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={[styles.footer, { width: isMobile ? '100%' : '98%', marginLeft: isMobile ? 0 : 10, marginRight: isMobile ? 5 : 10 }]}>
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
  switchStyle: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default BluetoothScreen;