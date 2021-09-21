import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, FlatList, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

//This screen is used to show user selected vMobile's status 
export default class StatusInfoScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
        }
    }

   
    componentDidMount() {
        this.onFetchLoginRecords();
    }

    async onFetchLoginRecords() {
        try {

            var SlectedvMobileId = await AsyncStorage.getItem('STATUS_VMOBILE_ID');;

            console.log('Slected vMobileId ----------' + SlectedvMobileId);

            const mConsoleIP = await AsyncStorage.getItem('CONSOLE_IP');
            const AppId = await AsyncStorage.getItem('APP_ID');
            this.state.latitude = await AsyncStorage.getItem('LATITIUDE');
            this.state.longitude = await AsyncStorage.getItem('LONGITUDE');


            console.log('Console ip: ' + mConsoleIP);
            console.log('AppId: ' + AppId);
            console.log('GPSLat: ' + this.state.latitude);
            console.log('GPSLng: ' + this.state.longitude);

            NetInfo.fetch().then(state => {
                if ( state.isConnected) {
                    if (mConsoleIP != null && AppId != null) {
                        console.log("http://" + mConsoleIP + "/api/getvmobile/" +  AppId + "/" + SlectedvMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/") 
                       const response = fetch("http://" + mConsoleIP + "/api/getvmobile/" +  AppId + "/" + SlectedvMobileId + "/" + this.state.latitude + "/" + this.state.longitude + "/", {
                        method: 'GET'
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                
                                this.setState({
                                    isLoading: false,
                                    dataSource: [responseJson]
                                });
                            })
                            .catch((error) => {
                                Toast.show("Network request failed.")
                                this.props.navigation.goBack(null)
                            });
                    } else {
                        Toast.show("Please configure App with the Console.")
                        this.props.navigation.goBack(null)
                    }
                } else {
                  Toast.show('No Internet connectivity')
                  this.props.navigation.goBack(null)
                }
              });
        } catch (error) {
            console.log(error)
            this.props.navigation.navigate('StatusModule')
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

    renderGPS(item) {
        if (item.NewGps != null && item.NewGps.length > 0) {

            let Location = item.NewGps.split(",");
            let GpsLatitude = Location[0];
            let GpsLongitude = Location[1];

            return <View style={styles.buttonContainerStyle}>
                <Image source={require('./img/ic_maps_blue.png')} style={styles.itemImage} />

                <View style={styles.itemMeta}>
                    <Text style={styles.itemName}>Location</Text>
                    <Text style={styles.itemLastMessage}>GPSLat: {GpsLatitude}</Text>
                    <Text style={styles.itemLastMessage}>GPSLng: {GpsLongitude}</Text>
                    <Text style={styles.itemLastMessage}>GPS Status: {(item.GPSStatus == 1) ? <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'normal' }}>
                      Active
            </Text> : <Text style={{ color: 'grey', fontSize: 14, fontWeight: 'normal' }}>
                      Inactive
            </Text>}
            </Text>
                </View>
            </View>
        } else if (item.OldGps != null && item.OldGps.length > 0) {

            let Location = item.OldGps.split(",");
            let GpsLatitude = Location[0];
            let GpsLongitude = Location[1];

            return <View style={styles.buttonContainerStyle}>
                <Image source={require('./img/ic_maps_yellow.png')} style={styles.itemImage} />

                <View style={styles.itemMeta}>
                    <Text style={styles.itemName}>Location</Text>
                    <Text style={styles.itemLastMessage}>GPSLat: {GpsLatitude}</Text>
                    <Text style={styles.itemLastMessage}>GPSLng: {GpsLongitude}</Text>
                    <Text style={styles.itemLastMessage}>GPS Status: {(item.GPSStatus == 1) ? <Text style={{ color: 'blue', fontSize: 14, fontWeight: 'normal' }}>
                      Active
            </Text> : <Text style={{ color: 'grey', fontSize: 14, fontWeight: 'normal' }}>
                      Inactive
            </Text>}
            </Text>
                </View>
            </View>
        }

    }

    renderBattery(item) {

        if (item.Battery > 0 && item.Battery <= 25) {
            return <View style={styles.buttonContainerStyle}>
                <Image source={require('./img/ic_battery25.png')} style={styles.itemImage} />
                <View style={styles.itemMeta}>
                    <Text style={styles.itemName}>Battery</Text>
                    <Text style={styles.itemLastMessage}>{item.Battery}</Text>
                </View>
            </View>
        } else if (item.Battery > 25 && item.Battery <= 50) {
            return <View style={styles.buttonContainerStyle}>
                <Image source={require('./img/ic_battery50.png')} style={styles.itemImage} />
                <View style={styles.itemMeta}>
                    <Text style={styles.itemName}>Battery</Text>
                    <Text style={styles.itemLastMessage}>{item.Battery}</Text>
                </View>
            </View>
        } else if (item.Battery > 50 && item.Battery <= 75) {
            return <View style={styles.buttonContainerStyle}>
                <Image source={require('./img/ic_battery75.png')} style={styles.itemImage} />
                <View style={styles.itemMeta}>
                    <Text style={styles.itemName}>Battery</Text>
                    <Text style={styles.itemLastMessage}>{item.Battery}</Text>
                </View>
            </View>
        } else if (item.Battery > 75) {
            return <View style={styles.buttonContainerStyle}>
                <Image source={require('./img/ic_battery100.png')} style={styles.itemImage} />
                <View style={styles.itemMeta}>
                    <Text style={styles.itemName}>Battery</Text>
                    <Text style={styles.itemLastMessage}>{item.Battery}</Text>
                </View>
            </View>
        }

    }


    renderItem(data) {
        let { item, index } = data;
        //console.log('=========>'+item.IsAlive);
        return (
            <View style={styles.MainContainer}>

                <View style={styles.buttonContainerStyle}>
                    {item.IsAlive === true ? <Image source={require('./img/ic_status_green.png')} style={styles.itemImage} /> : <Image source={require('./img/ic_status_yellow.png')} style={styles.itemImage} />}
                    <View style={{ fontSize: 20 }}>
                        <Text style={styles.itemName}>Active Status</Text>
                        {item.IsAlive === true ? <Text style={styles.itemLastMessage}>Active</Text> : <Text style={styles.itemLastMessage}>Inactive</Text>}
                        {
                            (item.TimeZone === "GMT") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - Greenwich Mean Time" }</Text>
                            :(item.TimeZone === "UTC") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - Universal Coordinated Time"}</Text>
                            :(item.TimeZone === "EST") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - Eastern Standard Time"}</Text>
                            :(item.TimeZone === "CST") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - Central Standard Time"}</Text>
                            :(item.TimeZone === "ECT") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - European Central Time"}</Text>
                            :(item.TimeZone === "MET") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - Middle East Time"}</Text>
                            :(item.TimeZone === "IST") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - India Standard Time"}</Text>
                            :(item.TimeZone === "PST") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - Pacific Standard Time"}</Text>
                            :(item.TimeZone === "ART") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - (Arabic)Egypt Standard Time"}</Text>
                            :(item.TimeZone === "EET") ?
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - Eastern European Time"}</Text>
                            :
                            <Text style={styles.itemLastMessage}>Timezone: {item.TimeZone  + " - US Mountain Standard Time"}</Text>
                        }
                        <Text style={styles.itemLastMessage}>Current time: {item.ZonalTime}</Text>
                        <Text style={styles.itemLastMessage}>Last Active Status: {item.LastActive}</Text>
                        
                    </View>
                </View>

                <View style={styles.buttonContainerStyle}>
                    {item.Bluetooth1Connt == null ? <Image source={require('./img/ic_bluetooth_gray.png')} style={styles.itemImage} /> : <Image source={require('./img/ic_bluetooth_blue.png')} style={styles.itemImage} />}
                    <View style={{ fontSize: 20 }}>
                        <Text style={styles.itemName}>Bluetooth Device 1</Text>
                        <Text style={styles.itemLastMessage}>{item.Bluetooth1}</Text>
                        <Text style={styles.itemLastMessage}>Script Name: {item.Bluetooth1ScriptName}</Text>
                        {item.Bluetooth1ScriptStatus == null ? <Text style={styles.itemLastMessage}>Script Status: {item.Bluetooth1ScriptStatus}</Text> : <Text style={styles.itemLastMessage}>Script Status: Idle</Text>}

                    </View>
                </View>

                <View style={styles.buttonContainerStyle}>
                    {item.Bluetooth2Connt == null ? <Image source={require('./img/ic_bluetooth_gray.png')} style={styles.itemImage} /> : <Image source={require('./img/ic_bluetooth_blue.png')} style={styles.itemImage} />}
                    <View style={{ fontSize: 20 }}>
                        <Text style={styles.itemName}>Bluetooth Device 2</Text>
                        <Text style={styles.itemLastMessage}>{item.Bluetooth2}</Text>
                        <Text style={styles.itemLastMessage}>Script Name: {item.Bluetooth2ScriptName}</Text>
                        {item.Bluetooth2ScriptStatus == null ? <Text style={styles.itemLastMessage}>Script Status: {item.Bluetooth2ScriptStatus}</Text> : <Text style={styles.itemLastMessage}>Script Status: Idle</Text>}

                    </View>
                </View>

                {this.renderGPS(item)}

                <View style={styles.buttonContainerStyle}>
                    {item.WifiName == null ? <Image source={require('./img/ic_wifi_gray.png')} style={styles.itemImage} /> : <Image source={require('./img/ic_wifi_blue.png')} style={styles.itemImage} />}
                    <View style={styles.itemMeta}>
                        <Text style={styles.itemName}>Wi-Fi</Text>
                        <Text style={styles.itemLastMessage}>Name: {item.WifiName}</Text>
                    </View>
                </View>

                {this.renderBattery(item)}

                <View style={styles.buttonContainerStyle}>
                    <Image source={require('./img/ic_vmobile_icon.png')} style={styles.itemImage} />
                    <View style={styles.itemMeta}>
                        <Text style={styles.itemName}>Listner IP</Text>
                        <Text style={styles.itemLastMessage}>{item.GLLIP}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainerStyle}>
                    <Image source={require('./img/ic_vmobile_icon.png')} style={styles.itemImage} />
                    <View style={styles.itemMeta}>
                        <Text style={styles.itemName}>Central DB IP</Text>
                        <Text style={styles.itemLastMessage}>{item.CentralIP}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainerStyle}>
                    <Image source={require('./img/ic_vmobile_icon.png')} style={styles.itemImage} />
                    <View style={styles.itemMeta}>
                        <Text style={styles.itemName}>vMobile Serial Number</Text>
                        <Text style={styles.itemLastMessage}>{item.SerialNo}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainerStyle}>
                    <Image source={require('./img/ic_vmobile_icon.png')} style={styles.itemImage} />
                    <View style={styles.itemMeta}>
                        <Text style={styles.itemName}>Bit File</Text>
                        <Text style={styles.itemLastMessage}>{item.BitFileVersion}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainerStyle}>
                    <Image source={require('./img/ic_vmobile_icon.png')} style={styles.itemImage} />
                    <View style={styles.itemMeta}>
                        <Text style={styles.itemName}>Version</Text>
                        <Text style={styles.itemLastMessage}>{item.Version}</Text>
                    </View>
                </View>

            </View>

        )
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
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.dataSource}
                    renderItem={this.renderItem.bind(this)}
                />

                <View style={[{ width: "30%", margin: 10, alignSelf: 'center' }]}>
                    <Button
                        onPress={() => this.props.navigation.goBack(null)}
                        title="Back"
                        color="#ae2222"
                    />
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
        
    },
    tittleContainer: {
        width: "100%",
        backgroundColor: '#d3d3d3',
        alignItems: 'center',
        justifyContent: 'center',
        height: 25,
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
        backgroundColor: '#F5F5F5',
	marginTop: 7,
    },

    itemBlock: {
        flexDirection: 'row',
        paddingBottom: 5,
    },
    itemImage: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginTop: 10,
    },
    itemMeta: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    itemName: {
        marginTop: 3,
        fontSize: 20,
        color: '#ae2222',
        fontWeight: 'bold',
    },
    itemLastMessage: {
        fontSize: 14,
        color: "#111",
    },
    buttonContainerStyle: {
        alignSelf: 'baseline',
        marginTop: 10,
        width: '90%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 3,
        paddingBottom: 3,
        marginLeft: 20,
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: Platform.OS === 'ios' ? .5 : 0,
        borderRadius: 2,
        borderColor: Platform.OS === 'ios' ? 'rgb(225, 225, 225)' : 'rgba(0,0,0,.0)',

        // shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.5,

        elevation: 2,
    },

});