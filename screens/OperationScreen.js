import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, FlatList, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

//This screen is used to show list of vMobile to operate
export default class OperationModuleScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      latitude: '',
      longitude: '',
    }
  }

  FunctionToOpenChooseOperationModuleScreenScreen = (vMobileID) => {
    this.SaveSelectedvMobileID(vMobileID);

  }

  async SaveSelectedvMobileID(vMobileID) {
    console.log("---->" + vMobileID)
    try {
      await AsyncStorage.setItem('SELECTED_VMOBILE_ID', "" + vMobileID);
      this.props.navigation.navigate('DeviceParameter');
    } catch (error) {
      console.log(error)
    }
  }
  componentDidMount() {
    this.onFetchLoginRecords();
  }

  async onFetchLoginRecords() {
    try {
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
            //url = "http://" + IPAdd + "/api/getactivevmobiles/" + AppIdString + "/" + GPSLat + "/" + GPSLng + "/"; 
            console.log("http://" + mConsoleIP + "/api/getactivevmobiles/" + AppId + "/" + this.state.latitude + "/" + this.state.longitude + "/");
            const response = fetch("http://" + mConsoleIP + "/api/getactivevmobiles/" + AppId + "/" + this.state.latitude + "/" + this.state.longitude + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson != null) {
                  this.setState({
                    isLoading: false,
                  });
                  if (responseJson.Error === "No Records Found.") {
                    Toast.show("No vMobile's are Connected to Console.")
                  } else {
                    this.setState({
                      isLoading: false,
                      dataSource: responseJson
                    });
                  }
                }
              })
              .catch((error) => {
                console.error(error);
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

    console.log(vMobileID)
    this.FunctionToOpenChooseOperationModuleScreenScreen(vMobileID);

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

        <View style={styles.topImageContainer}>
          <Image
            source={require('./img/gl_logo.png')}
            style={{ width: "100%", height: 25 }}
          />
        </View>

        <View style={styles.tittleContainer}>
          <Text style={styles.titleText}>
            Select vMobile to Operate
          </Text>
        </View>

        <FlatList

          data={this.state.dataSource}

          ItemSeparatorComponent={this.FlatListItemSeparator}

          renderItem={({ item }) => <Text style={styles.item} onPress={this.GetFlatListItem.bind(this, "" + item.VMobileId)} > {item.VMobileName} </Text>}

          keyExtractor={(item, index) => index.toString()}

        />
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


});