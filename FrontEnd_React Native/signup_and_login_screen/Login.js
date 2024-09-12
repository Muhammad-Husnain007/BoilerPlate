import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, View, Text, TextInput, StyleSheet, Platform, Alert, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

// for User login

const Login = () => {
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  const [countryCode, setCountryCode] = useState('+92');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigation = useNavigation();


  const countries = [
    { name: 'Afghanistan', code: '+93', minLength: 9 },
    { name: 'Albania', code: '+355', minLength: 9 },
    { name: 'Algeria', code: '+213', minLength: 9 },
    { name: 'Andorra', code: '+376', minLength: 9 },
    { name: 'Angola', code: '+244', minLength: 9 },
    { name: 'Bahamas', code: '+1-242', minLength: 9 },
    { name: 'Bahrain', code: '+973', minLength: 9 },
    { name: 'Bangladesh', code: '+880', minLength: 9 },
    { name: 'Barbados', code: '+1-246', minLength: 9 },
    { name: 'Belarus', code: '+375', minLength: 9 },
    { name: 'Cambodia', code: '+855', minLength: 9 },
    { name: 'Cameroon', code: '+237', minLength: 9 },
    { name: 'Canada', code: '+1', minLength: 9 },
    { name: 'Cape Verde', code: '+238', minLength: 9 },
    { name: 'Central African Republic', code: '+236', minLength: 9 },
    { name: 'Denmark', code: '+45', minLength: 9 },
    { name: 'Djibouti', code: '+253', minLength: 9 },
    { name: 'Dominica', code: '+1-767', minLength: 9 },
    { name: 'Dominican Republic', code: '+1-809', minLength: 9 },
    { name: 'DR Congo', code: '+243', minLength: 9 },
    { name: 'East Timor', code: '+670', minLength: 9 },
    { name: 'Ecuador', code: '+593', minLength: 9 },
    { name: 'Egypt', code: '+20', minLength: 9 },
    { name: 'El Salvador', code: '+503', minLength: 9 },
    { name: 'Equatorial Guinea', code: '+240', minLength: 9 },
    { name: 'Fiji', code: '+679', minLength: 9 },
    { name: 'Finland', code: '+358', minLength: 9 },
    { name: 'France', code: '+33', minLength: 9 },
    { name: 'French Guiana', code: '+594', minLength: 9 },
    { name: 'French Polynesia', code: '+689', minLength: 9 },
    { name: 'Gabon', code: '+241', minLength: 9 },
    { name: 'Gambia', code: '+220', minLength: 9 },
    { name: 'Georgia', code: '+995', minLength: 9 },
    { name: 'Germany', code: '+49', minLength: 9 },
    { name: 'Ghana', code: '+233', minLength: 9 },
    { name: 'Haiti', code: '+509', minLength: 9 },
    { name: 'Honduras', code: '+504', minLength: 9 },
    { name: 'Hungary', code: '+36', minLength: 9 },
    { name: 'Iceland', code: '+354', minLength: 9 },
    { name: 'India', code: '+91', minLength: 9 },
    { name: 'Indonesia', code: '+62', minLength: 9 },
    { name: 'Iran', code: '+98', minLength: 9 },
    { name: 'Iraq', code: '+964', minLength: 9 },
    { name: 'Ireland', code: '+353', minLength: 9 },
    { name: 'Jamaica', code: '+1-876', minLength: 9 },
    { name: 'Japan', code: '+81', minLength: 9 },
    { name: 'Jordan', code: '+962', minLength: 9 },
    { name: 'Kazakhstan', code: '+7', minLength: 9 },
    { name: 'Kenya', code: '+254', minLength: 9 },
    { name: 'Kuwait', code: '+965', minLength: 9 },
    { name: 'Kyrgyzstan', code: '+996', minLength: 9 },
    { name: 'Laos', code: '+856', minLength: 9 },
    { name: 'Latvia', code: '+371', minLength: 9 },
    { name: 'Lebanon', code: '+961', minLength: 9 },
    { name: 'Lesotho', code: '+266', minLength: 9 },
    { name: 'Liberia', code: '+231', minLength: 9 },
    { name: 'Libya', code: '+218', minLength: 9 },
    { name: 'Liechtenstein', code: '+423', minLength: 9 },
    { name: 'Lithuania', code: '+370', minLength: 9 },
    { name: 'Luxembourg', code: '+352', minLength: 9 },
    { name: 'Madagascar', code: '+261', minLength: 9 },
    { name: 'Malawi', code: '+265', minLength: 9 },
    { name: 'Malaysia', code: '+60', minLength: 9 },
    { name: 'Maldives', code: '+960', minLength: 9 },
    { name: 'Mali', code: '+223', minLength: 9 },
    { name: 'Malta', code: '+356', minLength: 9 },
    { name: 'Marshall Islands', code: '+692', minLength: 9 },
    { name: 'Mauritania', code: '+222', minLength: 9 },
    { name: 'Mauritius', code: '+230', minLength: 9 },
    { name: 'Mexico', code: '+52', minLength: 9 },
    { name: 'Micronesia', code: '+691', minLength: 9 },
    { name: 'Moldova', code: '+373', minLength: 9 },
    { name: 'Monaco', code: '+377', minLength: 9 },
    { name: 'Mongolia', code: '+976', minLength: 9 },
    { name: 'Montenegro', code: '+382', minLength: 9 },
    { name: 'Morocco', code: '+212', minLength: 9 },
    { name: 'Mozambique', code: '+258', minLength: 9 },
    { name: 'Myanmar', code: '+95', minLength: 9 },
    { name: 'Namibia', code: '+264', minLength: 9 },
    { name: 'Nauru', code: '+674', minLength: 9 },
    { name: 'Nepal', code: '+977', minLength: 9 },
    { name: 'Netherlands', code: '+31', minLength: 9 },
    { name: 'New Zealand', code: '+64', minLength: 9 },
    { name: 'Nicaragua', code: '+505', minLength: 9 },
    { name: 'Niger', code: '+227', minLength: 9 },
    { name: 'Nigeria', code: '+234', minLength: 9 },
    { name: 'North Korea', code: '+850', minLength: 9 },
    { name: 'North Macedonia', code: '+389', minLength: 9 },
    { name: 'Norway', code: '+47', minLength: 9 },
    { name: 'Oman', code: '+968', minLength: 9 },
    { name: 'Pakistan', code: '+92', minLength: 9 },
    { name: 'Palau', code: '+680', minLength: 9 },
    { name: 'Palestine', code: '+970', minLength: 9 },
    { name: 'Panama', code: '+507', minLength: 9 },
    { name: 'Papua New Guinea', code: '+675', minLength: 9 },
    { name: 'Paraguay', code: '+595', minLength: 9 },
    { name: 'Peru', code: '+51', minLength: 9 },
    { name: 'Philippines', code: '+63', minLength: 9 },
    { name: 'Poland', code: '+48', minLength: 9 },
    { name: 'Portugal', code: '+351', minLength: 9 },
    { name: 'Qatar', code: '+974', minLength: 9 },
    { name: 'Romania', code: '+40', minLength: 9 },
    { name: 'Russia', code: '+7', minLength: 9 },
    { name: 'Saint Kitts and Nevis', code: '+1-869', minLength: 9 },
    { name: 'Saint Lucia', code: '+1-758', minLength: 9 },
    { name: 'Saint Vincent and the Grenadines', code: '+1-784', minLength: 9 },
    { name: 'Samoa', code: '+685', minLength: 9 },
    { name: 'San Marino', code: '+378', minLength: 9 },
    { name: 'Tajikistan', code: '+992', minLength: 9 },
    { name: 'Tanzania', code: '+255', minLength: 9 },
    { name: 'Thailand', code: '+66', minLength: 9 },
    { name: 'Togo', code: '+228', minLength: 9 },
    { name: 'Tonga', code: '+676', minLength: 9 },
    { name: 'Uganda', code: '+256', minLength: 9 },
    { name: 'Ukraine', code: '+380', minLength: 9 },
    { name: 'United Arab Emirates', code: '+971', minLength: 9 },
    { name: 'United Kingdom', code: '+44', minLength: 9 },
    { name: 'United States', code: '+1', minLength: 9 },
    { name: 'Vanuatu', code: '+678', minLength: 9 },
    { name: 'Vatican City', code: '+379', minLength: 9 },
    { name: 'Venezuela', code: '+58', minLength: 9 },
    { name: 'Vietnam', code: '+84', minLength: 9 },
    { name: 'Yemen', code: '+967', minLength: 9 },
    { name: 'Western Sahara', code: '+212', minLength: 9 },
    { name: 'Yemen', code: '+967', minLength: 9 },
    { name: 'Zambia', code: '+260', minLength: 9 },
    { name: 'Zimbabwe', code: '+263', minLength: 9 },

  ]  

  const handleCountryChange = (itemValue) => {
    setSelectedCountry(itemValue);
    const selectedCountryObj = countries.find(country => country.name === itemValue);
    if (selectedCountryObj) {
      setCountryCode(selectedCountryObj.code);
    }
  };

  const validateForm = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return false;
    }
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Phone number is too short');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
    // setLoading(true); 
    axios.post('http://192.168.0.105:4000/api/v2/user/login', {
      phoneNumber,
    })
    .then(response => {
      navigation.navigate('Navbar', { 
        userId:response.data.data.user._id,
        token: response.data.data.accessToken,
        PhoneNumber: response.data.data.user.phoneNumber,
        name: response.data.data.user.name,
      });
    })
    .catch(error => {
        setLoading(false)
        Alert.alert("Error 500 Check authentication")
    //   console.error('This is error::::::', error);
    })
  } else {
    setLoading(false)
  }
};

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        style={styles.mainView}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View style={styles.LoginView}>
          <Text>WhatsApp will need to verify your account.</Text>
          <View style={styles.countryPickerContainer}>
            <Picker
              selectedValue={selectedCountry}
              style={styles.picker}
              onValueChange={handleCountryChange}
            >
              {countries.map((country, index) => (
                <Picker.Item key={index} label={country.name} value={country.name} />
              ))}
            </Picker>
          </View>
          <View style={styles.codeAndNumber}>
            <Text style={styles.countryCode}>{countryCode}</Text>
            <TextInput
              keyboardType='numeric'
              placeholder='phone number'
              style={styles.numberInput}
              value={phoneNumber}
              onChangeText={text => setPhoneNumber(text)}
            />
          </View>
          <TouchableOpacity onPress={() => {navigation.navigate("VerifyAccount")}} style={styles.notAlredyAccount}><Text>Not Alredy Account?.</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }}>Next</Text>
        </TouchableOpacity>
      </View>
      
      {/* Loading Indicator Modal */}
      <Modal
        transparent={true}
        visible={loading}
        animationType="none"
        onRequestClose={() => setLoading(false)}

      >
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    position: 'relative',
    top: 40, 
    left: 43
  },
  LoginView: {
    width: '80%',
    flex: 1
  },
  countryPickerContainer: {
    width: 260,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingLeft: 80,
    marginLeft: 10
  },
  picker: {
    flex: 2,
  },
  countryCode: {
    width: 65,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    position: 'relative',
    left: 10,
    top: 15,
    fontSize: 16,
    paddingTop: 8,
  },
  numberInput: {
    width: 160,
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    marginLeft: 110,
    marginTop: -24,
    fontSize: 16.5
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center'
  },
  nextButton: {
    width: 90,
    height: 45,
    backgroundColor: '#008069',
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FFFFFF',
  },
  notAlredyAccount:{
    position: 'relative',
    left: 140,
    top: 20
  },
});

export default Login;
