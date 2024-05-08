import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainAppScreen = () => {
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const isMobile = Dimensions.get('window').width < 768;
  const [fadeInAnim] = useState(new Animated.Value(0));
  const [showLoader, setShowLoader] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setShowLoader(true);
    }, 5000);

    const navTimer = setTimeout(() => {
      navigation.navigate('BluetoothScreen');
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(navTimer);
    };
  }, []);

  const onLayout = () => {
    setScreenHeight(Dimensions.get('window').height);
  };

  return (
    <ImageBackground
      source={require('./Assets/bmsbackground.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container} onLayout={onLayout}>
        <View style={styles.titleContainer}>
          <Animated.Text
            style={[
              styles.title,
              { fontSize: isMobile ? 22 : 34, opacity: fadeInAnim },
            ]}
          >
            BATTERY MANAGEMENT SYSTEM
          </Animated.Text>
          <Animated.Text
            style={[
              styles.title,
              { fontSize: isMobile ? 22 : 34, opacity: fadeInAnim },
            ]}
          >
            Powered by Cyient
          </Animated.Text>
        </View>
        {showLoader && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00FFFF" />
          </View>
        )}
        <View style={[styles.logoContainer, { top: screenHeight * 0.1 }]}>
          <Image
            source={require('./Assets/logoimg.png')}
            style={{
              width: isMobile ? 200 : 300,
              height: isMobile ? 200 : 300,
              borderRadius: isMobile ? 100 : 150,
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  titleContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  title: {
    color: '#00FFFF',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default MainAppScreen;