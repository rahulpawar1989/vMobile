import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ActivityIndicator, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

//This screen shows list of available and paired bluetooth devices with vMobile
export default class BluetoothConfigScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      latitude: '',
      longitude: '',

      PairedDevices: '',
      AvailableDevices: '',

      SlectedActivevMobileId: '',
      SelectedSide: 0,
    }
  }

  componentDidMount() {
    console.log('Slected Side ----------' + this.props.route.params.Side);
    var Side = this.props.route.params.Side;
    this.onFetchLoginRecords_1(Side);
  }

  onBack() {
   // console.log('--------Call obBack() method-----');
    //var mRleoad = this.getReload();
  }

  async onFetchLoginRecords_1(Side) {
    try {
      this.setState({
        SlectedActivevMobileId: await AsyncStorage.getItem('SELECTED_VMOBILE_ID'),
      });

      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');
     

      await AsyncStorage.setItem('SELECTED_SIDE', ''+Side);
      this.state.SelectedSide = await AsyncStorage.getItem('SELECTED_SIDE');
      console.log('Slected Side ----------' + this.state.SelectedSide);

      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {


            console.log('URl ----------' + "http://" + mConsoleIP + "/api/bluetoothcommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 8 + "/" + this.state.SelectedSide + "/" + this.state.longitude + "/" + this.state.latitude + "/" + '\'\'' + "/" + "0");

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
    } catch (error) {
      console.log(error)
      this.props.navigation.goBack(null);
    }
  }


  mHitConsoleToGetStatus(mConsoleIP, vMobileId, cmdId) {

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (mConsoleIP != null && vMobileId != null) {

          console.log('URl ----------' + "http://" + mConsoleIP + "/api/GetCmdId/" + vMobileId +"/" + this.state.longitude + "/" + this.state.latitude + "/");

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

async onFetchLoginRecords_2() {
    try {
      this.setState({
        SlectedActivevMobileId: await AsyncStorage.getItem('SELECTED_VMOBILE_ID'),
      });

      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');
      this.state.SelectedSide = await AsyncStorage.getItem('SELECTED_SIDE');
     
      console.log('Slected Side ----------' + this.state.SelectedSide);
      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {

            console.log('URl ----------' + "http://" + mConsoleIP + "/api/GetBluetooth/" + AppId + "/" + this.state.SlectedActivevMobileId + "/"  +this.state.SelectedSide);

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
          paddingBottom: 5,
          paddingTop: 5,
        }}
      />
    );
  }

  GetFlatListItem() {
  }


  funcToConnectBT(BTAddress) {
    console.log('You tapped Connect the button!');
    var NewBTAddress = BTAddress.split(":").join("_")
    console.log("------------>" + NewBTAddress)
    this.onConnectBT(NewBTAddress);
  }

  async onConnectBT(NewBTAddress) {
    try {
      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');


      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      this.setState({
        isLoading: true,
      });

      //console.log('URl ----------' + "http://" + mConsoleIP + "/api/bluetoothcommand/" + vMobileId + "/" + this.state.SlectedActivevMobileId + "/" + 6 + "/" + this.state.SelectedSide + "/" + this.state.latitude + "/" + this.state.longitude + "/" + NewBTAddress + "/" + "0");
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {
            console.log('URl ----------' + "http://" + mConsoleIP + "/api/bluetoothcommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 6 + "/" + this.state.SelectedSide + "/" + this.state.latitude + "/" + this.state.longitude + "/" + NewBTAddress + "/" + "0");

          } else {
            Toast.show("Please configure App with the Console.")
          }
        } else {
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  funcToDisconnectBT(BTAddress) {
    console.log('You tapped Disconnect the button!');
    var NewBTAddress = BTAddress.split(":").join("_")
    console.log("------------>" + NewBTAddress)
    this.onDisconnectBT(NewBTAddress);
  }

  async onDisconnectBT(NewBTAddress) {
    try {
      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');


      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      this.setState({
        isLoading: true,
      });

      //console.log('URl ----------' + "http://" + mConsoleIP + "/api/bluetoothcommand/" + vMobileId + "/" + this.state.SlectedActivevMobileId + "/" + 7 + "/" + this.state.SelectedSide + "/" + this.state.latitude + "/" + this.state.longitude + "/" + NewBTAddress + "/" + "0");
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {
            console.log('URl ----------' + "http://" + mConsoleIP + "/api/bluetoothcommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 7 + "/" + this.state.SelectedSide + "/" + this.state.latitude + "/" + this.state.longitude + "/" + NewBTAddress + "/" + "0");

          } else {
            Toast.show("Please configure App with the Console.")
          }
        } else {
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  funcToRemoveBT(BTAddress) {
    console.log('You tapped Remove the button!');
    var NewBTAddress = BTAddress.split(":").join("_")
    console.log("------------>" + NewBTAddress)
    this.onRemoveBT(NewBTAddress);
  }

  async onRemoveBT(NewBTAddress) {
    try {
      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');


      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      this.setState({
        isLoading: true,
      });

      //console.log('URl ----------' + "http://" + mConsoleIP + "/api/bluetoothcommand/" + vMobileId + "/" + this.state.SlectedActivevMobileId + "/" + 5 + "/" + this.state.SelectedSide + "/" + this.state.latitude + "/" + this.state.longitude + "/" + NewBTAddress + "/" + "0");
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {
            console.log('URl ----------' + "http://" + mConsoleIP + "/api/bluetoothcommand/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 5 + "/" + this.state.SelectedSide + "/" + this.state.latitude + "/" + this.state.longitude + "/" + NewBTAddress + "/" + "0");

          } else {
            Toast.show("Please configure App with the Console.")
          }
        } else {
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      console.log(error)
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
            Paired Devices
            </Text>

          <TouchableOpacity
            style={styles.button, {
              alignSelf: 'flex-end',
              marginTop: -5, paddingRight: 7,
              position: 'absolute',
            }}><Text style={{ color: "#000" }}></Text>
          </TouchableOpacity>
        </View>

        <FlatList

          data={this.state.PairedDevices}

          ItemSeparatorComponent={this.FlatListItemSeparator}

          renderItem={({ item }) => {
            if (item.StatusId === 2) {
              return <View style={styles.rowcontainer}>
                <View style={styles.rowcontainer}>
                  <Text style={{ color: "black", fontSize: 15 }}>{item.Text}</Text>
                </View>
                <View style={styles.rowcontainer}>
                  
                    <View style={styles.rowcontainer}>

                      <View style={{
                        opacity: 0.5
                      }} >
                        <TouchableOpacity
                          style={styles.button} disabled={true}
                        ><Text style={{ color: "#fff", fontSize: 11 }}>Connect</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                    <View style={styles.rowcontainer}>
                      <TouchableOpacity
                        style={styles.button} 
                        onPress={() => {
                          this.funcToDisconnectBT(item.Value);
                        }} 
                        >
                          <Text style={{ color: "#fff", fontSize: 10 }} >Disconnect</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.rowcontainer}>
                      <TouchableOpacity
                        style={styles.button} 
                        onPress={() => {
                          this.funcToRemoveBT(item.Value);
                        }} 
                        >
                          <Text style={{ color: "#fff", fontSize: 11 }} >Remove</Text>
                      </TouchableOpacity>
                    </View>
                  
                </View>
              </View>
            } else {
              return <View style={styles.rowcontainer}>
                <View style={styles.rowcontainer}>
                  <Text style={{ color: "black", fontSize: 15 }}>{item.Text}</Text>
                </View>
                <View style={styles.rowcontainer}>
                  <View style={styles.rowcontainer}>
                    <View style={styles.rowcontainer}>

                      <TouchableOpacity
                        style={styles.button} 
                          onPress={() => {
                            this.funcToConnectBT(item.Value);
                          }}
                        ><Text style={{ color: "#fff" , fontSize: 11}}>Connect</Text>
                      </TouchableOpacity>

                    </View>
                    <View style={styles.rowcontainer}>
                      <TouchableOpacity
                        style={styles.button} 
                         onPress={() => {
                           this.funcToDisconnectBT(item.Value);
                         }}
                         ><Text style={{ color: "#fff", fontSize: 10 }} >Disconnect</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.rowcontainer}>
                      <TouchableOpacity
                        style={styles.button} 
                         onPress={() => {
                           this.funcToRemoveBT(item.Value);
                         }}
                         ><Text style={{ color: "#fff", fontSize: 11 }} >Remove</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              </View>

            }


          }}

          keyExtractor={(item, index) => index.toString()}

        />


        <View style={styles.tittleContainer}>
          <Text style={styles.titleText}>
            Available Devices
            </Text>

          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginTop: -5, 
              paddingRight: 8,
              position: 'absolute',
              alignItems: 'center',
              backgroundColor: '#ae2222',
              padding: 5,
              textTransform: 'lowercase',
              marginRight: 3,
            }} onPress={() => {
              this.setState({
                isLoading: true,
              });
              this.onFetchLoginRecords_1(this.state.SelectedSide);
            }}><Text style={{ color: "#fff" }}>Scan</Text>
          </TouchableOpacity>
        </View>


        <FlatList

          data={this.state.AvailableDevices}

          ItemSeparatorComponent={this.FlatListItemSeparator}

          renderItem={({ item }) => {
            return <View style={styles.rowcontainer}>
              <View style={styles.rowcontainer}>
                <Text style={{ color: "black", fontSize: 15 }}>{item.Text}</Text>
              </View>
              <View style={styles.rowcontainer}>
                <View style={styles.rowcontainer}>
                  <View style={styles.rowcontainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        this.funcToConnectBT(item.Value);
                      }}
                        ><Text style={{ color: "#fff" , fontSize: 11}}>Connect</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
            </View>

          }}

          keyExtractor={(item, index) => index.toString()}

        />
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
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  rowcontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ae2222',
    padding: 5,
    textTransform: 'lowercase', // Notice this updates the default style
  },

});