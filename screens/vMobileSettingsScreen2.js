import React, { Component, useCallback } from 'react';
import { StyleSheet, View, Button, Text, TextInput, Image, Linking, Platform, } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import RNANAndroidSettingsLibrary from 'react-native-android-settings-library';
import Toast from 'react-native-simple-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { init, client } from './echo';
import AsyncStorage from '@react-native-community/async-storage';

type Props = {}

//This screen is used to step-2 of vMobile configuration

const OpenSettingsButton = ({ children }) => {
  const handlePress = useCallback(async () => {

    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:')
    } else {
      await RNANAndroidSettingsLibrary.open('ACTION_WIFI_SETTINGS');
    }

  }, []);

  return <Button title={children} color="#ae2222" onPress={handlePress} />;
};

export default class vMobileSettingsScreen2 extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = ({
      WiFi_Name: '',
      connectedState: '',
    }
    )
  }

  componentDidMount() {




    this.interval = setInterval(() => this.FunctionToGetConnectedStatus(), 2000);



    client.on('data', (data) => {

      var string = data
      var settingsObj = {};
      var components = string.toString().split('|');

      for (var j = 0; j < components.length; j++) {
        var keyValue = components[j].split(':');

        settingsObj[keyValue[0]] = keyValue[1];
      }

      // Now the key value pairs have been set, you can simply request them

      var sWiFiName = settingsObj.Wifiname;
      var sPassword = settingsObj.Pass;
      var svMobileName = settingsObj.vMobilename;
      var sConsoleIP = settingsObj.ConsoleIP;

      Toast.show("Wifiname : " + sWiFiName)
      Toast.show("Pass : " + sPassword)
      Toast.show("vMobilename : " + svMobileName)
      Toast.show("ConsoleIP : " + sConsoleIP)
      this.onSuccessResponce(sWiFiName, sPassword, svMobileName, sConsoleIP);



    });




  }

  async onSuccessResponce(sWiFiName, sPassword, svMobileName, sConsoleIP) {
    try {
      await AsyncStorage.setItem('vMOBILE_WIFINAME', sWiFiName);
      await AsyncStorage.setItem('vMOBILE_PASSWORD', sPassword);
      await AsyncStorage.setItem('vMOBILE_NAME', svMobileName);
      await AsyncStorage.setItem('vMOBILE_CONSOLEIP', sConsoleIP);
      Toast.show("--------------->")
    } catch (error) {
      console.log(error)
    }
  }

  componentWillUnmount() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      console.log('-------kill time interval----------')
    }
  }

  FunctionToGetConnectedStatus() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.setState({
          WiFi_Name: state.details.ssid,
        });
        console.log("WiFi ?", this.state.WiFi_Name);
      } else {
        console.log('No Internet connectivity')
        return;
      }
    });
  }

  FunctionToOpenvMobileSettingsScreen3 = () => {

    init('Message:Hi from vMobile App');
    this.props.navigation.navigate('vMobileSettingsScreen3');


  }

  render() {
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

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            vMobile Configuration
          </Text>
        </View>

        <View style={styles.textContainer}>

          <View style={{
            flexDirection: 'row',
          }}>

            <View style={{
              alignItems: 'flex-start', justifyContent: 'center',
              paddingBottom: 30, marginLeft: 10, marginTop: 10
            }}>
              <Text style={styles.text2}>
                Connected WiFi :
              </Text>
            </View>
            <View style={{
              alignItems: 'flex-start', justifyContent: 'center',
              paddingBottom: 30, marginTop: 10, marginLeft: 5
            }}>
              <TextInput style={styles.text3}
                onChangeText={WiFi_Name => this.setState({ WiFi_Name })}
              >
                {this.state.WiFi_Name}
              </TextInput>
            </View>
          </View>

        </View>
        <View style={{
          flexDirection: 'row', alignSelf: "center",
        }}>

          <Image
            source={require('./img/bigunit.png')}
            style={{ width: 108, height: 155, marginRight: 10 }}
          />

          <Image
            source={require('./img/dots.png')}
            style={{ width: 100, height: 6, marginRight: 5 }} alignSelf="center"
          />

          <Image
            source={require('./img/mobile.png')}
            style={{ width: 90, height: 150 }} alignSelf="center"
          />

        </View>

        <View style={{
          flexDirection: 'row', justifyContent: "space-evenly", margin: 5, marginTop: 10,
        }}>
          <Text style={styles.titleText}>
            Step 2: Click on button below to configure the vMobile network.
          </Text>
        </View>
        <View style={{
          flexDirection: 'row', justifyContent: "space-evenly", marginTop: 5,
        }}>
          <OpenSettingsButton >Settings</OpenSettingsButton>
        </View>
        <View style={{
          flexDirection: 'row', justifyContent: "space-evenly", margin: 10, marginTop: 10,
        }}>
          <Text style={styles.titleText}>
            Select vMobile network and enter password as vMobile12 on the settings page. Click Back button to return to app.
          </Text>
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
                  this.props.navigation.goBack(null);
                }}
              />
            </View>

            <View style={styles.button_1}>
              <Button
                title="Next"
                color="#ae2222"
                onPress={() => {
                  this.FunctionToOpenvMobileSettingsScreen3();
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
  }

});
