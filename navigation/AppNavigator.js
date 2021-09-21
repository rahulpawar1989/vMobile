import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import BottomTabNavigatorScreen from '../screens/BottomTabNavigatorScreen';
import VmobileOrAppSettingsScreen from '../screens/VmobileOrAppSettingsScreen';
import StatusModuleScreen from '../screens/StatusModuleScreen';
import StatusInfoScreen from '../screens/StatusInfoScreen';
import AboutScreen from '../screens/About';
import OperationScreen from '../screens/OperationScreen';
//import ChooseOperationScreen from '../screens/ChooseOperationScreen';
import WifiScreen from '../screens/WifiScreen';
import WifiConfigScreen from '../screens/WifiConfigScreen';
//import BluetoothScreen from '../screens/BluetoothScreen';
//import TempScreen from '../screens/TempScreen';


const AppNavigator = createStackNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  BottomTabNavigatorScreen: {
    screen: BottomTabNavigatorScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  VmobileOrAppSettingsScreen: {
    screen: VmobileOrAppSettingsScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  // TempScreen: {
  //   screen: TempScreen,
  //   navigationOptions: {
  //     headerShown: false,
  //   }
  // },
  Operation: {
    screen: OperationScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  // ChooseOperationScreen: {
  //   screen: ChooseOperationScreen,
  //   navigationOptions: {
  //     headerShown: false,
  //   }
  // },
  WifiScreen: {
    screen: WifiScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  WifiConfigScreen: {
    screen: WifiConfigScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  // BluetoothScreen: {
  //   screen: BluetoothScreen,
  //   navigationOptions: {
  //     headerShown: false,
  //   }
  // },
  // AppSettingsScreen: {
  //   screen: AppSettingsScreen,
  //   navigationOptions: {
  //     headerShown: false,
  //   }
  // },
  StatusModule: {
    screen: StatusModuleScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  StatusInfo: {
    screen: StatusInfoScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  AboutInfo: {
    screen: AboutScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
});

export default createAppContainer(AppNavigator);
