import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// Ui and functionalty of OTP.

const EnterOtp = () => {
  const [otp, setOtp] = useState('');
  const inputRef = useRef(null); // Reference to the hidden TextInput

  const handleOtpChange = (text) => {
    if (/^\d{0,6}$/.test(text)) {
      setOtp(text);
    }
  };

  const renderOtpDashes = () => {
    const dashes = [];
    for (let i = 0; i < 6; i++) {
      dashes.push(
        <View key={i} style={styles.otpDashBox}>
          <Text style={styles.otpDigitText}>{otp[i] || '-'}</Text>
        </View>
      );
    }
    return dashes;
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.mainView}>
        <View style={styles.twoText}>
          <Text style={styles.otpMsg}>Waiting to automatically detect an SMS sent to </Text>
          <Text style={styles.startNumber}>+92 348 2854160. Wrong number?</Text>
        </View>

        <TouchableOpacity 
          style={styles.otpInputContainer} 
          onPress={() => inputRef.current.focus()} // Focus the hidden TextInput
        >
          {renderOtpDashes()}
        </TouchableOpacity>

        <TextInput
          ref={inputRef} // Set reference to the TextInput
          keyboardType="numeric"
          value={otp}
          onChangeText={handleOtpChange}
          style={styles.hiddenOtpInput}
          maxLength={6}
        />

        <Text style={styles.otpDigit}>Enter 6-digit code</Text>
        <Text style={styles.otpReceive}>Didn't receive code?</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    position: 'relative',
    top: 30,
    left: 43,
  },
  twoText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: -8,
  },
  startNumber: {
    position: 'relative',
    left: 33,
    top: 5,
  },
  otpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 55,
    marginTop: 20,
  },
  otpDashBox: {
    width: 20,
    height: 40,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  otpDigitText: {
    fontSize: 24,
  },
  hiddenOtpInput: {
    position: 'absolute',
    opacity: 0,
    width: 20,
    height: 1,
  },
  otpDigit: {
    marginLeft: 80,
    marginTop: 15,
  },
  otpReceive: {
    marginLeft: 75,
    marginTop: 5,
  },
});

export default EnterOtp;
