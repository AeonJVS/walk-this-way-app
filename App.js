import { StatusBar } from 'expo-status-bar';

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import { AsyncStorage } from'@react-native-async-storage/async-storage';
import * as SQLite from'expo-sqlite';

import { Header, Icon, Input, ListItem, Button } from'react-native-elements';



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
        tx.executeSql('delete from buy where id = ?;', [id]);
      }, null, updateList
    )    
  }



  return (
    <View style={styles.container}>

      <Header  
          leftComponent={{ icon: 'menu', color: 'white' }}  
          centerComponent={{ text: 'SHOPPING LIST', style: { color: 'white' } }}  
          rightComponent={{ icon: 'home', color: 'white'}}/>

      <Input   
        placeholder='Product' 
        label='PRODUCT'  
        onChangeText={product => setProduct(product)} 
        value={product} />

      <Input   
        placeholder='Amount' 
        label='AMOUNT'  
        onChangeText={amount => setAmount(amount)} 
        value={amount} />

      <TouchableHighlight underlayColor={'#2196F3'} onPress={saveItem}>
        <View style={styles.button}>
          <Icon type="material" color='white' name="save" />
          <Text style={{ color: 'white' }}>  Save</Text>
        </View>
      </TouchableHighlight>

      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>

      <View style={styles.listcontainer}>
        <FlatList 
          data={buys} 
          renderItem = {({ item }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{item.product}</ListItem.Title>
                <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
              </ListItem.Content>
              <Button type='clear' icon={{name: 'delete', color: 'red'}} onPress={() => {deleteItem(item.id)}} />
            </ListItem>)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
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
