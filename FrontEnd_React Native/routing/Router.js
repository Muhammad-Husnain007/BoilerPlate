import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // corrected import statement
import AgreeContinue from '../Rejistration/AgreeContinue';
import VerifyAccount from '../Rejistration/VerifyAccount';
import EnterOtp from '../Rejistration/EnterOtp';
import Navbar from '../Home/Navbar';
import Groups from '../Home/Groups';
import Chats from '../Home/Chats';
import Calls from '../Home/Calls';
import Updates from '../Home/Updates';
import CameraScreen from '../Home/CameraScreen';
import Contact from '../Home/Contact';
import AddUser from '../Home/AddUser';
import SendMessage from '../Home/SendMessegeScreens/SendMessage';
import HomeRoutes from '../Home/HomeRoutes';
import OpenSetting from '../Home/open.setting';
import UploadProfile from '../Home/upload.profile';
import UserAbout from '../Home/SendMessegeScreens/UserAbout';
import Login from '../Rejistration/Login';
const Stack = createNativeStackNavigator();

const StackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}  initialRouteName='AgreeContinue'>
    <Stack.Screen name="AgreeContinue" component={AgreeContinue} />
    <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
    <Stack.Screen name="EnterOTP" component={EnterOtp} />
    <Stack.Screen name="Navbar" component={Navbar} />
    <Stack.Screen name="Contact" component={Contact} />
    <Stack.Screen name="AddUser" component={AddUser} />
    <Stack.Screen name="SendMessage" component={SendMessage} />
    <Stack.Screen name="HomeRoutes" component={HomeRoutes} />
    <Stack.Screen name="OpenSetting" component={OpenSetting} />
    <Stack.Screen name="UploadProfile" component={UploadProfile} />
    <Stack.Screen name="UserAbout" component={UserAbout} />
    <Stack.Screen name="Calls" component={Calls} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Updates" component={Updates} />
  </Stack.Navigator>

);

const Router = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Router;
