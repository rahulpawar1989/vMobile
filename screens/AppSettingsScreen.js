import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import * as Battery from 'expo-battery';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';

//This screen is used to register app with Console
export default class AppSettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTrue: false,
      TextConsoleIp: '',
      TextAppName: '',
      nConsoleIP: '',
      nAppName: '',
    };
  }
  state = {
    latitude: null,
    longitude: null,
    errorMessage: null,
  };

  componentDidMount() {

    this.FunctionToGetConsoleIpandAppName()
  }

  async FunctionToGetConsoleIpandAppName() {
    try {
      this.setState({
        nConsoleIP: await AsyncStorage.getItem('CONSOLE_IP'),
        nAppName: await AsyncStorage.getItem('APP_NAME')
      });
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
  }

  ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return (true)
    }

    return (false)
  }

  onPressSubmitButton() {

    if (this.state.TextConsoleIp == '') {
      this.state.TextConsoleIp = this.state.nConsoleIP
    }

    if (this.state.TextAppName == '') {
      this.state.TextAppName = this.state.nAppName
    }

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
              this.onFetchLoginRecords(state.details.carrier + state.details.cellularGeneration);


          } else {
            Toast.show('No Internet connectivity')
          }
        });

      } else {
        Toast.show('Please Enter App Name')
      }

    } else {
      Toast.show('Please Enter Console IP');
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

      } catch (error) {
        console.log(error)
      }
    }
  }


  render() {
    return (
      <View >
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            Configure App with console
          </Text>
        </View>
        <View style={{
          flexDirection: 'row', alignSelf: "center",
        }}>

          <Image
            source={require('./img/mobile.png')}
            style={{ width: 75, height: 125, marginRight: 10 }}
          />

          <Image
            source={require('./img/dots.png')}
            style={{ width: 100, height: 6 }} alignSelf="center"
          />

          <Image
            source={require('./img/consoleserverlaptop.png')}
            style={{ width: 80, height: 80 }} alignSelf="center"
          />

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
              App Name :
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
        <View style={{ flexDirection: 'row', alignSelf: "center" }}>
          <View style={[{ width: "30%", height: 40 }]}>
            <Button
              onPress={() => this.props.navigation.goBack(null)}
              title="Back"
              color="#ae2222"
            />
          </View>
          <View style={[{ width: "30%", height: 40, marginLeft: 50 }]}>
            <Button
              onPress={
                this.onPressSubmitButton.bind(this)}
              title="Done"
              color="#ae2222"
            />
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  textContainer: {
    alignItems: 'center', justifyContent: 'center',
    paddingBottom: 30, marginTop: 25

  },
  topImageContainer: {
    alignItems: 'baseline', justifyContent: 'center',
    paddingBottom: 30,

  },
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
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

