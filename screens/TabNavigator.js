import {createAppContainer} from 'react-navigation';  
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';  
import DeviceParameter from "./DeviceParameter";  
import GlobalParameter from "./GlobalParameter";  
  
  //This screen is for navigation for Device and Global Parameter screen
const TabNavigator = createMaterialTopTabNavigator(
  {
    DeviceParameter: {
      screen: DeviceParameter,
      navigationOptions: {
        tabBarLabel: 'Device Param',
      },
    },
    GlobalParameter: {
      screen: GlobalParameter,
      navigationOptions: {
        tabBarLabel: 'Global Param',
      },
    },
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#ae2222',
      },
    },
  }
);

export default createAppContainer(TabNavigator);  