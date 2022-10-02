import { StatusBar } from 'expo-status-bar';

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import { AsyncStorage } from'@react-native-async-storage/async-storage';
import * as SQLite from'expo-sqlite';

const db = SQLite.openDatabase('coursedb.db');


export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount]   = useState('');
  const [buys, setBuys]       = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists buy (id integer primary key not null, product text, amount text);');
    }, null, updateList); 
  }, []);

  // save, update, delete -functionalities

  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into buy (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from buy;', [], (_, { rows }) =>
        setBuys(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from buy where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "20%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>

      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>

      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>

      <Button onPress={saveItem} title="Save" /> 

      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>

      <FlatList 
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
          <View style={styles.listcontainer}>
            <Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
            <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}>  bought</Text>
          </View>} 
        data={buys} 
        ItemSeparatorComponent={listSeparator} 
      />    
    </View>
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
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
  },
 });
