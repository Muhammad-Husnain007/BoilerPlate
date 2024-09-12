import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

//  For get user contacts on chat screen and create chat with two participants and pass 
//  data on send Message Component

const Chats = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, token } = route.params;
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState();
  const beforeProfile = require('../assests/whiteUser.png');
  
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.105:4000/api/v2/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const contacts = response.data.data.contacts;
        const filteredContacts = contacts.filter(contact => contact.exists === true);
        setUsers(filteredContacts);
      
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch contacts. Please try again later.');
      }
    };

    if (userId) {
      getData();
    } else {
      console.error('No userId parameter found');
    }
  }, [userId, token]);

  const createOrNavigateChat = async (contactArr, profileImage) => {
    try {
      const participant1 = userId;
      const participant2 = contactArr.contact.user[0];
      const participants = [participant1, participant2];

      const existingChatResponse = await axios.post(
        `http://192.168.0.105:4000/api/v2/chat/participantsExist`,
        { participants },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (existingChatResponse.data.data) {
        navigation.navigate("SendMessage", {
          firstName: contactArr.contact.firstName,
          lastName: contactArr.contact.lastName,
          contactId: contactArr.contact.user[0],
          chatId: existingChatResponse.data.data._id,
          userId: userId,
          profileImage: profileImage,
        });
      } else {
        const createChatResponse = await axios.post(
          `http://192.168.0.105:4000/api/v2/chat/createChat`,
          { participants },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        navigation.navigate("SendMessage", {
          firstName: contactArr.contact.firstName,
          lastName: contactArr.contact.lastName,
          contactId: contactArr.contact.user[0],
          chatId: createChatResponse.data.data._id,
          userId: userId,
          profileImage: profileImage,

        });
      }
    } catch (error) {
        Alert.alert('Error', 'Something went wrong.');
    }
  };

  const goToContact = () => {
    navigation.navigate("Contact", { userId, token });
  };

  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={users.length === 0 ? styles.centeredContent : styles.mainView}>
        {users.length === 0 ? (
          <View style={styles.noContactsContainer}>
            <Text style={styles.noContactsText}>No user contact</Text>
          </View>
        ) : (
          <View style={styles.userContact}>
            {users.map((contactArr, i) => {
              let user = contactArr.contact.user;
              let profileImage = beforeProfile; 
              // Check if user exists and handle null checks for displayProfile
              if (user && user[0]) {
                let displayProfile = user[0].displayProfile;
  
                // Check if displayProfile exists and is not null or empty
                if (displayProfile && displayProfile[0] && displayProfile[0].profile.profile) {
                  profileImage = { uri: displayProfile[0].profile.profile }; // Actual profile image if available
                }
              }
              {/* console.log('Profile:  ',profileImage) */}
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.everyUser}
                  onPress={async () => {
                    await createOrNavigateChat(contactArr, profileImage);
                  }}
                >
                  <TouchableOpacity style={styles.userDP}>
                    <Image 
                      style={{ width: '100%', height: '100%', borderRadius: 100 }} 
                      source={profileImage} 
                    />
                  </TouchableOpacity>
                  <Text style={styles.userName}>
                    {contactArr.contact.firstName} {contactArr.contact.lastName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
  
      <TouchableOpacity onPress={goToContact} style={styles.goToContact}>
        <Image style={styles.contactIcon} source={require('../assests/comment.png')} />
      </TouchableOpacity>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white'

  },
  mainView: {
    flexGrow: 1,
  },
  centeredContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContact: {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    marginTop: 10,
  },
  everyUser: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    marginTop: 10,
  },
  userDP: {
    width: 50,
    height: 50,
    backgroundColor: 'silver',
    opacity: 0.7,
    borderRadius: 100,
    marginLeft: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteUser: {
    width: 30,
    height: 30,
  },
  userName: {
    fontSize: 16,
    marginLeft: 30,
    marginTop: 15,
  },
  goToContact: {
    position: 'absolute',
    width: 55,
    height: 55,
    bottom: 20,
    right: 20,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1daa61',
    borderRadius: 15,
  },
  noContactsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noContactsText: {
    fontSize: 18,
  },
  contactIcon: {
    width: 30,
    height: 30,
    marginTop: 7
  },
});

export default Chats;
