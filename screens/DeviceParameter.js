import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import PopupDialog from 'react-native-popup-dialog';

//This screen is used to show operation, device parameter and global parameter screens
export default class DeviceParameter extends Component {


  constructor(props) {
    super(props);
    this.state = { isHidden: 1 };
    this.onPressOperationScript = this.onPressOperationScript.bind(this);
    this.onPressGP = this.onPressGP.bind(this);
    this.onPressDP = this.onPressDP.bind(this);

    this.state = {
      isLoading: true,
      latitude: '',
      longitude: '',

      Side1DeviceId: '',
      Side1BTName: '',
      Side1ConnectedPhone: '',
      Side1AutoConnect: '',
      Side2DeviceId: '',
      Side2BTName: '',
      Side2ConnectedPhone: '',
      Side2AutoConnect: '',

      ConsoleIp: '',
      CentralSystemIp: '',
      GLListnerIp: '',
      GLListnerDirectory: '',
      GPSParamLang: '',
      GPSParamLat: '',
      SamplingRate: '8000',
      TimezoneParam: '',
      GPSStatus: 0,
      GPSAntenna: '',
      GPSReadInterval: 0,

      disabledGP: false,
      disabledDP: false,
      disabledOS: true,

      DeviceScriptname: '',
      timeZone: 'uk',
      GPSParam: 'vMobileBoard',
      nTimeZone: '',

      backgroundColorOp: '#FFFF00',
      backgroundColorDp: '#ae2222',
      backgroundColorGp: '#ae2222',

      ScriptSide1DeviceId: '',
      ScriptSide2DeviceId: '',
      ScriptSide1DeviceName: '',
      ScriptSide2DeviceName: '',
      ScriptSide1ScriptName: '',
      ScriptSide2ScriptName: '',
      Side1ScriptStaus: '',
      Side2ScriptStaus: '',
      Bluetooth1ScriptStaus: '',
      CheckBox1Staus: false,
      B1ScriptStatus: '',
      Bluetooth2ScriptStaus: '',
      CheckBox2Staus: false,
      B2ScriptStatus: '',
      ChoiceScript1: '',
      ChoiceScript2: '',
      Side1Callnumber: '',
      Side2Callnumber: '',
      Side1CallerId: '',
      Side2CallerId: '',
      Side1SampleRate: '',
      Side2SampleRate: '',

      accountnameMain: [],
    }
  }

  componentDidMount() {
    this.callBoth();
  }

  componentWillUnmount() {

  }

