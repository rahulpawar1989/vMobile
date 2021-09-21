import React, {Component} from 'react';  
import {View,Text} from 'react-native';  
import Icon from 'react-native-vector-icons/Ionicons';  
export default class GlobalParameter extends Component{  
    render(){  
        return(  
            <View>  
                <Text>this is GlobalParameter screen</Text>  
            </View>  
        )  
    }  
}  
GlobalParameter.navigationOptions={  
    tabBarIcon:({tintColor, focused})=>(  
        <Icon  
            name={focused ? 'ios-settings' : 'md-settings'}  
            color={tintColor}  
            size={25}  
        />  
    )  
}  