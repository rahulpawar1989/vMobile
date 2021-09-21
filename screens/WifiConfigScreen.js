import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator, FlatList, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

//This Screen shows wifi name to which vMobile is connected and also list of saved networks
export default class WifiConfigModuleScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      latitude: '',
      longitude: '',
      availableNetwork: '',
      username: '',
      password: '',
      SlectedActivevMobileId: 0,
      wiFi_UserName: '',
      wiFi_Password: '',
    }
  }

  componentDidMount() {
    this.state.SlectedActivevMobileId = this.props.route.params.SlectedActivevMobileId;
    console.log('Slected Active vMobileId ----------' + this.state.SlectedActivevMobileId);
    this.state.availableNetwork = this.props.route.params.availableNetwork;
    console.log('Scanned Network ----------' + this.state.availableNetwork);

    this.onFetchRecords();
  }

  componentWillUnmount() {

  }

  async onFetchRecords() {
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
        isLoading: false,

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
    this.props.navigation.navigate('WifiConfigurationScreen');
  }

  FunctionToScanWiFI = () => {
    this.onScanWiFi();
  }

  async onScanWiFi() {
    try {
      await AsyncStorage.setItem('reload', "true");
      this.props.navigation.goBack();
    } catch (error) {
      console.log(error)
    }
  }
  FunctionToConnectWiFI = (wiFi_UserName, wiFi_Password) => {
    this.onConnectWiFi(wiFi_UserName, wiFi_Password);
  }

  async onConnectWiFi(wiFi_UserName, wiFi_Password) {

    try {
      await AsyncStorage.setItem('reload', "true");
    } catch (error) {
      console.log(error)
    }

    try {
      this.setState({
        isLoading: true,
      })
      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

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
      Toast.show('Some Error happened. Please try again')
      this.props.navigation.goBack(null);
    }
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
                this.props.navigation.goBack();
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

  FunctionToAddWiFI = (wiFi_UserName, wiFi_Password) => {
    this.onAddWiFi(wiFi_UserName, wiFi_Password);
  }

  async onAddWiFi(wiFi_UserName, wiFi_Password) {
    try {
      await AsyncStorage.setItem('reload', "true");
    } catch (error) {
      console.log(error)
    }
    try {

      this.setState({
        isLoading: true,
      })

      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

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
      Toast.show('Some Error happened. Please try again')
      this.props.navigation.goBack(null);
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
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.titleText}>
                Available Networks
              </Text>
            </View>
            <View style={styles.col2}>
              <View style={styles.scan_button}>
                <Button
                  title="Scan"
                  onPress={() => {
                    console.log('Scan clicked');
                    this.FunctionToScanWiFI();
                  }}
                  color="#ae2222"
                />
              </View>
            </View>
          </View>
        </View>


        <FlatList

          data={this.state.availableNetwork}

          ItemSeparatorComponent={this.FlatListItemSeparator}

          renderItem={({ item }) => <Text style={styles.item}  > {item.Text} </Text>}

          renderItem={({ item, index }) => {

            return <Text style={styles.item} onPress={() => {
              this.setState({
                wiFi_UserName: item.Text,
                wiFi_Password: item.Value,
              });
              console.log('--' + item.Text)
              console.log('---' + item.Value)
            }}
            > {item.Text} </Text>;
          }}

          keyExtractor={(item, index) => index.toString()}

        />

        <View style={styles.tittleContainer}>
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.titleText}>
                Add/Modify/Connect Networks
              </Text>
            </View>
            <View style={styles.col2}>
              <View style={styles.scan_button}>
                <Button
                  title="Clear"
                  onPress={() => {
                    console.log('Clean clicked');
                    this.setState({ wiFi_UserName: '', wiFi_Password: '' })
                  }}
                  color="#ae2222"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.container}>

          <TextInput
            value={this.state.wiFi_UserName}
            onChangeText={(wiFi_UserName) => this.setState({ wiFi_UserName })}
            placeholder="Enter Wi-Fi Name"
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


        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20, }}>
          <View style={styles.button_1}>
            <Button
              title="Back"
              onPress={() => {
                this.props.navigation.goBack(null);

              }}
              color="#ae2222"
            />
          </View>

          <View style={styles.button_1}>
            <Button
              title="Add"
              onPress={() => {
                this.props.navigation.goBack(null);

              }}
              color="#ae2222"
            />
          </View>

          <View style={styles.button_1}>
            <Button
              title="Edit"
              onPress={() => {
                console.log('save clicked');
                this.FunctionToAddWiFI(this.state.wiFi_UserName, this.state.wiFi_Password);
              }}
              color="#ae2222"
            />
          </View>

          <View style={styles.button_1}>
            <Button
              title="Connect"
              onPress={() => {
                console.log('Connect clicked');
                this.FunctionToConnectWiFI(this.state.wiFi_UserName, this.state.wiFi_Password);
              }}
              color="#ae2222"
            />
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  col1: {
    flex: 0.7,
  },
  col2: {
    flex: 0.3,
  },
  text: {
    textAlign: 'right',
  },
  scan_button: {
    width: '80%',
    height: 10,
    alignItems: 'flex-end',
    left: 10,
    position: 'absolute',

  },

  topImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 12,
  },
  button_1: {
    width: '22%',
    height: 30,
    margin: 10,
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
    paddingTop: 10,
    textAlign: 'right',
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

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

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
  button: {
    backgroundColor: 'green',
    width: '40%',
    height: 40
  }
});
