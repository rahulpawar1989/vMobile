import React, { Component, useCallback } from 'react';
import { StyleSheet, View, Button, Text, TextInput, Image, FlatList, ActivityIndicator, Platform, ScrollView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import RNANAndroidSettingsLibrary from 'react-native-android-settings-library';
import SocketIOClient from 'socket.io-client';
import Toast from 'react-native-simple-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { init, server, client } from './echo';
import { PermissionsAndroid } from 'react-native';
import wifi from 'react-native-android-wifi';
import PopupDialog from 'react-native-popup-dialog';
import AsyncStorage from '@react-native-community/async-storage';

type Props = {}

//This screen is used to step-4 of vMobile configuration

export default class vMobileSettingsScreen4 extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      latitude: '',
      longitude: '',
      connectetNetwork: '',
      savedNetwork: '',
      availableNetwork: '',
      isVisible: false,
      TextConsoleIp: '',
      TextAppName: '',
      SlectedActivevMobileId: 0,
      Status: false,
      StatusId: false,
      nConsoleIP: '',
      nAppName: '',
    }
  }

  componentDidMount() {
    this.FunctionToGetConsoleIpandAppName()


    client.on('data', (data) => {
      Toast.show('Client received: ' + data)

    });



  }

  componentWillUnmount() {

  }

  async FunctionToGetConsoleIpandAppName() {
    try {
      this.setState({
        TextConsoleIp: await AsyncStorage.getItem('vMOBILE_CONSOLEIP'),
        TextAppName: await AsyncStorage.getItem('vMOBILE_NAME'),
        nConsoleIP: await AsyncStorage.getItem('vMOBILE_CONSOLEIP'),
        nAppName: await AsyncStorage.getItem('vMOBILE_NAME'),
      });
      console.log(this.state.TextConsoleIp);
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
    this.setState({
      isLoading: false,
    })
  }

  FunctionToCloseCommunictaion = () => {


    if (this.state.TextConsoleIp != '' && this.state.TextAppName != '') {

      client.write("Command:SetValue|ConsoleIP:" + this.state.TextConsoleIp + "|vMobilename:" + this.state.TextAppName);

    }
    else {
      Toast.show("To move forward please enter Console IP and vMobile name")
    }


  }

  render() {

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
          <Text style={styles.item, { textAlign: 'center', }}>
            Fetching information from vMobile, Please wait...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.MainContainer}>
        <View style={styles.tittleContainer}>
          <View style={{ flexDirection: 'row', }}>
            <Text style={styles.titlevMobileText}>
              vMobile App
            </Text>
            <View style={{
              position: 'absolute',
              right: 5,
              top: 5,
              alignItems: "center"
            }}>
              <MaterialCommunityIcons name="help-circle-outline" size={35} color="white" />
            </View>
          </View>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
          <Text style={styles.titleText}>
            vMobile Configuration
          </Text>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 7, marginLeft: 5 }}>
          <Text style={styles.titleText}>
            Step 4: Enter Console IP along with vMobile Name.
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
        }}>

          <View style={{
            alignItems: 'flex-start', justifyContent: 'center',
            paddingBottom: 30, marginLeft: 50, marginTop: 50
          }}>
            <Text style={styles.titleText}>
              Console IP :
            </Text>
          </View>
          <View style={{
            alignItems: 'flex-start', justifyContent: 'center',
            paddingBottom: 30, marginTop: 50, marginLeft: 5
          }}>
            <TextInput style={styles.titleText} placeholder="Enter Console IP"
              placeholderTextColor="#a6a6a6" onChangeText={TextConsoleIp => this.setState({ TextConsoleIp })}
            >
              {this.state.nConsoleIP}
            </TextInput>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
        }}>

          <View style={{
            alignItems: 'flex-start', justifyContent: 'center',
            paddingBottom: 30, marginLeft: 50
          }}>
            <Text style={styles.titleText}>
              vMobile Name :
            </Text>
          </View>
          <View style={{
            alignItems: 'flex-start', justifyContent: 'center',
            paddingBottom: 30, marginLeft: 5
          }}>
            <TextInput style={styles.titleText} placeholder="Enter App name"
              placeholderTextColor="#a6a6a6" onChangeText={TextAppName => this.setState({ TextAppName })}>
              {this.state.nAppName}
            </TextInput>
          </View>
        </View>

        <View style={styles.bottomView}>
          <View style={{
            flexDirection: 'row', justifyContent: "space-evenly", marginBottom: 15,
          }}>
            <View style={styles.button_1}>
              <Button
                title="Back"
                color="#ae2222"
                onPress={() => {
                  client.write("Message:Done from vMobile App");
                  client.destroy(); // kill client after server's response
                  this.props.navigation.navigate('VmobileOrAppSettingsScreen');
                }}
              />
            </View>
            <View style={styles.button_1}>
              <Button
                title="Done"
                color="#ae2222"
                onPress={() => {
                  this.FunctionToCloseCommunictaion();
                }}
              />
            </View>
          </View>
        </View>
      </View>

    );
  }

}
const styles = StyleSheet.create({

  dialog_button_1: {
    width: '30%',
    height: 30,
    margin: 8,
  },
  text3: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  tittleContainer: {
    width: "100%",
    backgroundColor: '#ae2222',
    justifyContent: 'flex-start',
    height: 45,

  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold',
    color: "#ae2222"
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  bottomView: {
    width: '100%',
    height: 50,

    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  MainContainer: {
    marginTop: 1,
    flex: 1,
  },
  titlevMobileText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: "#ffffff",
  },

  button_1: {
    width: '30%',
    height: 30,
  },

  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  textContainer: {
    alignItems: 'center', justifyContent: 'center',
    paddingBottom: 30, marginTop: 10

  },
  topImageContainer: {
    alignItems: 'baseline', justifyContent: 'center',
    paddingBottom: 30,

  },
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  basecontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  BackBtn: {
    backgroundColor: '#ae2222',
    width: '40%',
    height: 40,
    margin: 10
  },
  DoneBtn: {
    backgroundColor: '#ae2222',
    width: '40%',
    height: 40,
    margin: 10,
  },
  dialogContentView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',

  },
  dialogbox_tittleContainer: {
    width: "100%",
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    paddingBottom: 10,
  },
  dialogbox_titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
});