  async callBoth() {
    try {

      this.setState({
        SlectedActivevMobileId: await AsyncStorage.getItem('SELECTED_VMOBILE_ID'),
      });
      console.log('Slected Active vMobileId ----------' + this.state.SlectedActivevMobileId);
      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');


      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      console.log("http://" + mConsoleIP + "/api/GetOperationalData/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/");
      console.log("http://" + mConsoleIP + "/api/getvmobile/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/");

      var request_1_url = "http://" + mConsoleIP + "/api/GetOperationalData/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/";
      var request_2_url = "http://" + mConsoleIP + "/api/getvmobile/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/";


      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {

            fetch(request_1_url).then((response) => response.json())
              .then((responseJson) => {

                this.setState({
                  ScriptSide1DeviceId: responseJson.Device1Id,
                  ScriptSide2DeviceId: responseJson.Device2Id,
                  ScriptSide1DeviceName: responseJson.Bluetooth1Connt,
                  ScriptSide2DeviceName: responseJson.Bluetooth2Connt,
                  ScriptSide1ScriptName: responseJson.Bluetooth1ScriptName,
                  ScriptSide2ScriptName: responseJson.Bluetooth2ScriptName,
                  ChoiceScript1: responseJson.Bluetooth1ScriptName,
                  ChoiceScript2: responseJson.Bluetooth2ScriptName,
                  Bluetooth1ScriptStaus: responseJson.Bluetooth1ScriptStatus,
                  Bluetooth2ScriptStaus: responseJson.Bluetooth2ScriptStatus,
                  Side1SampleRate: responseJson.SamplingRate,
                  Side2SampleRate: responseJson.SamplingRate,
                })


                if (this.state.Bluetooth1ScriptStaus === 0) {
                  console.log('1------>' + this.state.Bluetooth1ScriptStaus)
                  this.setState({ B1ScriptStatus: "Start" })
                  this.setState({ Side1ScriptStaus: "Idle" })
                } else {
                 console.log('2------>' + this.state.Bluetooth1ScriptStaus)
                  this.setState({ B1ScriptStatus: "Stop" })
                  this.setState({ Side1ScriptStaus: "Running" })
                }

                if (this.state.Bluetooth2ScriptStaus === 0) {
                  console.log('3------>' + this.state.Bluetooth2ScriptStaus)
                  this.setState({ B2ScriptStatus: "Start" })
                  this.setState({ Side2ScriptStaus: "Idle" })
                } else {
                  console.log('4------>' + this.state.Bluetooth2ScriptStaus)
                  this.setState({ B2ScriptStatus: "Stop" })
                  this.setState({ Side2ScriptStaus: "Running" })
                }


                global.ListOfScripts = JSON.stringify(responseJson.ScriptList)
                var ScriptDetails = JSON.parse(ListOfScripts);
                global.ScriptNameList = ScriptDetails.map(function (item) {
                  return {
                    label: item.Text,
                    value: item.Text
                  };
                });


                global.ListOfPCM = JSON.stringify(responseJson.VoiceFileList)
                var PCMDetails = JSON.parse(ListOfPCM);
                global.PCMNameList = PCMDetails.map(function (item) {
                  return {
                    label: item.Text,
                    value: item.Text
                  };
                });

                global.ListOfUploadScript = JSON.stringify(responseJson.SrciptVMS)
                var UploadScrpitDetails = JSON.parse(ListOfUploadScript);
                global.UploadScriptNameList = UploadScrpitDetails.map(function (item) {
                  return {
                    label: item.Text,
                    value: item.Text
                  };
                });

                global.ListOfUploadPCM = JSON.stringify(responseJson.SrciptPCM)
                var UploadPCMDetails = JSON.parse(ListOfUploadPCM);
                global.UploadPCMNameList = UploadPCMDetails.map(function (item) {
                  return {
                    label: item.Text,
                    value: item.Text
                  };
                });

                console.log('data------>' + this.state.ScriptSide1DeviceId)
                console.log('data------>' + this.state.ScriptSide2DeviceId)
                console.log('data------>' + this.state.ScriptSide1DeviceName)
                console.log('data------>' + this.state.ScriptSide2DeviceName)
                console.log('data------>' + this.state.ScriptSide1ScriptName)
                console.log('data------>' + this.state.ScriptSide2ScriptName)
                

              }).catch((error) => {
                this.setState({
                  isLoading: false,
                })
                Toast.show("Network request failed." + error)
              })
              .then(() => {
                fetch(request_2_url).then((response) => response.json())
                  .then((responseJson) => {

                    this.setState({
                      isLoading: false,
                      Side1DeviceId: responseJson.Device1Id,
                      Side1BTName: responseJson.Bluetooth1,
                      Side1ConnectedPhone: responseJson.Bluetooth1Connt,
                      Side1AutoConnect: responseJson.Bluetooth1AutoConn,
                      Side2DeviceId: responseJson.Device2Id,
                      Side2BTName: responseJson.Bluetooth2,
                      Side2ConnectedPhone: responseJson.Bluetooth2Connt,
                      Side2AutoConnect: responseJson.Bluetooth2AutoConn,
                      ConsoleIp: responseJson.ConsoleIP,
                      CentralSystemIp: responseJson.CentralIP,
                      GLListnerIp: responseJson.GLLIP,
                      GLListnerDirectory: responseJson.GLLPath,
                      GPSParamLang: responseJson.GPSLng,
                      GPSParamLat: responseJson.GPSLat,
                      GPSParam: responseJson.GPSParameter,
                      GPSStatus: responseJson.GPSStatus,
                      GPSAntenna: responseJson.GPSAntenna,
                      GPSReadInterval: responseJson.GPSReadInterval,
                      nTimeZone: responseJson.TimeZone,
                      SamplingRate: responseJson.SamplingRate,
                      vMobileName: responseJson.VMobileName,
                      tempvMobileName: responseJson.VMobileName,
                    })

                    if (responseJson.DaylightSaving === 0)
                      this.setState({ DaylightSaving: false })
                    else
                      this.setState({ DaylightSaving: true })

                    
                  }).catch((error) => {
                    this.setState({
                      isLoading: false,
                    })
                    Toast.show("Network request failed." + error)
                  }).done();
              }).done();

          } else {
            this.setState({
              isLoading: false,
            })
            Toast.show("Please configure App with the Console.")
          }
        } else {
          this.setState({
            isLoading: false,
          })
          Toast.show('No Internet connectivity')
        }
      });

    } catch (error) {
      this.setState({
        isLoading: false,
      })
      console.log(error)
    }
  }

  navigateToSettings() {
    const navigation = useNavigation();
    navigation.navigate("BluetoothConfigScreen")

  }

  onPressOperationScript() {
    this.setState({ isHidden: 1 })
    this.setState({
      backgroundColorOp: '#FFFF00',
      backgroundColorDp: '#ae2222',
      backgroundColorGp: '#ae2222'
    })
  }

  onPressDP() {
    this.setState({ isHidden: 2 })
    this.setState({
      backgroundColorOp: '#ae2222',
      backgroundColorDp: '#FFFF00',
      backgroundColorGp: '#ae2222'
    })
  }

  onPressGP() {
    this.setState({ isHidden: 3 })
    this.setState({
      backgroundColorOp: '#ae2222',
      backgroundColorDp: '#ae2222',
      backgroundColorGp: '#FFFF00'
    })
  }

  async onSyncReboot() {
    try {

      this.setState({
        isLoading: true,

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
            console.log("http://" + mConsoleIP + "/api/RebootvMobile/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/")
            const response = fetch("http://" + mConsoleIP + "/api/RebootvMobile/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {
                console.log('data------>' + responseJson.Status)
                this.setState({
                  isLoading: false,

                });
                if (responseJson.Status === true) {
                  Toast.show("Submitted Successfully.")
                } else {
                  console.log('------>' + responseJson.Status)
                }



              })
              .catch((error) => {
                console.error(error);
                Toast.show("Network request failed.")

              });
          } else {
            this.setState({
              isLoading: false,
            })
            Toast.show("Please configure App with the Console.")
          }
        } else {
          this.setState({
            isLoading: false,
          })
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  async onSubmitBTDetails_1() {
    try {

      this.setState({
        isLoading: true,

      });

      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      if (this.state.Side1AutoConnect == true)
        var AutoConnect_1 = 1
      else
        var AutoConnect_1 = 0

      if (this.state.Side2AutoConnect == true)
        var AutoConnect_2 = 1
      else
        var AutoConnect_2 = 0

      console.log("------------>" + AutoConnect_1)
      console.log("------------>" + AutoConnect_2)


      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {
            console.log("http://" + mConsoleIP + "/api/SaveConfig/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 25 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + this.state.Side1BTName + "/" + this.state.Side2BTName + "/" + this.state.Side1DeviceId + "/" + this.state.Side2DeviceId + "/" + AutoConnect_1 + "/" + AutoConnect_2 + "/")
            const response = fetch("http://" + mConsoleIP + "/api/SaveConfig/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 25 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + this.state.Side1BTName + "/" + this.state.Side2BTName + "/" + this.state.Side1DeviceId + "/" + this.state.Side2DeviceId + "/" + AutoConnect_1 + "/" + AutoConnect_2 + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {
                

                console.log('data------>' + responseJson.Status)

                if (responseJson.Status === true) {
                  this.myInterval = setInterval(() => this.mHitConsoleToGetStatus(mConsoleIP, this.state.SlectedActivevMobileId, 26), 1000);
                } else {
                  console.log('------>' + responseJson.Status)
                }



              })
              .catch((error) => {
                console.error(error);
                Toast.show("Network request failed.")

              });
          } else {
            this.setState({
              isLoading: false,
            })
            Toast.show("Please configure App with the Console.")
          }
        } else {
          this.setState({
            isLoading: false,
          })
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      })
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
                Toast.show('Submitted Successfully')
                this.setState({
                  isLoading: false,
                });
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

  async onSubmitBTDetails_2() {
    try {

      this.setState({
        isLoading: true,

      });

      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      if (this.state.Side1AutoConnect == true)
        var AutoConnect_1 = 1
      else
        var AutoConnect_1 = 0

      if (this.state.Side2AutoConnect == true)
        var AutoConnect_2 = 1
      else
        var AutoConnect_2 = 0

      console.log("------------>" + AutoConnect_1)
      console.log("------------>" + AutoConnect_2)


      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {
            console.log("http://" + mConsoleIP + "/api/SaveConfig/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 25 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + this.state.Side1BTName + "/" + this.state.Side2BTName + "/" + this.state.Side1DeviceId + "/" + this.state.Side2DeviceId + "/" + AutoConnect_1 + "/" + AutoConnect_2 + "/")
            const response = fetch("http://" + mConsoleIP + "/api/SaveConfig/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 25 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + this.state.Side1BTName + "/" + this.state.Side2BTName + "/" + this.state.Side1DeviceId + "/" + this.state.Side2DeviceId + "/" + AutoConnect_1 + "/" + AutoConnect_2 + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                  isLoading: false,

                });
                Toast.show('Submitted Successfully')
              })
              .catch((error) => {
                console.error(error);
                Toast.show("Network request failed.")

              });
          } else {
            this.setState({
              isLoading: false,
            })
            Toast.show("Please configure App with the Console.")
          }
        } else {
          this.setState({
            isLoading: false,
          })
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }


  async onSubmitGlobalParamDetails() {
    try {

      this.setState({
        isLoading: true,

      });

      console.log('You tapped Submit the button!');

      var ConsoleIp_1 = this.state.ConsoleIp.split(":").join("_")
      console.log("------------>" + ConsoleIp_1)

      var CentralSystemIp_1 = this.state.CentralSystemIp.split(":").join("_")
      console.log("------------>" + CentralSystemIp_1)

      var GLListnerIp_1 = this.state.GLListnerIp.split(":").join("_")
      console.log("------------>" + GLListnerIp_1)

      var GLListnerDirectory_1 = this.state.GLListnerDirectory.split(":").join("_")
      var GLListnerDirectory_2 = GLListnerDirectory_1.split("\\").join("=")
      console.log("------------>" + GLListnerDirectory_2)

      var GPSParam_1 = this.state.GPSParam.split(" ").join("")
      console.log("------------>" + GPSParam_1)

      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

      var mDaylightSaving
      if (this.state.DaylightSaving === false)
        mDaylightSaving = 0
      else
        mDaylightSaving = 1

      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);


      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (mConsoleIP != null && AppId != null) {
            // http://182.156.236.157:8099/api/WiFiConfig/{appid}/{vmobileId}/{commandId}/{lat}/{lng}/{ConsoleIP}/{CentralIP}/{GLLIP}/{GLLPath}/{GPSParameter}/{SamplingRate}/{TimeZone}/{GPSAntenna}/{GPSReadInterval}
            console.log("http://" + mConsoleIP + "/api/WiFiConfig/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 10 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + ConsoleIp_1 + "/" + CentralSystemIp_1 + "/" + GLListnerIp_1 + "/" + GLListnerDirectory_2 + "/" + GPSParam_1 + "/" + this.state.SamplingRate + "/" + this.state.nTimeZone + "/" + this.state.GPSAntenna + "/" + this.state.GPSReadInterval + "/" + this.state.vMobileName + "/" + "''" + "/" + mDaylightSaving + "/")
            const response = fetch("http://" + mConsoleIP + "/api/WiFiConfig/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + 10 + "/" + this.state.latitude + "/" + this.state.longitude + "/" + ConsoleIp_1 + "/" + CentralSystemIp_1 + "/" + GLListnerIp_1 + "/" + GLListnerDirectory_2 + "/" + GPSParam_1 + "/" + this.state.SamplingRate + "/" + this.state.nTimeZone + "/" + this.state.GPSAntenna + "/" + this.state.GPSReadInterval + "/" + this.state.vMobileName + "/" + "''" + "/" + mDaylightSaving + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {
                console.log(responseJson);

                console.log('data------>' + responseJson.Status)

                if (responseJson.Status === true) {
                  this.myInterval = setInterval(() => this.mHitConsoleToGetStatus_2(mConsoleIP, this.state.SlectedActivevMobileId, 27), 1000);
                } else {
                  console.log('------>' + responseJson.Status)
                }


              })
              .catch((error) => {
                console.error(error);
                Toast.show("Network request failed.")

              });
          } else {
            this.setState({
              isLoading: false,
            })
            Toast.show("Please configure App with the Console.")
          }
        } else {
          this.setState({
            isLoading: false,
          })
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  mHitConsoleToGetStatus_2(mConsoleIP, vMobileId, cmdId) {

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
                this.setState({
                  isLoading: false,
                });
                Toast.show('Submitted Successfully')
                if (this.state.tempvMobileName != this.state.vMobileName) {
                  this.popupDialog.show();
                }
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


  async onSubmitScriptDetails() {
    try {

      

      var Script1OptId = '', Script2OptId = ''

      console.log(this.state.B1ScriptStatus)
      console.log(this.state.CheckBox1Staus)
      console.log(this.state.B2ScriptStatus)
      console.log(this.state.CheckBox2Staus)


      if (this.state.B1ScriptStatus === "Start" && this.state.CheckBox1Staus === true) {
        Script1OptId = 1
      }

      if (this.state.B1ScriptStatus === "Start" && this.state.CheckBox1Staus === false) {
        Script1OptId = ''
      }

      if (this.state.B1ScriptStatus === "Stop" && this.state.CheckBox1Staus === true) {
        Script1OptId = 2
      }

      if (this.state.B1ScriptStatus === "Stop" && this.state.CheckBox1Staus === false) {
        Script1OptId = ''
      }

      if (this.state.B2ScriptStatus === "Start" && this.state.CheckBox2Staus === true) {
        Script2OptId = 1
      }

      if (this.state.B2ScriptStatus === "Start" && this.state.CheckBox2Staus === false) {
        Script2OptId = ''
      }

      if (this.state.B2ScriptStatus === "Stop" && this.state.CheckBox2Staus === true) {
        Script2OptId = 2
      }

      if (this.state.B2ScriptStatus === "Stop" && this.state.CheckBox2Staus === false) {
        Script2OptId = ''
      }

      const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
      const AppId = await AsyncStorage.getItem('APP_ID');
      this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
      this.state.longitude = await AsyncStorage.getItem('LONGITUDE');

      console.log('Console ip: ' + mConsoleIP);
      console.log('AppId: ' + AppId);
      console.log('GPSLat: ' + this.state.latitude);
      console.log('GPSLng: ' + this.state.longitude);

      //"api/OperationalConfig/{appid}/{vmobileId}/{lat}/{lng}/{Bluetooth1ScriptName}/{Bluetooth2ScriptName}/{Script1OptId}/{Script2OptId}/{Bluetooth1PlaceCall}/{Bluetooth1CallId}/{Bluetooth1SampleRate}/{Bluetooth2PlaceCall}/{Bluetooth2CallId}/{Bluetooth2SampleRate}/{ScriptName}"

      NetInfo.fetch().then(state => {
        if (state.isConnected) {

          if (mConsoleIP != null && AppId != null) {

            var Side1Script1, Side2Script2
            if (this.state.ChoiceScript1 === '') {
              Side1Script1 = "''"
            } else {
              Side1Script1 = this.state.ChoiceScript1
            }

            if (this.state.ChoiceScript2 === '') {
              Side2Script2 = "''"
            } else {
              Side2Script2 = this.state.ChoiceScript2
            }

            if (Script1OptId === '') {
              Script1OptId = "''"
            }

            if (Script2OptId === '') {
              Script2OptId = "''"
            }

            if (this.state.Side1Callnumber === '') {
              this.state.Side1Callnumber = "''"
            }

            if (this.state.Side1CallerId === '') {
              this.state.Side1CallerId = "''"
            }

            if (this.state.Side2Callnumber === '') {
              this.state.Side2Callnumber = "''"
            }

            if (this.state.Side2CallerId === '') {
              this.state.Side2CallerId = "''"
            }

            if (Side1Script1 === "''" && Side2Script2 ===  "''" ) {
               
                Toast.show("Please select a script.")
               }
              
              else{ 
                 this.setState({
              isLoading: true,
            })

              console.log("http://" + mConsoleIP + "/api/OperationalConfig/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/" + Side1Script1 + "/" + Side2Script2 + "/" + Script1OptId + "/" + Script2OptId + "/" + this.state.Side1Callnumber + "/" + this.state.Side1CallerId + "/" + this.state.Side1SampleRate + "/" + this.state.Side2Callnumber + "/" + this.state.Side2CallerId + "/" + this.state.Side2SampleRate + "/" + "''" + "/")
              const response = fetch("http://" + mConsoleIP + "/api/OperationalConfig/" + AppId + "/" + this.state.SlectedActivevMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/" + Side1Script1 + "/" + Side2Script2 + "/" + Script1OptId + "/" + Script2OptId + "/" + this.state.Side1Callnumber + "/" + this.state.Side1CallerId + "/" + this.state.Side1SampleRate + "/" + this.state.Side2Callnumber + "/" + this.state.Side2CallerId + "/" + this.state.Side2SampleRate + "/" + "''" + "/", {
                method: 'GET'
              })
                .then((response) => response.json())
                .then((responseJson) => {

                  console.log('hit------>' + responseJson)

                  

                  if (responseJson.Status === true) {
                    Toast.show("Submitted Successfully.")

                    const that = this;
                    setTimeout(() => {
                      this.setState({
                        CheckBox1Staus: false,
                        CheckBox2Staus: false,
                        Side1Callnumber: '',
                        Side1CallerId: '',
                        Side2Callnumber: '',
                        Side2CallerId: '',
                      });
                      this.callBoth();
                    }, 10000);
                  } else {
                    console.log('------>' + responseJson.Status)
                    Toast.show("Some problem occured while Submitting .")
                  }
                })
                .catch((error) => {
                  console.log(error);
                  Toast.show("Network request failed.")
                  this.props.navigation.goBack(null);
                });
            }
          } else {
            this.setState({
              isLoading: false,
            })
            Toast.show("Please configure App with the Console.")
          }
        } else {
          this.setState({
            isLoading: false,
          })
          Toast.show('No Internet connectivity')
        }
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }


  render() {


    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
          <Text style={styles.item, { textAlign: 'center', }}>
            Fetching information from Console, Please wait...
          </Text>
        </View>
      );
    }
    return (

      <View style={styles.MainContainer}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ alignSelf: 'stretch', backgroundColor: this.state.backgroundColorOp }} onPress={this.onPressOperationScript}>
              <Text style={{
                alignSelf: 'center',
                color: '#000000',
                fontSize: 16,
                fontWeight: '600',
                paddingTop: 10,
                paddingBottom: 10
              }}>Operation</Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderLeftWidth: 1, borderLeftColor: 'white' }} />
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ alignSelf: 'stretch', backgroundColor: this.state.backgroundColorDp }} onPress={this.onPressDP}>
              <Text style={{
                alignSelf: 'center',
                color: '#000000',
                fontSize: 16,
                fontWeight: '600',
                paddingTop: 10,
                paddingBottom: 10
              }}>Device Param</Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderLeftWidth: 1, borderLeftColor: 'white' }} />
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ alignSelf: 'stretch', backgroundColor: this.state.backgroundColorGp }} onPress={this.onPressGP}>
              <Text style={{
                alignSelf: 'center',
                color: '#000000',
                fontSize: 16,
                fontWeight: '600',
                paddingTop: 10,
                paddingBottom: 10
              }}>Global Param</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container}>
          {
            (this.state.isHidden == 3) ?
              <View style={styles.backgroundContainer}>


                <View style={{
                  flexDirection: 'row', justifyContent: "space-evenly", marginTop: 8, marginBottom: 8,
                }}>
                  <View style={styles.button_1}>

                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ alignSelf: 'stretch', backgroundColor: '#ae2222' }} onPress={() => {
                      this.popupDialogReboot.show();
                    }} >
                      <Text style={{
                        alignSelf: 'center',
                        color: '#ffffff',
                        fontSize: 16,
                        fontWeight: '600',
                        paddingTop: 10,
                        paddingBottom: 10
                      }}>Reboot vMobile</Text>
                    </TouchableOpacity>
                  </View>

                  <PopupDialog
                    ref={popupDialogReboot => {
                      this.popupDialogReboot = popupDialogReboot;
                    }}
                    dialogStyle={{
                      backgroundColor: '#fff',
                      height: 120,
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
                          Are you sure, you want to reboot ?
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', height: '40%' }}>

                      </View>
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={styles.button_1}>
                          <Button
                            title="Ok"
                            onPress={() => {
                              this.popupDialogReboot.dismiss();
                              this.onSyncReboot()

                            }}
                            color="#ae2222"
                          />
                        </View>
                        <View style={styles.button_1}>

                        </View>
                        <View style={styles.button_1}>
                          <Button
                            title="Cancel"
                            onPress={() => {
                              this.popupDialogReboot.dismiss();
                            }}
                            color="#ae2222"
                          />
                        </View>
                      </View>
                    </View>
                  </PopupDialog>

                  <View style={styles.button_1}>

                  </View>

                </View>
                <ScrollView persistentScrollbar={true} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, }}>
                  <View style={styles.tablecontainer}>
                    <View style={styles.tableitem2}>

                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >Console IP</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >Central System IP</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >GL Listner IP</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >GL Listner Directory</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >GPS Parameters</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >Defult Sampling Rate</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >Daylight Saving</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >Timezone Parameter</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >GPS Read Interval</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >GPS Antenna</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >GPS Status</TextInput>
                      <TextInput style={styles.text5} editable={false} selectTextOnFocus={false} multiline={true}
                      >vMobile Name</TextInput>

                    </View>
                    <View style={styles.tableitem1}>

                      <TextInput style={styles.text3} multiline={true}
                        onChangeText={ConsoleIp => this.setState({ ConsoleIp })}>{this.state.ConsoleIp}</TextInput>
                      <TextInput style={styles.text3} multiline={true}
                        onChangeText={CentralSystemIp => this.setState({ CentralSystemIp })}>{this.state.CentralSystemIp}</TextInput>
                      <TextInput style={styles.text3} multiline={true}
                        onChangeText={GLListnerIp => this.setState({ GLListnerIp })}>{this.state.GLListnerIp}</TextInput>
                      <TextInput style={styles.text3} multiline={true}
                        onChangeText={GLListnerDirectory => this.setState({ GLListnerDirectory })}>{this.state.GLListnerDirectory}</TextInput>
                      <DropDownPicker
                        canTouchOutside={true}
                        scrollViewProps={{
                          persistentScrollbar: true
                        }}
                        items={[
                          { label: 'VMobile Board', value: 'VMobileBoard', hidden: true },
                          { label: 'UTA Board', value: 'UTABoard' },
                        ]}
                        defaultValue={this.state.GPSParam}
                        containerStyle={{ width: 190, height: 50, margin: 5 }}
                        style={{ backgroundColor: '#D3D3D3' }}
                        itemStyle={{
                          justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#FFFF00' }}
                        onChangeItem={item => this.setState({
                          GPSParam: item.value
                        })}
                      />

                      <DropDownPicker
                        scrollViewProps={{
                          persistentScrollbar: true
                        }}
                        items={[
                          { label: '8000', value: '8000', hidden: true },
                          { label: '16000', value: '16000' },
                          { label: '48000', value: '48000' },
                        ]}
                        defaultValue={this.state.SamplingRate}
                        containerStyle={{ width: 190, height: 50, margin: 5 }}
                        style={{ backgroundColor: '#D3D3D3' }}
                        itemStyle={{
                          justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#FFFF00' }}
                        onChangeItem={item => this.setState({
                          SamplingRate: item.value
                        })}
                      />

                      <CheckBox
                        disabled={false}
                        value={this.state.DaylightSaving}
                        onValueChange={
                          (DaylightSaving) =>
                            this.setState({
                              DaylightSaving
                            })
                        }
                      />
                      <Text style={{ height: "2.5%" }}></Text>
                      <DropDownPicker
                        scrollViewProps={{
                          persistentScrollbar: true
                        }}
                        items={[
                          { label: 'GMT - Greenwich Mean Time', value: 'GMT' },
                          { label: 'UTC - Universal Coordinated Time', value: 'UTC', hidden: true },
                          { label: 'EST - Eastern Standard Time', value: 'EST' },
                          { label: 'CST - Central Standard Time', value: 'CST' },
                          { label: 'ECT - European Central Time', value: 'ECT' },
                          { label: 'EET - Eastern European Time', value: 'EET' },
                          { label: 'MET - Middle East Time', value: 'MET' },
                          { label: 'IST - India Standard Time', value: 'IST' },
                          { label: 'PST - Pacific Standard Time', value: 'PST' },
                          { label: 'ART - (Arabic)Egypt Standard Time', value: 'ART' },
                          { label: 'MST - US Mountain Standard Time', value: 'MST' },
                        ]}
                        defaultValue={this.state.nTimeZone}
                        containerStyle={{ width: 190, height: 50, margin: 5 }}
                        style={{ backgroundColor: '#D3D3D3' }}
                        itemStyle={{
                          justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#FFFF00' }}
                        onChangeItem={item => this.setState({
                          nTimeZone: item.value
                        })}
                      />
                      <DropDownPicker
                        scrollViewProps={{
                          persistentScrollbar: true
                        }}
                        items={[
                          { label: '0', value: '0', hidden: true },
                          { label: '1', value: '1' },
                        ]}
                        defaultValue={this.state.GPSReadInterval}
                        containerStyle={{ width: 190, height: 50, margin: 5 }}
                        style={{ backgroundColor: '#D3D3D3' }}
                        itemStyle={{
                          justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#FFFF00' }}
                        onChangeItem={item => this.setState({
                          GPSReadInterval: item.value
                        })}
                      />
                      <DropDownPicker
                        scrollViewProps={{
                          persistentScrollbar: true
                        }}
                        items={[
                          { label: 'Internal', value: '0', hidden: true },
                          { label: 'External', value: '1' },
                        ]}
                        defaultValue={this.state.GPSAntenna}
                        containerStyle={{ width: 190, height: 50, margin: 5 }}
                        style={{ backgroundColor: '#D3D3D3' }}
                        itemStyle={{
                          justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#FFFF00' }}
                        onChangeItem={item => this.setState({
                          GPSAntenna: item.value
                        })}
                      />
                      <TextInput style={styles.text3} editable={false} selectTextOnFocus={false} multiline={true}
                      >{this.state.GPSParamLang} , {this.state.GPSParamLat} {(this.state.GPSStatus == 1) ? <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'normal' }}>
                        Connected
                      </Text> : <Text style={{ color: 'grey', fontSize: 14, fontWeight: 'normal' }}>
                        Connecting
                      </Text>}</TextInput>
                      <TextInput style={styles.text3} multiline={true}
                        onChangeText={vMobileName => this.setState({ vMobileName })}>{this.state.vMobileName}</TextInput>

                    </View>
                  </View>
                </ScrollView>
                <View style={{
                  flexDirection: 'row', justifyContent: "space-evenly", marginBottom: 15
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
                      title="Submit"
                      color="#ae2222"
                      onPress={this.onSubmitGlobalParamDetails.bind(this)}
                    />
                  </View>
                  <View style={styles.button_1}>
                    <Button
                      title="WiFi Param"
                      color="#ae2222"
                      onPress={() => {
                        this.props.navigation.navigate('WifiScreen');
                      }}
                    />
                  </View>

                </View>
                <PopupDialog
                  ref={popupDialog => {
                    this.popupDialog = popupDialog;
                  }}
                  dialogStyle={{
                    backgroundColor: '#fff',
                    height: 120,
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
                        Please reboot to see changed vMobile name.
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', height: '40%' }}>

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={styles.button_1}>

                      </View>
                      <View style={styles.button_1}>
                        <Button
                          title="Ok"
                          onPress={() => {
                            this.popupDialog.dismiss();
                          }}
                          color="#ae2222"
                        />
                      </View>

                      <View style={styles.button_1}>

                      </View>
                    </View>

                  </View>
                </PopupDialog>
              </View>
              :
              (this.state.isHidden == 2) ? <View style={styles.overlay}>

                <View style={styles.tablecontainer}>
                  <View style={styles.tableitem}>
                    <Text style={styles.text2}>      </Text>

                    <TextInput style={styles.text4} editable={false} selectTextOnFocus={false}  >Device ID</TextInput>
                    <TextInput style={styles.text4} editable={false} selectTextOnFocus={false} ></TextInput>
                    <TextInput style={styles.text4} editable={false} selectTextOnFocus={false} >BT Name</TextInput>
                    <TextInput style={styles.text4} editable={false} selectTextOnFocus={false} ></TextInput>
                    <TextInput style={styles.text4} editable={false} selectTextOnFocus={false} >Connected Phone</TextInput>
                    <TextInput style={styles.text4} editable={false} selectTextOnFocus={false} ></TextInput>
                    <TextInput style={styles.text4} editable={false} selectTextOnFocus={false} >Auto Reconnect</TextInput>
                  </View>
                  <View style={styles.tableitem}>
                    <Text style={styles.text4}>Side 1</Text>
                    <TextInput style={styles.text3} onChangeText={Side1DeviceId => this.setState({ Side1DeviceId })} >{this.state.Side1DeviceId}</TextInput>
                    <TextInput style={styles.text4}  ></TextInput>
                    <TextInput style={styles.text3} onChangeText={Side1BTName => this.setState({ Side1BTName })} >{this.state.Side1BTName}</TextInput>
                    <TextInput style={styles.text4}  ></TextInput>
                    <Text style={styles.text13}  >{this.state.Side1ConnectedPhone}</Text>
                    <TextInput style={styles.text4}  ></TextInput>
                    <CheckBox
                      disabled={false}
                      value={this.state.Side1AutoConnect}
                      onValueChange={
                        (Side1AutoConnect) =>
                          this.setState({
                            Side1AutoConnect
                          })
                      }
                    />
                    <View style={[{ width: "85%", height: 40, alignSelf: "center", marginTop: 30 }]}>
                      <Button
                        onPress={() => {
                          this.props.navigation.navigate('BluetoothConfigScreen', { Side: 1 });
                          console.log('Config 1 clicked');
                        }}
                        title="Config 1"
                        color="#ae2222"
                      />

                    </View>
                  </View>
                  <View style={styles.tableitem}>
                    <Text style={styles.text4}>Side 2</Text>
                    <TextInput style={styles.text3} onChangeText={Side2DeviceId => this.setState({ Side2DeviceId })} >{this.state.Side2DeviceId}</TextInput>
                    <TextInput style={styles.text4}  ></TextInput>
                    <TextInput style={styles.text3} onChangeText={Side2BTName => this.setState({ Side2BTName })} >{this.state.Side2BTName}</TextInput>
                    <TextInput style={styles.text4}  ></TextInput>
                    <Text style={styles.text13}  >{this.state.Side2ConnectedPhone}</Text>
                    <TextInput style={styles.text4}  ></TextInput>
                    <CheckBox
                      disabled={false}
                      value={this.state.Side2AutoConnect}
                      onValueChange={(Side2AutoConnect) =>
                        this.setState({
                          Side2AutoConnect
                        })
                      }
                    />
                    <View style={[{ width: "85%", height: 40, alignSelf: "center", marginTop: 30 }]}>
                      <Button
                        onPress={() => {
                          console.log('Config 2 clicked');
                          this.props.navigation.navigate('BluetoothConfigScreen', { Side: 2 });
                        }}
                        title="Config 2"
                        color="#ae2222"
                      />
                    </View>
                  </View>
                </View>

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
                  <View style={[{ width: "30%", height: 40, marginLeft: 40 }]}>
                    <Button
                      onPress={this.onSubmitBTDetails_1.bind(this)}
                      title="Submit"
                      color="#ae2222"
                    />
                  </View>
                </View>

              </View>

                : <View style={styles.topoverlay}>

                  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View>
                      <View style={[{
                        width: "100%",
                        backgroundColor: '#ae2222',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 40,
                        paddingBottom: 10,
                        marginTop: 10,
                      }]}>
                        <View style={{ flexDirection: "row" }}>

                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 18, color: '#ffffff', marginLeft: 10, fontWeight: 'bold', paddingTop: 10, textAlign: 'left' }]}>
                              Side 1
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={[{
                        width: "100%",
                        backgroundColor: '#d3d3d3',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 80,
                        paddingBottom: 10,
                      }]}>
                        <View style={{ flex: 1, flexDirection: "row" }}>

                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 18, color: '#0D004C', fontWeight: 'normal', paddingTop: 10, marginLeft: 10, }]}>
                              {this.state.ScriptSide1DeviceId + " - ( " + this.state.ScriptSide1DeviceName + " )"}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>

                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 18, color: '#0D004C', fontWeight: 'normal', paddingTop: 10, marginLeft: 10, }]}>
                              {this.state.ScriptSide1ScriptName + " / "}
                              <Text style={[(this.state.Side1ScriptStaus == "Idle" ? null : styles.inputHighlight)]}>
                                {this.state.Side1ScriptStaus}
                              </Text>
                            </Text>
                          </View>
                        </View>

                      </View>
                      <View style={{ flexDirection: "row", marginTop: 10, }}>
                        <View style={{ flex: 1 }}>
                          <Text style={[{ fontSize: 15, color: '#0D004C', marginLeft: 10, fontWeight: 'normal', paddingTop: 10, textAlign: 'left' }]}>
                            vMobile Script
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[{ fontSize: 15, color: '#0D004C', marginRight: 80, fontWeight: 'normal', paddingTop: 10, textAlign: 'left', alignSelf: 'flex-end' }]}>
                            Operation
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, }}>

                          <DropDownPicker
                            placeholder="Select a script"
                            scrollViewProps={{
                              persistentScrollbar: true
                            }}
                            items={global.ScriptNameList}
                            containerStyle={{ width: 190, height: 50, margin: 5 }}
                            style={{ backgroundColor: '#D3D3D3' }}
                            itemStyle={{
                              justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{ backgroundColor: '#FFFF00' }}
                            onChangeItem={item => this.setState({
                              ChoiceScript1: item.value
                            })}
                          />
                        </View>
                        <View style={{ flex: 1 }}>

                        </View>
                        <View style={{ flex: 1, alignSelf: 'center' }}>
                          <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1 }}>

                              <CheckBox
                                disabled={false}
                                value={this.state.CheckBox1Staus}
                                onValueChange={(CheckBox1Staus) =>
                                  this.setState({
                                    CheckBox1Staus
                                  })
                                }
                              />
                              <Text style={[{ fontSize: 15, color: this.state.Bluetooth1ScriptStaus == "1" ? 'red' : 'green', fontWeight: 'normal', textAlign: 'left' }]}>
                                {this.state.B1ScriptStatus}
                              </Text>

                            </View>

                          </View>

                        </View>
                      </View>

                      <View >

                        <View style={{ flexDirection: "row", marginTop: 10, }}>
                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 15, color: '#0D004C', marginLeft: 10, fontWeight: 'normal', paddingTop: 10, textAlign: 'left' }]}>
                              Start Variables:
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 15, color: '#0D004C', marginRight: 10, fontWeight: 'normal', paddingTop: 10, textAlign: 'left', alignSelf: 'flex-end' }]}>
                              Sampling Rate
                            </Text>
                          </View>
                        </View>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          height: 50,
                          marginLeft: 2,
                        }}>
                          <View style={styles.inputWrap}>
                            <TextInput style={styles.inputCvv} placeholder=" Enter Number" onChangeText={Side1Callnumber => this.setState({ Side1Callnumber })}>{this.state.Side1Callnumber}
                            </TextInput>
                          </View>

                          <View style={styles.inputWrap}>
                            <TextInput style={styles.inputCvv} placeholder=" Caller Id" onChangeText={Side1CallerId => this.setState({ Side1CallerId })}>{this.state.Side1CallerId}
                            </TextInput>
                          </View>

                          <View style={styles.inputWrap}>
                            <Text style={[{ flex: 1, backgroundColor: '#D3D3D3', fontSize: 15, color: '#0D004C', marginRight: 1, fontWeight: 'normal', paddingTop: 10, textAlign: 'center', }]}>
                              {this.state.Side1SampleRate}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={[{
                        width: "100%",
                        backgroundColor: '#ae2222',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 40,
                        paddingBottom: 10,
                        marginTop: 10,
                      }]}>
                        <View style={{ flexDirection: "row" }}>

                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 18, color: '#ffffff', marginLeft: 10, fontWeight: 'bold', paddingTop: 10, textAlign: 'left' }]}>
                              Side 2
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={[{
                        width: "100%",
                        backgroundColor: '#d3d3d3',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 80,
                        paddingBottom: 10,
                      }]}>
                        <View style={{ flex: 1, flexDirection: "row" }}>

                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 18, color: '#0D004C', fontWeight: 'normal', paddingTop: 10, marginLeft: 10, }]}>
                              {this.state.ScriptSide2DeviceId + " - ( " + this.state.ScriptSide2DeviceName + " )"}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>

                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 18, color: '#0D004C', fontWeight: 'normal', paddingTop: 10, marginLeft: 10, }]}>
                              {this.state.ScriptSide2ScriptName + " / "}

                              <Text style={[(this.state.Side2ScriptStaus == "Idle" ? null : styles.inputHighlight)]}>
                                {this.state.Side2ScriptStaus}
                              </Text>

                            </Text>
                          </View>
                        </View>

                      </View>
                      <View style={{ flexDirection: "row", marginTop: 10, }}>
                        <View style={{ flex: 1 }}>
                          <Text style={[{ fontSize: 15, color: '#0D004C', marginLeft: 10, fontWeight: 'normal', paddingTop: 10, textAlign: 'left' }]}>
                            vMobile Script
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[{ fontSize: 15, color: '#0D004C', marginRight: 80, fontWeight: 'normal', paddingTop: 10, textAlign: 'left', alignSelf: 'flex-end' }]}>
                            Operation
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>

                          <DropDownPicker
                            placeholder="Select a script"
                            scrollViewProps={{
                              persistentScrollbar: true
                            }}
                            items={global.ScriptNameList}
                            containerStyle={{ width: 190, height: 50, margin: 5 }}
                            style={{ backgroundColor: '#D3D3D3' }}
                            itemStyle={{
                              justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{ backgroundColor: '#FFFF00' }}
                            onChangeItem={item => this.setState({
                              ChoiceScript2: item.value
                            })}
                          />
                        </View>
                        <View style={{ flex: 1 }}>

                        </View>
                        <View style={{ flex: 1, alignSelf: 'center' }}>
                          <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1 }}>

                              <CheckBox
                                disabled={false}
                                value={this.state.CheckBox2Staus}
                                onValueChange={(CheckBox2Staus) =>
                                  this.setState({
                                    CheckBox2Staus
                                  })
                                }

                              />
                              <Text style={[{ fontSize: 15, color: this.state.Bluetooth2ScriptStaus == "1" ? 'red' : 'green', fontWeight: 'normal', textAlign: 'left' }]}>
                                {this.state.B2ScriptStatus}
                              </Text>

                            </View>

                          </View>

                        </View>
                      </View>

                      <View >

                        <View style={{ flexDirection: "row", marginTop: 10, }}>
                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 15, color: '#0D004C', marginLeft: 10, fontWeight: 'normal', paddingTop: 10, textAlign: 'left' }]}>
                              Start Variables:
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[{ fontSize: 15, color: '#0D004C', marginRight: 10, fontWeight: 'normal', paddingTop: 10, textAlign: 'left', alignSelf: 'flex-end' }]}>
                              Sampling Rate
                            </Text>
                          </View>
                        </View>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          height: 50,
                          marginLeft: 2,
                        }}>
                          <View style={styles.inputWrap}>
                            <TextInput style={styles.inputCvv} placeholder=" Enter Number" onChangeText={Side2Callnumber => this.setState({ Side2Callnumber })}>{this.state.Side2Callnumber}
                            </TextInput>
                          </View>

                          <View style={styles.inputWrap}>
                            <TextInput style={styles.inputCvv} placeholder=" Caller Id" onChangeText={Side2CallerId => this.setState({ Side2CallerId })}>{this.state.Side2CallerId}
                            </TextInput>
                          </View>

                          <View style={styles.inputWrap}>
                            <Text style={[{ flex: 1, backgroundColor: '#D3D3D3', fontSize: 15, color: '#0D004C', marginRight: 1, fontWeight: 'normal', paddingTop: 10, textAlign: 'center', }]}>
                              {this.state.Side2SampleRate}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                  <View style={{
                    flexDirection: 'row', justifyContent: "space-evenly", position: 'absolute',
                    bottom: 10,
                    right: 10,
                    left: 10,
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
                        title="Submit"
                        color="#ae2222"
                        onPress={this.onSubmitScriptDetails.bind(this)}
                      />
                    </View>
                    
                  </View>

                </View>

          }
        </View>
      </View>

    )
  }
}
DeviceParameter.navigationOptions = {
  tabBarIcon: ({ tintColor, focused }) => (
    <Icon
      name={focused ? 'ios-settings' : 'md-settings'}
      color={tintColor}
      size={25}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F1EDE9'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F1EDE9'
  },
  topoverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F1EDE9'
  },
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  inputHighlight: {
    color: 'blue'
  },
  label: {
    flex: 1,
    fontWeight: 'bold'
  },
  inputWrap: {
    margin: 2,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column'
  },

  inputCvv: {
    flex: 1,
    backgroundColor: '#D3D3D3',

  },

  topImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 12,
  },
  tittleContainer: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10
  },
  text2: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
    margin: 5,
  },
  text3: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
    backgroundColor: "#D3D3D3",
    textAlign: "center",
    alignSelf: "center",
    margin: 5,
    width: "92%"
  },
  text5: {
    color: "black",
    fontSize: 13,
    textAlign: "center",
    alignSelf: "center",
    margin: 5,
    width: "90%",
  },
  text13: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#D3D3D3",
    textAlign: "center",
    margin: 5,
    width: "90%",
    height: "8%",
    alignItems: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center'
  },
  text4: {
    color: "black",
    fontSize: 13,
    textAlign: "center",
    textAlign: "center",
    alignSelf: "center",
    margin: 5,
    width: "90%"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold',
    color: "#ae2222"
  },
  tablecontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  tableitem: {
    width: '33%' // is 50% of container width
  },
  tableitem1: {
    width: '49%' // is 50% of container width
  },
  tableitem2: {
    width: '45%' // is 50% of container width
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ae2222',
    padding: 5,
    textTransform: 'lowercase', // Notice this updates the default style
  },
  button_1: {
    width: '30%',
    height: 30,
  },
});