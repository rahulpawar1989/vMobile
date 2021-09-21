import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator, FlatList, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import PopupDialog from 'react-native-popup-dialog';

//This screen shows list of available networks and also a option to add new wifi
export default class WifiModuleScreen extends Component {

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

  componentDidMount() {

    this.onFetchLoginRecords();

    this.focusListener = this.props.navigation.addListener('focus', () => {
      console.log('--------Call  method-------------------------------------');
      this.getReload();
    });

  }

  async getReload() {
    var Reload = await AsyncStorage.getItem('reload');

    try {
      await AsyncStorage.setItem('reload', "false");
    } catch (error) {
      console.log(error)
    }

    if (Reload === 'true') {
      console.log('--------Call obBack() @@@@@@@@@@@@@' + Reload);
      this.setState({
        isLoading: true,
      })
      this.onFetchLoginRecords();
    }
  }


  async onFetchLoginRecords() {
    try {
      this.setState({
        SlectedActivevMobileId: await AsyncStorage.getItem('SELECTED_VMOBILE_ID'),
      });

      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');


      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {

            console.log('URl ----------' + "http://" + mConsoleIP + "/api/getwifilist/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/");

            const response = fetch("http://" + mConsoleIP + "/api/getwifilist/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {
                this.setState({
                  isLoading: false,
                  connectetNetwork: responseJson.ConnectedWifi,
                  savedNetwork: responseJson.SaveWifiList,
                  availableNetwork: responseJson.ScanWifiList,
                });

                console.log('data------>' + responseJson.ConnectedWifi)

              })
              .catch((error) => {
                //console.error(error);
                Toast.show("Network request failed.")
                this.props.navigation.goBack(null);
              });
          } else {
            Toast.show("Please configure App with the Console.")
            this.props.navigation.goBack(null);
          }
        } else {
          Toast.show('No Internet connectivity')
          this.props.navigation.goBack(null);
        }
      });
    } catch (error) {
      console.log(error)
      this.props.navigation.goBack(null);
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

  GetFlatListItem(vMobileID) {
  }

  FunctionToOpenWifiConfigScreen = () => {
    this.props.navigation.navigate('WifiConfigScreen', { availableNetwork: this.state.availableNetwork });
    this.props.navigation.navigate('WifiConfigScreen', { SlectedActivevMobileId: this.state.SlectedActivevMobileId });
  }

  FunctionToPopulateUsernameAndPassword = () => {


    this.popupDialog.show();

  }

  mHitConsoleToGetStatus(mConsoleIP, vMobileId, cmdId) {

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (mConsoleIP != null && vMobileId != null) {

          console.log('URl ----------' + "http://" + mConsoleIP + "/api/GetCmdId/" + vMobileId + "/" + this.state.longitude + "/" + this.state.latitude + "/");

          const response = fetch("http://" + mConsoleIP + "/api/GetCmdId/" + vMobileId + "/" + this.state.longitude + "/" + this.state.latitude + "/", {
            method: 'GET'
          })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.cmdId === cmdId) {
                console.log('Successfully hit------>' + responseJson.cmdId)
                clearInterval(this.myInterval);
                this.onFetchLoginRecords();
              } else {
                console.log('unSuccessfully---->' + responseJson.cmdId)
              }



            })
            .catch((error) => {
              console.log(error);
              Toast.show("Network request failed.")
              this.props.navigation.goBack(null);
            });
        } else {
          console.log(error)
          Toast.show("Please configure App with the Console.")
          this.props.navigation.goBack(null);
        }
      } else {
        console.log(error)
        Toast.show('No Internet connectivity')
        this.props.navigation.goBack(null);
      }
    });

  }

  FunctionToConnectWiFI = (wiFi_UserName, wiFi_Password) => {
    this.onConnectWiFi(wiFi_UserName, wiFi_Password);
  }

  async onConnectWiFi(wiFi_UserName, wiFi_Password) {
    try {
      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

      this.setState({
        isLoading: true,
      });

      console.log('SlectedActivevMobileId: ' + this.state.SlectedActivevMobileId);
      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);
      console.log('wiFi_UserName: ' + wiFi_UserName);
      console.log('wiFi_Password: ' + wiFi_Password);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {

            console.log('URl ----------' + "http://" + mConsoleIP + "/api/WiFiCommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 12 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + wiFi_UserName + "/" + wiFi_Password + "/");

            const response = fetch("http://" + mConsoleIP + "/api/WiFiCommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 12 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + wiFi_UserName + "/" + wiFi_Password + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {


                console.log('data------>' + responseJson.Status)

                if (responseJson.Status === true) {
                  this.myInterval = setInterval(() => this.mHitConsoleToGetStatus(mConsoleIP, this.state.SlectedActivevMobileId, 12), 1000);
                } else {
                  console.log('------>' + responseJson.Status)
                }

              })
              .catch((error) => {
                Toast.show("Network request failed.")
              });
          } else {
            Toast.show("Please configure App with the Console.")
          }
        } else {
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      console.log(error)
      Toast.show('Some Error happened. Please try again')
    }
  }

  FunctionToSaveWiFI = (wiFi_UserName, wiFi_Password) => {
    this.onSaveWiFi(wiFi_UserName, wiFi_Password);
  }

  async onSaveWiFi(wiFi_UserName, wiFi_Password) {
    try {
      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

      this.setState({
        isLoading: true,
      });

      console.log('SlectedActivevMobileId: ' + this.state.SlectedActivevMobileId);
      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);
      console.log('wiFi_UserName: ' + wiFi_UserName);
      console.log('wiFi_Password: ' + wiFi_Password);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {

            console.log('URl ----------' + "http://" + mConsoleIP + "/api/WiFiCommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 18 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + wiFi_UserName + "/" + wiFi_Password + "/");

            const response = fetch("http://" + mConsoleIP + "/api/WiFiCommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 18 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + wiFi_UserName + "/" + wiFi_Password + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {


                console.log('data------>' + responseJson.Status)

                if (responseJson.Status === true) {
                  this.myInterval = setInterval(() => this.mHitConsoleToGetStatus(mConsoleIP, this.state.SlectedActivevMobileId, 18), 1000);
                } else {
                  console.log('------>' + responseJson.Status)
                }


              })
              .catch((error) => {
                Toast.show("Network request failed.")
              });
          } else {
            Toast.show("Please configure App with the Console.")
          }
        } else {
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      console.log(error)
      Toast.show('Some Error happened. Please try again')
    }
  }

  FunctionToDeleteWiFI = (wiFi_UserName, wiFi_Password) => {
    this.onDeleteWiFi(wiFi_UserName, wiFi_Password);
  }

  async onDeleteWiFi(wiFi_UserName, wiFi_Password) {
    try {
      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

      this.setState({
        isLoading: true,
      });

      console.log('SlectedActivevMobileId: ' + this.state.SlectedActivevMobileId);
      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);
      console.log('wiFi_UserName: ' + wiFi_UserName);
      console.log('wiFi_Password: ' + wiFi_Password);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {

            console.log('URl ----------' + "http://" + mConsoleIP + "/api/WiFiCommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 16 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + wiFi_UserName + "/" + wiFi_Password + "/");

            const response = fetch("http://" + mConsoleIP + "/api/WiFiCommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 16 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + wiFi_UserName + "/" + wiFi_Password + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {


                console.log('data------>' + responseJson.Status)

                if (responseJson.Status === true) {
                  this.myInterval = setInterval(() => this.mHitConsoleToGetStatus(mConsoleIP, this.state.SlectedActivevMobileId, 16), 1000);
                } else {
                  console.log('------>' + responseJson.Status)
                }

              })
              .catch((error) => {
                Toast.show("Network request failed.")
              });
          } else {
            Toast.show("Please configure App with the Console.")
          }
        } else {
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      console.log(error)
      Toast.show('Some Error happened. Please try again')
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

        <View style={styles.topImageContainer}>
          <Image
            source={require('./img/gl_logo.png')}
            style={{ width: "100%", height: 25 }}
          />
        </View>

        <View style={styles.tittleContainer}>
          <Text style={styles.titleText}>
            Connected Networks
          </Text>
        </View>

        <View >
          <Text style={styles.item}>

            {this.state.connectetNetwork}
          </Text>
        </View>


        <View style={styles.tittleContainer}>
          <Text style={styles.titleText}>
            Saved Networks
          </Text>
        </View>


        <FlatList

          data={this.state.savedNetwork}

          ItemSeparatorComponent={this.FlatListItemSeparator}

          renderItem={({ item, index }) => {
            if (item.Text === this.state.connectetNetwork) {
              return <Text style={styles.item}
              > {item.Text}
                <Text style={{ color: 'green', fontSize: 15, fontWeight: 'normal' }}>
                  {"    "}
                  <Text style={{ color: 'green', fontSize: 15, fontWeight: 'normal' }}>
                    [connected]
                  </Text>
                </Text>
              </Text>;
            } else {
              return <Text style={styles.item} onPress={() => {
                this.setState({
                  wiFi_UserName: item.Text,
                  wiFi_Password: item.Value,
                  StatusId: false,
                });
                console.log('' + item.Text)
                console.log('' + item.Value)
                this.popupDialog.show();
              }}
              > {item.Text} </Text>;
            }
          }}

          keyExtractor={(item, index) => index.toString()}

        />
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

            <View style={styles.tittleContainer}>
              <Text style={styles.titleText}>
                Add/Modify/Connect Networks
              </Text>
            </View>

            <View style={styles.container}>

              <TextInput
                value={this.state.wiFi_UserName}
                onChangeText={(wiFi_UserName) => this.setState({ wiFi_UserName })}
                placeholder="Username"
                style={styles.input}
              />
              <TextInput
                value={this.state.wiFi_Password}
                onChangeText={(wiFi_Password) => this.setState({ wiFi_Password })}
                placeholder="Password"
                secureTextEntry={true}
                style={styles.input}
              />

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.button_1}>
                  <Button
                    title="Edit"
                    onPress={() => {
                      console.log('save clicked');
                      this.FunctionToSaveWiFI(this.state.wiFi_UserName, this.state.wiFi_Password);
                      this.popupDialog.dismiss();
                    }}
                    color="#ae2222"
                  />
                </View>
                <View style={styles.button_1}>
                  <Button
                    title="Delete"
                    onPress={() => {
                      console.log('Delete clicked');
                      this.FunctionToDeleteWiFI(this.state.wiFi_UserName, this.state.wiFi_Password);
                      this.popupDialog.dismiss();
                    }}
                    color="#ae2222"
                  />
                </View>

                <View style={styles.button_1}>
                  <Button
                    title="Connect"
                    disabled={this.state.StatusId}
                    onPress={() => {
                      console.log('Connect clicked');
                      this.FunctionToConnectWiFI(this.state.wiFi_UserName, this.state.wiFi_Password);
                      this.popupDialog.dismiss();
                    }}
                    color="#ae2222"
                  />
                </View>
              </View>
            </View>
          </View>
        </PopupDialog>


        <View style={{ flexDirection: 'row', alignSelf: "center", marginTop: 20 }}>
          <View style={[{ width: "30%", height: 40 }]}>
            <Button
              onPress={() => {
                this.props.navigation.goBack(null);

              }}
              title="Back"
              color="#ae2222"
            />
          </View>
          <View style={[{ width: "30%", height: 40, marginLeft: 50 }]}>
            <Button
              onPress={this.FunctionToOpenWifiConfigScreen}
              title="Wifi Config"
              color="#ae2222"
            />
          </View>
        </View>


        <View style={[{ width: "30%", margin: 10, alignSelf: 'flex-end' }]}>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 12,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  button_1: {
    width: '30%',
    height: 30,
    margin: 8,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  inputext: {
    width: 200,
    height: 44,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  tittleContainer: {
    width: "100%",
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 10
  },
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold',
    color: "#ae2222"
  },
  dialogContentView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',

  },

});