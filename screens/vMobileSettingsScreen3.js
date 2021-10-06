import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, TextInput, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import Toast from 'react-native-simple-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { client } from './echo';
import { PermissionsAndroid } from 'react-native';
import wifi from 'react-native-android-wifi';
import PopupDialog from 'react-native-popup-dialog';
import { Platform } from 'react-native';

type Props = {}

//This screen is used to step-3 of vMobile configuration

export default class vMobileSettingsScreen3 extends Component<Props> {
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
      wiFi_UserName: '',
      wiFi_Password: '',
      SlectedActivevMobileId: 0,
      Status: false,
      StatusId: false,
    }
  }
componentDidMount()
{
  //Call this function for Android only since the permssions are required for Android
  if (Platform.OS === 'android') {
    this.FunctionToGetLocationPermission();
    }

    // Set initial loader for iOS as false 
    if (Platform.OS === 'ios') {
      this.setState({
        isLoading: false,
      });
    }
    client.on('data', (data) => {
      Toast.show('Client received: ' + data)

    });
}

  async FunctionToGetLocationPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission is required for WiFi connections',
        message:
          'This app needs location permission as this is required  ' +
          'to scan for wifi networks.',
        buttonNegative: 'DENY',
        buttonPositive: 'ALLOW',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // You can now use react-native-wifi-reborn
      console.log("granted")
      wifi.loadWifiList((wifiStringList) => {
        var wifiArray = JSON.parse(wifiStringList);
        this.setState({
          savedNetwork: wifiArray,
          isLoading: false,
        });
        console.log("--------->" + this.state.savedNetwork);
      },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.props.navigation.goBack(null);
    }
  }


  componentWillUnmount() {

  }

  FunctionToOpenvMobileSettingsScreen4 = () => {

    if (this.state.wiFi_UserName != '' && this.state.wiFi_Password != '') {

      client.write("Command:SetValue|WifiName:" + this.state.wiFi_UserName + "|Pass:" + this.state.wiFi_Password);
      this.props.navigation.navigate('vMobileSettingsScreen4');
    } else {
      Toast.show("To move forward please select and enter WiFi details")
    }



  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
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
          {/* Change text based on iOS/Android since there is no list on iOS */}
        { (Platform.OS === 'android') &&  <Text style={styles.titleText}>
            Step 3: Select only 2.4GHz WiFi network and enter Password. On pressing OK please re-connect with vMobile unit using appropriate vMobile network.
          </Text>
        }
        { (Platform.OS === 'ios') &&  <Text style={styles.titleText}>
            Step 3: Enter WiFi network name and enter Password. On pressing Next please re-connect with vMobile unit using appropriate vMobile network.
          </Text>
        }
        </View>

        {/* List if available only for Android */}
        { (Platform.OS === 'android') && 
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 7 }}>
          <Text style={{
            fontSize: 15,
            color: 'black',
          }}>
            Available Networks
          </Text>
        </View>
        }
        {/* List will be there only for Android */}
        { (Platform.OS === 'android') && 
        <ScrollView persistentScrollbar={true} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, }}>
          <FlatList

            data={this.state.savedNetwork}

            ItemSeparatorComponent={this.FlatListItemSeparator}

            renderItem={({ item, index }) => {

              return <Text style={styles.item} onPress={() => {
                this.setState({
                  wiFi_UserName: item.SSID,
                });
                console.log('--' + item.SSID)
                this.setState({
                  wiFi_Password: '',
                });
                this.popupDialog.show();
              }}
              > {item.SSID} </Text>;
            }}

            keyExtractor={(item, index) => index.toString()}

          />
        </ScrollView>
        }

       {/* Display wifi username and password UI for iOS on screen */}
        { (Platform.OS === 'ios') && 
        <View style={styles.dialogContentView}>

        <View style={styles.dialogbox_tittleContainer}>
          <Text style={styles.dialogbox_titleText}>
            WiFi Details
          </Text>
        </View>


        <View style={styles.container}>

          <TextInput
            value={this.state.wiFi_UserName}
            onChangeText={(wiFi_UserName) => this.setState({ wiFi_UserName })}
            placeholder="WiFiname"
            style={styles.input}
          />
          <TextInput
            value={this.state.wiFi_Password}
            onChangeText={(wiFi_Password) => this.setState({ wiFi_Password })}
            placeholder="Enter Password"
            secureTextEntry={true}
            style={styles.input}
          />

        </View>
        </View>
              }

        <PopupDialog
          ref={popupDialog => {
            this.popupDialog = popupDialog;
          }}
          dialogStyle={{
            backgroundColor: '#fff',
            height: 230,
            width: 320,
            border: 10,
            padding: 10,
          }}
          overlayBackgroundColor="#ddd"
          visible={false}
          dismissOnTouchOutside={true}>
          <View style={styles.dialogContentView}>

            <View style={styles.dialogbox_tittleContainer}>
              <Text style={styles.dialogbox_titleText}>
                WiFi Details
              </Text>
            </View>

            <View style={styles.container}>

              <TextInput
                value={this.state.wiFi_UserName}
                onChangeText={(wiFi_UserName) => this.setState({ wiFi_UserName })}
                placeholder="WiFiname"
                style={styles.input}
              />
              <TextInput
                value={this.state.wiFi_Password}
                onChangeText={(wiFi_Password) => this.setState({ wiFi_Password })}
                placeholder="Enter Password"
                secureTextEntry={true}
                style={styles.input}
              />

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.dialog_button_1}>
                  <Button
                    title="Ok"
                    onPress={() => {
                      console.log('Ok clicked');
                      this.popupDialog.dismiss();
                    }}
                    color="#ae2222"
                  />
                </View>
                <View style={styles.dialog_button_1}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      console.log('Cancel clicked');
                      this.popupDialog.dismiss();
                    }}
                    color="#ae2222"
                  />
                </View>
              </View>
            </View>
          </View>
        </PopupDialog>

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
            
            { (Platform.OS === 'android') && 
            <View style={styles.button_1}>
              <Button
                title="Add WiFi"
                color="#ae2222"
                onPress={() => {
                  this.setState({
                    wiFi_UserName: '',
                    wiFi_Password: '',
                  });
                  this.popupDialog.show()
                }}
              />
            </View>
            }

            <View style={styles.button_1}>
              <Button
                title="Next"
                color="#ae2222"
                onPress={() => {
                  this.FunctionToOpenvMobileSettingsScreen4();
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
    height: 50,
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
    height: 50,
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
