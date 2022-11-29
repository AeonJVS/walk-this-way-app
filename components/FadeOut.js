import React, { useRef, useEffect } from 'react';
import { Animated, Text } from 'react-native';

const FadeOut = (props) => {
  const fadeOutAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(
        fadeOutAnim,
      {
        toValue: 0,
        duration: 20000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeOutAnim])

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeOutAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export default () => {
    return (
      
        <FadeOut>
            <Text style={{fontSize: 12, color: '#2196F3', textAlign: 'center', margin: 5}}>
                walk-this-way-app was made as the final project for Haaga-Helia course Mobiiliohjelmointi by Juuso Ihatsu. 
                Save addresses or use current location to open and draw a walk route on map.
                 Delete addresses by holding down the address name on the left.
            </Text>
        </FadeOut>
      
    )
  }