import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import * as Location from 'expo-location';
//import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as Battery from 'expo-battery';
import NetInfo from '@react-native-community/netinfo';
import { NavigationEvents } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

// This screen is used to show status of app like pending, rejected and accepted
export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      status: "",
      latitude: null,
      longitude: null,
      errorMessage: null,
      nConsoleIP: "",
      nAppName: "",
      tConsoleIP: '',
      tAppName: '',

    }

  }

  mHitConsoleToGetStatus() {
    this.mGetLocation(false);
  }

  /////////////////////////////////////////////Code to get status from Console//////////////////////

  componentDidMount() {
    this._isMounted = true;
    this.mGetLocation(true);
    this.interval = setInterval(() => this.mHitConsoleToGetStatus(), 4000);
  }

  componentWillUnmount() {
    if (this.interval !== null) {
      clearInterval(this.interval);
    }
    this._isMounted = false;
  }

  mGetLocation(showToast) {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._isMounted && this._getLocationAsync(showToast);
    }
  }
  _getLocationAsync = async (showToast) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this._isMounted && this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this._isMounted && this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });

    try {
      await AsyncStorage.setItem('LATITIUDE', "" + this.state.latitude);
      await AsyncStorage.setItem('LONGITUDE', "" + this.state.longitude);
    } catch (error) {
      console.log(error)
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.FunctionToGetConsoleIpandAppName();
      } else {
        if (showToast === true)
          Toast.show('No Internet connectivity')
      }
    });
  };

  ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return (true)
    }

    return (false)
  }


  async onPressSubmitButton() {


    //Handler for the Submit onPress
    if (this.state.nConsoleIP != '') {
      //Check for the Console IP
      console.log("---------" + this.state.nConsoleIP)
      //Validate the Console IP
      if (this.state.nAppName != '') {
        //Check for the App Name
        try {
          await AsyncStorage.setItem('CONSOLE_IP', this.state.nConsoleIP);
          await AsyncStorage.setItem('APP_NAME', this.state.nAppName);
        }
        catch (error) {
          console.log(error)
        }

        NetInfo.fetch().then(state => {
          console.log("Is connected?", state.details.ssid);
          if (state.isConnected) {
            if (state.type === 'wifi')
              this.onFetchLoginRecords(state.details.ssid, this.state.nConsoleIP, this.state.nAppName);
            else
              this.onFetchLoginRecords(state.details.carrier + ' ' + state.details.cellularGeneration, mConsoleIP, mAppName);


          } else {
            Toast.show('No Internet connectivity')
            return;
          }
        });

      } else {
        Toast.show('Please Enter App Name')
        return;
      }

    } else {
      Toast.show('Please Enter Console IP');
      return;
    }

  }

  async onFetchLoginRecords(WiFiName, mConsoleIP, mAppName) {

    const BatteryLevel = await Battery.getBatteryLevelAsync();

    console.log('Console ip: ' + mConsoleIP);
    console.log('App name: ' + mAppName);


    var data = {
      "VMobileAppName": "" + mAppName,
      "Guid": "" + DeviceInfo.getUniqueId(),
      "Battery": "" + BatteryLevel,
      "Version": DeviceInfo.getVersion(),
      "WifiName": WiFiName,
      "GPSLat": this.state.latitude,
      "GPSLng": this.state.longitude
    };
    const response = fetch(
      "http://" + mConsoleIP + "/api/vmappregister", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((response) => { return response.json() })
      .catch((error) => { //Toast.show("Error:" + error); console.warn("Error:", error)
      })
      .then((response) => {

        if (response != null && response !== undefined) {
          if (response.hasOwnProperty('StatusId')) {
            if (response.StatusId === 1) {
              if (this.state != null && this.state !== undefined) {
                this.setState({
                  status: "Pending"
                });
              }
              this.setAppStatus("Pending");
            } else if (response.StatusId === 2) {
              if (this.state != null && this.state !== undefined) {
                this.setState({
                  status: "Accepted"
                });
              }
              this.setAppStatus("Accepted");
              this.props.navigation.navigate('BottomTabNavigatorScreen');

            } else if (response.StatusId === 3) {
              if (this.state != null && this.state !== undefined) {
                this.setState({
                  status: "Rejected"
                });
              }
              this.setAppStatus("Rejected");
            }
          }
        }
      })
  }

  async setAppStatus(status) {
    try {
      await AsyncStorage.setItem('APP_STATUS', status);
    } catch (error) {
      console.log(error)
    }
  }

  async FunctionToGetConsoleIpandAppName() {
    try {
      if (await AsyncStorage.getItem('APP_STATUS') !== "Rejected") {
        const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
        this.setState({
          nConsoleIP: await AsyncStorage.getItem('CONSOLE_IP'),
          nAppName: await AsyncStorage.getItem('APP_NAME'),
          tConsoleIP: await AsyncStorage.getItem('CONSOLE_IP'),
          tAppName: await AsyncStorage.getItem('APP_NAME')
        });
        console.log("Show Responce " + this.state.nConsoleIP);
        console.log("Show Responce " + this.state.nAppName);

        const mAppName = await AsyncStorage.getItem('APP_NAME');
        if (mConsoleIP !== null && mAppName !== null) {

          this.FunctionToGetConnectedStatus(mConsoleIP, mAppName)
        }
      } else {
        this.setState({
          status: "Rejected"
        });
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  }

  FunctionToGetConnectedStatus(mConsoleIP, mAppName) {

    if (mConsoleIP != '') {
      if (mAppName != '') {
        NetInfo.fetch().then(state => {
          if (state.isConnected) {

            if (state.type === 'wifi')
              this.onFetchLoginRecords(state.details.ssid, mConsoleIP, mAppName);
            else
              this.onFetchLoginRecords(state.details.carrier + ' ' + state.details.cellularGeneration, mConsoleIP, mAppName);

          } else {
            return;
          }
        });

      } else {
        return;
      }
    } else {
      return;
    }

  }


  render() {
    const miniCardStyle = {
      shadowColor: '#000000', shadowOffsetWidth: 2, shadowOffsetHeight: 2,
      shadowOpacity: 0.1, shadowRadius: 5, bgColor: '#ffffff', padding: 5, margin: 20,
      borderRadius: 3, elevation: 3, width: (Dimensions.get("window").width / 2.5) - 10
    };
    const miniCustomCardStyle = {
      shadowColor: '#000000', shadowOffsetWidth: 2, shadowOffsetHeight: 2,
      shadowOpacity: 0.1, shadowRadius: 5, bgColor: '#ffffff', padding: 5, margin: 20,
      borderRadius: 3, elevation: 3, width: (Dimensions.get("window").width / 1.5) - 10
    };



    return (
      <View style={styles.container}>

        <NavigationEvents
          onWillFocus={payload => console.log('will focus')}
          onDidFocus={payload => console.log('did focus')}
          onWillBlur={payload => console.log('will blur')}
          onDidBlur={payload => console.log('did blur')}
        />


        <View style={styles.backgroundContainer}>


        </View>
        <View style={styles.overlay}>

          <View style={{
            position: 'absolute',
            top: 0, left: 0,
            right: 0, bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={styles.text2}>
              {this.state.status}
            </Text>
          </View>

          <View >

            <View style={{
              flexDirection: 'row',
            }}>

              <View style={{
                alignItems: 'flex-start', justifyContent: 'center',
                paddingBottom: 30, marginLeft: 50, marginTop: 50
              }}>
                <Text style={styles.text2}>
                  Console IP :
                </Text>
              </View>
              <View style={{
                alignItems: 'flex-start', justifyContent: 'center',
                paddingBottom: 30, marginTop: 50, marginLeft: 5
              }}>
                <TextInput style={styles.text3}
                  onChangeText={nConsoleIP => this.setState({ nConsoleIP })}
                >
                  {this.state.tConsoleIP}
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
                <Text style={styles.text2}>
                  App Name :
                </Text>
              </View>
              <View style={{
                alignItems: 'flex-start', justifyContent: 'center',
                paddingBottom: 30, marginLeft: 5
              }}>
                <TextInput style={styles.text3}
                  onChangeText={nAppName => this.setState({ nAppName })}>
                  {this.state.tAppName}
                </TextInput>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignSelf: "center" }}>
              <View style={[{ width: "30%", height: 40, alignSelf: "center", marginTop: 20 }]}>
                <Button
                  onPress={this.onPressSubmitButton.bind(this)}
                  title="Done"
                  color="#ae2222"
                />
              </View>
            </View>
          </View>

        </View>
      </View>
    );
  }



}
const styles = StyleSheet.create({
  container: {
    flex: 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5FCFF'

  },
  text2: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0D004C'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#33FFFF'
  },

  topImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});