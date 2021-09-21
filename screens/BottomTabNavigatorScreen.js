import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AboutScreen from '../screens/About';

import BluetoothConfigScreen from './BluetoothConfigScreen';
//import DeviceConfigScreen from './DeviceConfigScreen';
import OperationScreen from '../screens/OperationScreen';
import AppSettingsScreen from '../screens/AppSettingsScreen';
import VmobileOrAppSettingsScreen from '../screens/VmobileOrAppSettingsScreen';
import StatusInfoScreen from '../screens/StatusInfoScreen';
import StatusModuleScreen from '../screens/StatusModuleScreen';
import TopTabNavigator from '../screens/TopTabNavigator';
import WifiScreen from '../screens/WifiScreen';
//import TempScreen from '../screens/TempScreen';
import DeviceParameter from '../screens/DeviceParameter';
import WifiConfigScreen from '../screens/WifiConfigScreen';
import BottomTabNavigatorScreen from '../screens/BottomTabNavigatorScreen';
import vMobileSettingsScreen4 from '../screens/vMobileSettingsScreen4';
import vMobileSettingsScreen3 from '../screens/vMobileSettingsScreen3';
import vMobileSettingsScreen2 from '../screens/vMobileSettingsScreen2';
import vMobileSettingsScreen1 from '../screens/vMobileSettingsScreen1';
//import TCPApp from '../screens/TCPApp';

//This screen shows botttom tab navigator
const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  text2: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
});

function MapsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.text2}>Maps</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
    <Tab.Screen name="Main" component={StatusModuleScreen} options={{
      tabBarLabel: 'Main',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="home" color={color} size={size} />
      ),
    }}
    />
      <Tab.Screen name="Operation" component={OperationScreen} options={{
        tabBarLabel: 'Operation',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="settings" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Configuration" component={VmobileOrAppSettingsScreen} options={{
        tabBarLabel: 'Configuration',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="table-settings" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Maps" component={MapsScreen} options={{
        tabBarLabel: 'Maps',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="google-maps" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Help" component={AboutScreen}
        options={{

          tabBarLabel: 'Help',

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="help-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
<NavigationContainer>
<Stack.Navigator screenOptions={{
    headerShown: false
  }}
 initialRouteName="Tabs">
  
  <Stack.Screen name="tabs" component={MyTabs} />
  <Stack.Screen name="WifiScreen" component={WifiScreen} />
  <Stack.Screen name="WifiConfigScreen" component={WifiConfigScreen} />

  {/* <Stack.Screen name="DeviceConfigScreen" component={DeviceConfigScreen} /> */}
  <Stack.Screen name="TopTabNavigator" component={TopTabNavigator} />
  {/* <Stack.Screen name="TempScreen" component={TempScreen} /> */}
  <Stack.Screen name="BluetoothConfigScreen" component={BluetoothConfigScreen} />
 <Stack.Screen name="DeviceParameter" component={DeviceParameter} />
  <Stack.Screen name="AppSettingsScreen" component={AppSettingsScreen} />
  <Stack.Screen name="vMobileSettingsScreen4" component={vMobileSettingsScreen4} />
  <Stack.Screen name="vMobileSettingsScreen3" component={vMobileSettingsScreen3} />
  <Stack.Screen name="vMobileSettingsScreen2" component={vMobileSettingsScreen2} />
  <Stack.Screen name="vMobileSettingsScreen1" component={vMobileSettingsScreen1} />

  {/* <Stack.Screen name="TCPApp" component={TCPApp} /> */}
  <Stack.Screen name="StatusInfoScreen" component={StatusInfoScreen} />
  <Stack.Screen name="StatusModuleScreen" component={StatusModuleScreen} />
  <Stack.Screen name="OperationScreen" component={OperationScreen} />
  <Stack.Screen name="VmobileOrAppSettingsScreen" component={VmobileOrAppSettingsScreen} />
  <Stack.Screen name="BottomTabNavigatorScreen" component={BottomTabNavigatorScreen} />


  {/* <MyTabs /> */}
</Stack.Navigator>
</NavigationContainer>
  );
}