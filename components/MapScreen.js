import React, { useState, useEffect }  from'react';
import { StyleSheet, View, Text, Button } from'react-native';
import MapView, { Marker, Polyline } from'react-native-maps';
import { captureScreen } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Location from'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

export default function MapScreen({ route, navigation }) {
    const dataLat = route.params.dataLat;
    const dataLng = route.params.dataLng;
    const [location, setLocation] = useState(null);
    const [mapNodes, setMapNodes] = useState([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission')
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
                setLocation(location); 
            })();
        }, []);

    const coordinates = {
        latitude: parseFloat(dataLat),
        longitude: parseFloat(dataLng)
    };

    const addNode = (newNode) => {
        setMapNodes(mapNodes => [...mapNodes, newNode])
    }

    const takeScreenShot = () => {
        captureScreen({
            format: 'jpg',
            quality: 0.8,
        }).then(
            (uri) => {
                console.log("Image saved to", uri);
                saveToAlbum(uri);
            }
        );
    }

    const saveToAlbum = async (uri) => {
        const hasPermission = await MediaLibrary.requestPermissionsAsync();
        if (hasPermission) {
            MediaLibrary.saveToLibraryAsync(uri);
            alert("Screenshot saved to photo gallery!");
        } else alert("Cannot take screenshot w/out Permission. Please try again.")
    }

    return (
        <LinearGradient
          style={styles.container}
          colors={["#EAE800", "#99D40B"]}
          start={{x: 0, y: 0.8}}
          end={{x: 0, y: 1}}
          collapsable={false}
        > 
            <Text>
            </Text>
            <MapView
                onPress={ (event) => addNode(event.nativeEvent.coordinate)}
                style={styles.map}
                initialRegion={{
                    latitude:       coordinates.latitude,
                    longitude:      coordinates.longitude,
                    latitudeDelta:  0.0322,
                    longitudeDelta: 0.0221,
                }}>
                <Marker 
                    coordinate={coordinates}  title='Current Location' />
                <Polyline strokeWidth={7} strokeColor="#C908C9" coordinates={mapNodes}></Polyline>
            </MapView>
            
            <Text>
                Walk route will be saved to phone gallery
            </Text>
            <Button title="Screenshot" color="green" onPress={takeScreenShot} />
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
    map: {
      flex: 1,
      width: "100%",
      height: "100%"
    }
  });