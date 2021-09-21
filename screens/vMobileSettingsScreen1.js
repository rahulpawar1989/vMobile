import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, Image, } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

//This screen is used to show information  about vMobile hardware's AP mode
export default class vMobileSettingsScreen1 extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  }

  parse = (input) => {
    function parseSingle(input) {
      var parts = input.split('||'),
        part,
        record = {};

      for (var i = 0; i < parts.length; i++) {
        part = parts[i].split('=');
        record[part[0]] = part[1];
      }

      return record;
    }

    var parts = input.split('++'),
      records = [];

    for (var i = 0; i < parts.length; i++) {
      records.push(parseSingle(parts[i]));
    }

    return records;
  }
  componentWillUnmount() {

  }

  FunctionToOpenvMobileSettingsScreen2 = () => {
    this.props.navigation.navigate('vMobileSettingsScreen2');
  }

  render() {
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

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            vMobile Configuration
          </Text>
        </View>

        <View style={{
          flexDirection: 'row', alignSelf: "center",
        }}>

          <Image
            source={require('./img/bigvmobileunitchange.png')}
            style={{ width: 160, height: 230, }} alignSelf="center"
          />

        </View>

        <View style={{
          flexDirection: 'row', justifyContent: "space-evenly", marginTop: 50, margin: 5,
        }}>
          <Text style={styles.titleText}>
            Step 1: Press S4 button on the vMobile to switch from normal mode to WiFi AP mode.
          </Text>
        </View>

        <View style={styles.bottomView}>
          <View style={{
            flexDirection: 'row', justifyContent: "space-evenly", marginBottom: 15,
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
                title="Next"
                color="#ae2222"
                onPress={() => {
                  this.FunctionToOpenvMobileSettingsScreen2();
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
    height: 30,
  },

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
  }

});
