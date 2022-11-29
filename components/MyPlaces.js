import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { Header, Icon, Input, ListItem, Button } from'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import FadeOut from './FadeOut';
import { API_URL, API_TOKEN } from '@env';
import { AsyncStorage } from'@react-native-async-storage/async-storage';
import * as SQLite from'expo-sqlite';


const db = SQLite.openDatabase('coursedb.db');

export default function MyPlaces({ navigation }) {

  const [address, setAddress]                 = useState('');
  const [savedLocations, setSavedLocations]   = useState([]);
  const [coordinateData, setCoordinateData]   = useState([]);
  const [realTimeLocation, setRealTimeLocation] = useState({});

  const API_URL_AND_ADDRESS = API_URL + `${address}`;


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists savedLocations (id integer primary key not null, address text, latitude text, longitude text);');
    }, null, updateList); 
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        enableHighAccuracy: true,
        timeInterval: 5
      });
      console.log("done");
      setRealTimeLocation(currentLocation);
    })();
  }, []);


  const saveItem = (coords) => {
    console.log({address, coords});
    setCoordinateData([coords.lat]);
    setCoordinateData(coordinateData => [...coordinateData, coords.lng]);

    db.transaction(tx => {
        tx.executeSql('insert into savedLocations (address, latitude, longitude) values (?, ?, ?);', [address, coords.lat, coords.lng]);    
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from savedLocations;', [], (_, { rows }) =>
        setSavedLocations(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from savedLocations where id = ?;', [id]);
      }, null, updateList
    )    
  }

  const fetchData = () => {
    fetch(API_URL_AND_ADDRESS)
    .then(response => response.json())
    .then(data => saveItem(data.results[0].locations[0].latLng))
  }

  return (

        <LinearGradient
          style={styles.container}
          colors={["#EAE800", "#99D40B"]}
          start={{x: 0, y: 0.8}}
          end={{x: 0, y: 1}}
        > 
          <Image 
            style={{width: '100%', resizeMode: 'contain'}}
            source={require('../img/walkthiswaylogo1.png')}
          />
          <FadeOut />

          <Input   
            placeholder='Type in address'
            onChangeText={address => setAddress(address)} 
            value={address} />

          <Button
            type="clear"
            raised icon={{name: 'save', color: '#2196F3'}} 
            onPress={fetchData} 
            title="SAVE ADDRESS" 
            titleStyle={{fontWeight: 'bold', color: '#2196F3', letterSpacing: 1}}
          />

          <View style={{flex: 0.02}}></View>

          <LinearGradient
            style={styles.listcontainer}
            colors={["#EAE800", "#99D40B"]}
            start={{x: 0, y: 0.3}}
            end={{x: 0, y: 1}}
          >
              <FlatList 
                  data={savedLocations} 
                  renderItem = {({ item }) => (
                  <ListItem 
                    bottomDivider
                    linearGradientProps={{
                      colors:["#EAE800", "#2196F3"],
                      start: { x: 1, y: 1 },
                      end: { x: -0.1, y: 0 },
                    }}
                    ViewComponent={LinearGradient} 
                    >
                      <ListItem.Content>
                          <ListItem.Title style={{color: '#EAE800', fontWeight: 'bold', letterSpacing: 1}} onLongPress={() => {deleteItem(item.id)}}>{item.address}</ListItem.Title>
                      </ListItem.Content>
                      <Button 
                          type='outline' 
                          title='SHOW ON MAP'
                          titleStyle={{fontWeight: 'bold', color: '#2196F3', letterSpacing: 1}} 
                          icon={{name: 'chevron-right', color: '#00BDEB'}} 
                          iconRight='true' 
                          onPress={() => {
                            navigation.navigate('Map', {
                              dataLat: savedLocations[item.id - 1].latitude, 
                              dataLng: savedLocations[item.id - 1].longitude
                            })
                          }} />
                  </ListItem>)}
                  keyExtractor={(item, index) => index.toString()}
              />
          </LinearGradient>
          <Button
            type="clear"
            raised icon={{name: 'location-on', color: '#2196F3'}} 
            onPress={() => {
              navigation.navigate('Map', {
                dataLat: realTimeLocation.coords.latitude, 
                dataLng: realTimeLocation.coords.longitude
              })
            }}
            title="USE CURRENT LOCATION"
            titleStyle={{fontWeight: 'bold', color: '#2196F3', letterSpacing: 1}}
          />
      </LinearGradient>
  )
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