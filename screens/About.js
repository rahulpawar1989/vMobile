import React, { Component } from 'react';

import { StyleSheet, View, Image, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { WebView } from "react-native-webview";

//This screen opens once user cicks Help button
export default class AboutScreen extends Component {

    render() {
        const html = `
                <body>
        <h4><font color="maroon" size="6" face="tahoma">About vMobile&trade; (Portable Handheld Voice and  Data Testing for Any Mobile or Radio Network):</font></h4>
        <p><font size="6" face="calibri">
          The GL  Communication’s <strong><font size="6" face="calibri">vMobile&trade;</font></strong> is a new offering under the  wide variety of Voice and Data Quality testing tools. This device is controlled  using vMobile&trade; app installed on Android or IOS devices. <strong><font size="6" face="calibri">vMobile&trade;</font></strong> brings true mobility to perform voice, and data quality  testing on wireless devices (any mobile phone or radio). This  ultra-handheld-portable device changes the way automated drive and walk testing  is performed. Simple to setup and conduct simultaneous voice, and data quality  tests to benchmark performance of any type of telephony devices.</p>
        <p><font size="6" face="calibri">vMobile&trade;  includes two Bluetooth® modules, an embedded Wi-Fi module, and onboard GPS. The  device can operate either in Bluetooth® mode or Analog mode (replace the  headset on any analog device including Mobile Radio with PTT). The embedded  Wi-Fi supports remote Data and Video testing as well as connecting to central  system for remote operation and analysis. Status/progress along with the test  results are transferred to the GL WebViewer&trade; central database.  Using the WebViewer&trade;, all events and results  can be queried while also plotting results on Google Maps. </font></p>
        <p><font size="6" face="calibri">For additional information please contact GL  Communications at <a href="mailto:info@gl.com">gl-info@gl.com</a> or visit our  website, <a href="http://www.gl.com/">www.gl.com</a></p>
        
        <h4><font color="maroon" size="6" face="tahoma">About GL Communications: </font></h4>
        <p><font  size="6"  face="calibri"> With almost 25 years of experience, GL  Communications Inc. is a leading supplier of test, monitoring, and analysis  equipment for TDM, Wireless, IP and VoIP networks. Unlike conventional test  equipment, GL's test platforms provide visualization, capture, storage, and  convenient features like portability, remote-access, and scripting. GL provides  customers with a wide range of easily-adapted, cost-effective, and  highly-reliable products and services designed to aid the telecommunications  engineer. <br />
            <br />
        GL also provides consulting services to  Cellular, Wireless, Microwave, Fiber-Optic, Leased T-1 Network, and Satellite  Communications service providers. We have designed and provided on-going  support to over 100 wireless telephony network systems nationwide. GL is  currently certified as a DBE/MBE with Maryland's Department of Transportation  (MDOT), Philadelphia's South Eastern Pennsylvania Transportation Authority  (SEPTA), and Washington Metropolitan Area Transit Authority (WMATA). </font></p>
        </body>`

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
                        Version: {DeviceInfo.getVersion()}
                    </Text>
                </View>

                <WebView
                    style={styles.WebViewStyle}
                    //Loading html file from project folder
                    source={{ html }}
                    //Enable Javascript support
                    javaScriptEnabled={true}
                    //For the Cache
                    domStorageEnabled={true}
                />

            </View>
        );
    }
}
const styles = StyleSheet.create({
    WebViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: 5,
    },
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
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
        color: '#ae2222',
    },
    bottomcontainer: {
        flexDirection: 'row',
        alignSelf: 'baseline',
    },
    buttonContainer: {
        flex: 1,
    }
});