import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { ScrollView, View, StyleSheet, Text, Image, TextInput, Alert, TouchableOpacity } from 'react-native'
import axios from 'axios'

//  For Add contact into contact list

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
  const route = useRoute()
  const {userId, token} = route.params
  // console.log(userId, token)

  // Save User into database.

const saveUser = async () => {
  try {
      if (!firstName || !lastName || !phoneNumber) {
          throw new Error('All fields are required');
      }
           await axios.post(`http://192.168.0.105:4000/api/v2/contact/newContact/${userId}`,{
            firstName,
            lastName,
            phoneNumber,
          },
          { headers: {
            Authorization: `Bearer ${token}`
          }
        }). then( response => {
            console.log('Data posted successfully:', response.data);
            navigation.navigate('Contact', {userId: userId})
          }) 
      } catch (error) {
      console.error('Error posting data:', error.message);
  }
};
  

  return (
    <ScrollView style={styles.mainView}>

      {/* /////////// Navabr ///////// */}
       <View style={styles.navbar}>
       <TouchableOpacity onPress={() => navigation.goBack()}>
         <Image style={styles.arrowImage} source={require('../assests/arrowGreen.png')} />
       </TouchableOpacity>
       <Text style={styles.selectContactText}>Save Contact</Text>
       <View style={styles.twoImages}>
         <Image style={styles.childImage} source={require('../assests/dots.png')} />
       </View>
     </View>

      {/* /////////// About User ///////// */}

      <View style={styles.aboutView}>
        <View style={styles.userAndName}>
          {/* <Image source={require('../assests/user.png')} /> */}
          <TextInput
            placeholder='First name' style={styles.firstName}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <TextInput
          placeholder='Last name' style={styles.lastName}
          value={lastName}
          onChangeText={setLastName}
        />
        <View style={styles.callAndPhone}>
          {/* <Image source={require('../assests/call.png')} /> */}
          <TextInput
            placeholder='Phone' keyboardType='numeric' style={styles.phoneNumber}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={saveUser}>
          <Text style={{ color: 'white', fontSize: 22}}>Save</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    backgroundColor: 'white',
    height: '100%',
  },
  navbar: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 999,
  },
  arrowImage: {
    width: 17,
    height: 20,
    position: 'relative',
    left: 10
  },
  selectContactText: {
    fontSize: 17,
  },
  twoImages: {
    flexDirection: 'row',
  },
  childImage: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  /////////////////
  aboutView: {
    width: '100%',
    height: 640,
    position: 'relative',
    top: 40,
    paddingTop: 40
  },
  firstName: {
    borderBottomWidth: 1,
    width: 270,
    position: 'relative',
    left: 60,
    top: 20,
    fontSize: 16,

  },
  lastName: {
    borderBottomWidth: 1,
    width: 270,
    position: 'relative',
    left: 60,
    top: 70,
    fontSize: 16,

  },
  phoneNumber: {
    borderBottomWidth: 1,
    width: 270,
    position: 'relative',
    left: 60,
    top: 110,
    fontSize: 16,

  },
  saveButton: {
    width: 300,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#008069',
    position: 'relative',
    top: 350,
    left: 30,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
   
  },
  // userAndName: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   position: 'relative',
  // },
  // callAndPhone: {
  //   display: 'flex',
  //   flexDirection: 'row'
  // },

});

export default AddUser;
