import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import { Header, Icon, Input, ListItem, Button } from'react-native-elements';
import { NavigationContainer } from'@react-navigation/native';
import { createNativeStackNavigator } from'@react-navigation/native-stack';

import MyPlaces from'./components/MyPlaces';
import MapScreen from'./components/MapScreen';


const Stack = createNativeStackNavigator();


export default function App() {
  return (

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "yellow",
            }, headerTintColor: "blue",
          }}
        >
          <Stack.Screen name="Addresses"   component={MyPlaces} />
          <Stack.Screen name="Map"  component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
  },
  
  listcontainer: {
   flex: 1,
   flexDirection: 'row',
   backgroundColor: '#fff',
  },

  button: {
    flexDirection: 'row',
    backgroundColor: '#6CB7F4',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 10,
    borderWidth: 0,
   },
 });
