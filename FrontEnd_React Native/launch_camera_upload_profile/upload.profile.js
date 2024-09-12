import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';

// Handle Upload profile.

const UploadProfile = () => {
    const [profile, setProfile] = useState();
    const beforeProfile = require('../assests/camera.png');
    const navigation = useNavigation();
    const route = useRoute();
    const { userId, PhoneNumber, name, token } = route.params;

    const openCameraUploadImage = () => {
        const options = {
            mediaType: 'photo',
            cameraType: 'back',
        };
        launchCamera(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const formData = new FormData();
                formData.append('profile', {
                    uri: response.assets[0].uri,
                    type: response.assets[0].type,
                    name: response.assets[0].fileName
                });
    
                try {
                    const uploadProfile = await axios.post(
                        `http://192.168.0.105:4000/api/v2/profile/upload/${userId}`,
                        formData,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );
    
                    console.log('Image Upload: ', uploadProfile.data.data.saveProfile.profile);
                    // setProfileId(uploadProfile.data.data.saveProfile._id);
                } catch (error) {
                    console.error('Error uploading image:', error);
                    console.error('Error response:', error.response); // Response ko log karein agar available ho
                }
            }
        });
    };

    const receiveImage = async () => {
        try {
            const response = await axios.get(`http://192.168.0.105:4000/api/v2/profile/receiveByUserId/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                
            });
            const retriveProfile = response.data.data.profile[0].profile.profile;
            console.log('Image URL fetched:: ', retriveProfile);
            setProfile(retriveProfile)
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

     useEffect(() => {
        receiveImage();
    }, []);


    return (
        <ScrollView style={styles.mainView}>
            <View style={styles.profileNav}>
                <View style={styles.profileImage}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assests/arrow.png')} />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 24, color: 'white', position: 'relative',
                        left: 30, top: -5
                    }}>Profile</Text>
                </View>
            </View>

            <View style={styles.uploadView}>
                <View style={styles.uploadPhoto}>
                    <Image style={{ width: '100%', height: '100%', borderRadius: 100 }} 
                        source= {profile ? {uri: profile} : beforeProfile}
                    />
                    <TouchableOpacity onPress={openCameraUploadImage} style={styles.uplodImageCamera}>
                        <Image style={{width: 22, height: 22}} source={require('../assests/camera.png')} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.nameView}>
                <View style={{ position: 'relative', top: -30, left: 20 }}>
                    <Image style={{ width: 22, height: 22 }} source={require('../assests/user.png')} />
                </View>
                <View>
                    <Text style={{
                        fontSize: 17, position: 'relative', left: 45,
                        top: -10
                    }}>Name</Text>
                    <Text style={{
                        fontSize: 17, position: 'relative', left: 45,
                        top: -8
                    }}>{name}</Text>
                    <Text style={{
                        fontSize: 13.5, position: 'relative', left: 45,

                    }}>This is not your username or pin. This name {`\n`} will be visible for your WhatsApp contacts.</Text>
                </View>
                <View style={{ position: 'relative', top: -30 }}>
                    <Image style={{ width: 27, height: 27 }} source={require('../assests/pen.png')} />
                </View>
            </View>

            <View style={styles.aboutView}>
                <View style={{ position: 'relative', top: 30, left: 20 }}>
                    <Image style={{ width: 22, height: 22 }} source={require('../assests/info.png')} />
                </View>
                <View>
                    <Text style={{
                        fontSize: 17, position: 'relative', left: 45
                        , top: 20
                    }}>About</Text>
                    <Text style={{
                        fontSize: 14, position: 'relative', left: 45,
                        top: 20
                    }}>Hey there I am using WhatsApp.</Text>
                </View>
                <View style={{ position: 'relative', top: 25, left: 70 }}>
                    <Image style={{ width: 27, height: 27 }} source={require('../assests/pen.png')} />
                </View>
            </View>

            <View style={styles.phoneView}>
                <View style={{ position: 'relative', top: 30, left: 20 }}>
                    <Image style={{ width: 22, height: 22 }} source={require('../assests/call.png')} />
                </View>
                <View style={{ position: 'relative', top: 25, left: 45, }}>
                    <Text>Phone</Text>
                    <Text>+92 {PhoneNumber}</Text>
                </View>
            </View>

        </ScrollView>
    )
};

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        height: '100%',
    },
    profileNav: {
        width: '100%',
        height: '14%',
        backgroundColor: '#008069',
    },
    profileImage: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        top: 30,
        left: 40
    },
    uplodImageCamera: {
        width: 40,
        height: 40,
        borderRadius: 100,
        backgroundColor: '#1daa61',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: -40,
        left: 40
    },
    uploadView: {
        width: '100%',
        height: 180,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadPhoto: {
        width: 120,
        height: 120,
        backgroundColor: '#E5E5E5',
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
    },
    nameView: {
        width: '100%',
        height: 130,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },

    aboutView: {
        width: '100%',
        height: 100,
        display: 'flex',
        flexDirection: 'row',

    },

    phoneView: {
        width: '100%',
        height: 150,
        display: 'flex',
        flexDirection: 'row',
    }
});
export default UploadProfile
