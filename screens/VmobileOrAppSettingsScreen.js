import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Button } from 'react-native';
import { CardViewWithIcon } from "react-native-simple-card-view";

type Props = {};

//This screen is used to select options like App configuration or vMobile configuration
export default class VmobileOrAppSettingsScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = ({
      github: 0,
    }
    )
  }

  FunctionToOpenAppSettingsScreen = () => {
    this.props.navigation.navigate('AppSettingsScreen');
  }

  FunctionToOpenvMobileSettingsScreen = () => {
    this.props.navigation.navigate('vMobileSettingsScreen1');
  }

  render() {
    const miniCustomCardStyle = {
      shadowColor: '#000000', shadowOffsetWidth: 2, shadowOffsetHeight: 2,
      shadowOpacity: 0.1, shadowRadius: 5, bgColor: '#ffffff', padding: 5, margin: 20,
      borderRadius: 3, elevation: 3, width: (Dimensions.get("window").width / 1.5) - 10
    };
    return (
      <View style={styles.topImageContainer}>

        <View style={{ alignItems: "center", flexDirection: "row", flexWrap: 'wrap', }}>
          <CardViewWithIcon
            withBackground={false}
            androidIcon={'logo-youtube'}
            iosIcon={'logo-youtube'}
            iconHeight={50}
            iconColor={'#ae2222'}
            title={'Application Configuration'}
            contentFontSize={10}
            titleFontSize={12}
            style={miniCustomCardStyle}
            content={'Operate vMobile device'}
            onPress={this.FunctionToOpenAppSettingsScreen}
          />
        </View>
        <View style={{ alignItems: "center", flexDirection: "row", flexWrap: 'wrap', }}>
          <CardViewWithIcon
            withBackground={false}
            androidIcon={'logo-youtube'}
            iosIcon={'logo-youtube'}
            iconHeight={50}
            iconColor={'#ae2222'}
            title={'vMobile Configuration'}
            contentFontSize={10}
            titleFontSize={12}
            style={miniCustomCardStyle}
            content={'Configure new vMobile device'}
            onPress={this.FunctionToOpenvMobileSettingsScreen}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  topImageContainer: {
    marginTop: 5,
    alignItems: 'center', justifyContent: 'center',
    paddingBottom: 30,

  },
});
