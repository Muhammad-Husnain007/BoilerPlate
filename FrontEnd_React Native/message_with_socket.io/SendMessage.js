import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import io from 'socket.io-client';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
};

const SendMessage = () => {
  const navigation = useNavigation();
  const [imageSource, setImageSource] = useState(require('../../assests/voice.png'));
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageId, setMessageId] = useState(null);
  const [userMessages, setUserMessages] = useState(new Set()); // Track user messages
  const route = useRoute();
  const { chatId, firstName, lastName, userId, contactId, profileImage } = route.params;
  const socket = useRef(null);
  const inputRef = useRef(null);
  console.log("This is a profile: ", profileImage)

  useEffect(() => {
    socket.current = io('http://192.168.0.105:4000');

    socket.current.on('connect', () => {
      console.log('Connected to socket server:', socket.current.id);

      socket.current.emit('userConnected', { userId, chatId });
    });

    socket.current.on('messageReceived', (message) => {
      if (message.chatId === chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.current.on('messageUpdated', (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => msg._id === updatedMessage._id ? updatedMessage : msg)
    );
    setInputText("")
    });

    socket.current.on('messageDeleted', (deletedMessageId) => {
      console.log("Message Deleted:", deletedMessageId);  // Confirming that delete event is received
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== deletedMessageId)
      );
  });

    return () => {
      socket.current.disconnect();
      console.log('Disconnected from socket server');
    };
  }, [chatId, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://192.168.0.105:4000/api/v2/message/receive/${chatId}`);
        const fetchedMessages = response.data.data.messages;
        setMessages(fetchedMessages);

        const userMessageIds = new Set(fetchedMessages
          .filter(message => message.sender.includes(userId))
          .map(message => message._id));
        setUserMessages(userMessageIds);

      } catch (error) {
        console.log('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId, userId]);

  const goToAbout = () => {
          navigation.navigate("UserAbout", { 
            userId: contactId, firstName: firstName, lastName: lastName, profileImage: profileImage, });
  };

  const updateORdeleteMessage = (message) => {
    Alert.alert(
      'Update or Delete',
      'You can update or delete this message',
      [
        {
          text: 'Update', onPress: () => {
            setInputText(message.content);
            setMessageId(message._id);
            inputRef.current.focus();

          }
        },
        {
          text: 'Delete', onPress: async () => {
            try {
              await axios.delete(`http://192.168.0.105:4000/api/v2/message/delete/${message._id}`);
              socket.current.emit('messageDeleted', message._id);  
            } catch (error) {
              console.log("Error in deleting message", error);
            }
          }
        },        
      ],
      { cancelable: true }
    );
  };

  const updateMessage = async () => {
    try {
      const response = await axios.put(`http://192.168.0.105:4000/api/v2/message/update/${messageId}`, {
        content: inputText,
        edited: true
      });
      const updatedMessage = response.data.data;
      console.log('Updated message: ', updatedMessage); 
      setMessages(messages.map(msg => msg._id === messageId ? updatedMessage : msg));
      setInputText('');
      setMessageId(null);
  
      socket.current.emit('messageUpdated', updatedMessage);
    } catch (error) {
      console.log("Error in updating message", error);
    }
  };

  const sendMessage = async () => {
    if (!socket.current) {
      console.error('Socket is not initialized');
      return;
    }

    if (inputText.trim() === '') return;

    try {
      const response = await axios.post(`http://192.168.0.105:4000/api/v2/message/send/${chatId}`, {
        chatId,
        senderId: userId,
        receiverId: contactId,
        content: inputText,
      });

      console.log('Message sent:', response.data);
      setInputText('');

      if (socket.current) {
        const message = {
          chatId,
          senderId: userId,
          receiverId: contactId,
          content: inputText,
          createdAt: new Date().toISOString(), 
        };
        socket.current.emit('sendMessage', message);
      }

    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (inputText) {
      setImageSource(require('../../assests/send.png'));
    } else {
      setImageSource(require('../../assests/voice.png'));
    }
  }, [inputText]);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={goToAbout} style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.arrowImage} source={require('../../assests/arrow.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userDP}>
          <Image style={styles.whiteUser} source={profileImage}/>
        </TouchableOpacity>

        <Text style={styles.selectContactText}>{`${firstName} ${lastName}`}</Text>
        <TouchableOpacity style={styles.twoImages}>
          <Image
            style={{ width: 20, height: 20, position: 'relative', left: -10 }}
            source={require('../../assests/whiteCall.png')}
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <ImageBackground
        source={require('../../assests/chatBg.jpg')}
        style={styles.chatWrapper}
        imageStyle={{ opacity: 0.5 }}
      >
        <ScrollView style={styles.chatContainer}>
          {messages.map((message, i) => (
            <View
              key={i}
              style={[
                styles.messageContainer,
                userMessages.has(message._id) ? styles.senderMessage : styles.receiverMessage,
              ]}
            >
              <TouchableOpacity onLongPress={() => updateORdeleteMessage(message)}>
                <Text style={styles.messageText}>{message.content}</Text>
                <Text style={{ fontSize: 14 }}>{formatTime(message.createdAt)}</Text>
                {message.edited && <Text style={{ fontSize: 10, color: 'grey' }}>Edited</Text>}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>

      <ImageBackground
        source={require('../../assests/chatBg.jpg')}
        style={styles.typeMessageView}
      >
        <TextInput
          style={styles.inputField}
          placeholder='Message'
          onChangeText={(content) => setInputText(content)}
          value={inputText}
          multiline={true}
          ref={inputRef}
        />

        <TouchableOpacity style={{ width: 20, height: 20, position: 'relative', left: -50 }}>
          <Image source={require('../../assests/cameraColor.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendMessageOrVoice} onPress={messageId ? updateMessage : sendMessage}>
          <Image source={imageSource} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  navbar: {
    width: '100%',
    height: 60,
    backgroundColor: '#008069',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  arrowImage: {
    width: 17,
    height: 20,
  },
  selectContactText: {
    fontSize: 17,
    color: 'white',
    marginLeft: -100,
  },
  userDP: {
    width: 40,
    height: 40,
    backgroundColor: 'silver',
    opacity: 0.7,
    borderRadius: 100,
    position: 'relative',
    left: -50,
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteUser: {
    width: '100%',
    height: '100%',
    borderRadius: 100
  },
  chatWrapper: {
    flex: 1,
    marginTop: 10,
  },
  chatContainer: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 5,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    maxWidth: '70%',
  },
  senderMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  receiverMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
  },
  typeMessageView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f1f1f1',
  },
  inputField: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendMessageOrVoice: {
    width: 54,
    height: 54,
    borderRadius: 100,
    backgroundColor: '#008069',
    marginLeft: -15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default SendMessage;
