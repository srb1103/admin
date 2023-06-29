import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView} from 'react-native'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'

export default function Header(props){
    const {heading, fun} = props
    const user = useSelector(state=>state.user.user)
    return(
        <SafeAreaView style={styles.header}>
            <View style={{...styles.logo_wrap,justifyContent:'space-between'}}>
                <TouchableOpacity activeOpacity={.5} onPress={fun} style={{backgroundColor:'rgba(255,255,255,.2)',height:RFValue(45),width:RFValue(45),borderRadius:30,alignItems:'center',justifyContent:'center',marginRight:5,flexDirection:'row'}}>
                    <Image source={{uri:user.logoURL}} style={styles.logo_img}/>
                </TouchableOpacity>
                <Text style={{...styles.name,fontSize:RFValue(16),maxWidth:'84%',marginLeft:10}}>{heading ? heading : user.name}</Text>
            </View>
        </SafeAreaView>
    )
}

export function Header1(props){
    const {text, fun1, fun2, img1, img2} = props
    return(
        <SafeAreaView style={{...styles.header, paddingVertical: 20}}>
            <View style={styles.logo_wrap}>
                <TouchableOpacity activeOpacity={.5} onPress={fun1}><Image source={img1 ? img1 : require('../assets/left.png')} style={styles.icon_img}/></TouchableOpacity>
                <Text style={{...styles.name, marginLeft: 20}}>{text}</Text>
            </View>
            {fun2 && <TouchableOpacity activeOpacity={.5} onPress={fun2}><Image source={img2} style={styles.icon_img}/></TouchableOpacity>}
        </SafeAreaView>
    )
    
}

export function Header2(props){
    const {text, fun1, scroll} = props
    return(
        <SafeAreaView style={{...styles.header, paddingVertical: 20, backgroundColor: scroll ? Colors.blue : 'rgba(0,0,0,0)', position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2}}>
            <View style={styles.logo_wrap}>
                <TouchableOpacity activeOpacity={.5} onPress={fun1}><Image source={require('../assets/left.png')} style={styles.icon_img}/></TouchableOpacity>
                {scroll && <Text style={{...styles.name, marginLeft: 20}}>{text}</Text>}
            </View>
        </SafeAreaView>
    )
    
}

const styles = StyleSheet.create({
    header:{paddingVertical: 14, backgroundColor: Colors.blue, flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', paddingHorizontal: 15},
    logo_img:{resizeMode:'contain',height:RFValue(38),width:RFValue(38),backgroundColor:'white',borderRadius:40},
    logo_wrap:{flexDirection: 'row', alignItems: 'center', justifyContent:'center'},
    name:{color: Colors.white, fontSize: RFValue(15),fontWeight:'bold'},
    icon_img:{resizeMode:'contain',height:RFValue(20),tintColor:Colors.white}
})