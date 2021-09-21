import React, {Component} from 'react';  
import {StyleSheet, View} from 'react-native';  
import {createAppContainer} from 'react-navigation';   
  
import TabNavigator from './TabNavigator';  
const AppIndex = createAppContainer(TabNavigator)  
  
export default class TopTabNavigator extends Component{  

    
    render(){  
        return(  
            <View style={{flex:1}} >  
            <View style={styles.header}>  
                    
                    <View tittle='Device Config' /> 
                </View> 
                <AppIndex/>  
            </View>  
        )  
    }  
}  
const styles = StyleSheet.create({  
    wrapper: {  
        flex: 1,  
    },  
    header:{  
        flexDirection: 'row',  
        alignItems: 'center',  
        justifyContent: 'space-between',  
        backgroundColor: '#ae2222',  
        paddingHorizontal: 18,  
        paddingTop: 5,  
    }  
});  