
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, FlatList, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

//This screen is used to show active or inactive vMobile's connected to console
export default class StatusModuleScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      latitude: '',
      longitude: '',
    }
  }

  FunctionToOpenStatusInfoScreen = (vMobileID) => {

    this.SaveSelectedvMobileID(vMobileID);
  }

  async SaveSelectedvMobileID(vMobileID) {
    console.log("---->" + vMobileID)
    try {
      await AsyncStorage.setItem('STATUS_VMOBILE_ID', "" + vMobileID);
      this.props.navigation.navigate('StatusInfoScreen');
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
            console.log("http://" + mConsoleIP + "/api/getvmobiles/" + AppId + "/" + this.state.latitude + "/" + this.state.longitude + "/");
            const response = fetch("http://" + mConsoleIP + "/api/getvmobiles/" + AppId + "/" + this.state.latitude + "/" + this.state.longitude + "/", {
              method: 'GET'
            })
              .then((response) => response.json())
              .then((responseJson) => {
                this.setState({
                  isLoading: false,
                });

                if (responseJson.Error === "No Records Found.") {
                  Toast.show("No vMobile's found.")
                } else {
                  responseJson.sort(function (b, responseJson,) { return responseJson.IsAlive - b.IsAlive });
                  this.setState({
                    isLoading: false,
                    dataSource: responseJson
                  });
                  console.log(responseJson);
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

    this.FunctionToOpenStatusInfoScreen(vMobileID);

  }


  render() {

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
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
            Select a vMobile to view it's status
          </Text>
        </View>

        <FlatList

          data={this.state.dataSource}

          ItemSeparatorComponent={this.FlatListItemSeparator}


          renderItem={({ item }) => {

            if (item.IsAlive === true) {
              return <Text style={styles.item1} onPress={this.GetFlatListItem.bind(this, "" + item.VMobileId)} > {item.VMobileName} </Text>;
            } else {
              return <Text style={styles.item2} onPress={this.GetFlatListItem.bind(this, "" + item.VMobileId)} > {item.VMobileName} </Text>;
            }

          }}

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
    color: "blue"
  },
  item1: {
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold',
    color: "blue"
  },
  item2: {
    padding: 10,
    fontSize: 18,
    height: 44,
    fontWeight: 'bold',
    color: "red"
  },

});