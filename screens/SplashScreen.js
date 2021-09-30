import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text, View, TextInput, ActivityIndicator, Button } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import * as Location from 'expo-location';
//import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as Battery from 'expo-battery';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';

//This is first screen of the app 
export default class SplashScreen extends Component {

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      status: "",
      latitude: null,
      longitude: null,
      errorMessage: null,
      TextConsoleIp: '',
      TextAppName: '',
      isLoading: true,
    }
  }


  componentDidMount() {
    this._isMounted = true;
    this.mGetLocation(true);
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
      }
      else {
        if (showToast === true)
          this.setState({
            isLoading: false,
          });
        Toast.show('No Internet connectivity')
      }
    });
  };

  async FunctionToGetConsoleIpandAppName() {
    try {
      if (await AsyncStorage.getItem('APP_STATUS') !== "Rejected") {
        const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
        this.setState({
          nConsoleIP: await AsyncStorage.getItem('CONSOLE_IP'),
          nAppName: await AsyncStorage.getItem('APP_NAME'),
          TextConsoleIp: await AsyncStorage.getItem('CONSOLE_IP'),
          TextAppName: await AsyncStorage.getItem('APP_NAME'),
        });
        console.log("Show Responce " + this.state.nConsoleIP);
        console.log("Show Responce " + this.state.nAppName);

        const mAppName = await AsyncStorage.getItem('APP_NAME');


        if (mConsoleIP !== null && mAppName !== null) {

          if (await AsyncStorage.getItem('APP_STATUS') === "Pending") {
            this.setState({
              isLoading: false,
            });
            this.props.navigation.navigate('Home');
          } else {
            this.setState({
              isLoading: false,
            });
            this.props.navigation.navigate('BottomTabNavigatorScreen');
          }

        } else {

          this.setState({
            isLoading: false,
          });

        }

      } else {
        this.setState({
          isLoading: false,
        });
        this.setState({
          status: "Rejected"
        });
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onPressSubmitButton() {


    //Handler for the Submit onPress
    if (this.state.TextConsoleIp != '') {
      //Check for the Console IP
      console.log("---------" + this.state.TextConsoleIp)

      //Validate the Console IP
      if (this.state.TextAppName != '') {
        //Check for the App Name

        NetInfo.fetch().then(state => {

          if (state.isConnected) {

            if (state.type === 'wifi')
              this.onFetchLoginRecords(state.details.ssid);
            else
              this.onFetchLoginRecords(state.details.carrier + ' ' + state.details.cellularGeneration);

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

  async onFetchLoginRecords(WiFiName) {

    const BatteryLevel = await Battery.getBatteryLevelAsync();

    console.log('Version: ' + DeviceInfo.getVersion());
    console.log('Battery: ' + BatteryLevel);
    console.log('Device id: ' + DeviceInfo.getUniqueId());
    console.log('Console id: ' + this.state.TextConsoleIp);


    var data = {
      "VMobileAppName": "" + this.state.TextAppName,
      "Guid": "" + DeviceInfo.getUniqueId(),
      "Battery": "" + BatteryLevel,
      "Version": DeviceInfo.getVersion(),
      "WifiName": WiFiName,
      "GPSLat": this.state.latitude,
      "GPSLng": this.state.longitude
    };

    console.log("----------" + "http://" + this.state.TextConsoleIp + "/api/vmappregister")

    const response = fetch(
      "http://" + this.state.TextConsoleIp + "/api/vmappregister", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then((response) => { return response.json() })
      .catch((error) => {
        console.log("Error:" + error);
        Toast.show("Error:" + error);
      })
      .then((response) => {
        console.log("Show Responce " + JSON.stringify(response));
        Toast.show('Application authenticated successfully!!!')
        if (response != null && response !== undefined) {
          this.onSuccessResponce(response);
        }
      })

  }

  async onSuccessResponce(mResponce) {
    if (mResponce.hasOwnProperty('StatusId')) {
      try {
        await AsyncStorage.setItem('CONSOLE_IP', this.state.TextConsoleIp);
        await AsyncStorage.setItem('APP_NAME', this.state.TextAppName);
        await AsyncStorage.setItem('APP_ID', JSON.stringify(mResponce.VMobileAppId));

        if (mResponce.hasOwnProperty('StatusId')) {
          if (mResponce.StatusId === 1) {
            await AsyncStorage.setItem('APP_STATUS', "Pending");
          } else if (mResponce.StatusId === 2) {
            await AsyncStorage.setItem('APP_STATUS', "Accepted");
          } else if (mResponce.StatusId === 3) {
            await AsyncStorage.setItem('APP_STATUS', "Rejected");
          }
        }

        this.props.navigation.navigate('Home');
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={require('./img/splashscreen.png')}
            style={styles.image}>

            <View style={{ flex: 1, paddingTop: 20 }}>
              <ActivityIndicator />
              <Text style={styles.item, { textAlign: 'center', color: '#ffffff', fontSize: 20 }}>
                Loading... Please wait...
              </Text>
            </View>

          </ImageBackground>

        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('./img/splashscreen.png')}
          style={styles.image}>

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
                <Text style={styles.text2}>
                  App Name :
                </Text>
              </View>
              <View style={{
                alignItems: 'flex-start', justifyContent: 'center',
                paddingBottom: 30, marginLeft: 5
              }}>
                <TextInput style={styles.text3}
                  placeholderTextColor="#a6a6a6"
                  onChangeText={TextAppName => this.setState({ TextAppName })}>
                  {this.state.nAppName}
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
        </ImageBackground>



      </View>

    );
  }



}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  text: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  text2: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  text3: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#D3D3D3",
    width: 200,
  },
  textContainer: {
    alignItems: 'center', justifyContent: 'center',
    paddingBottom: 30, marginTop: 25

  },
});
