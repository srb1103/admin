import React from 'react'
import {Text, StyleSheet, TouchableOpacity,Image,View} from 'react-native'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'

export default function HomeCat(props){
    const {title, img, fun,notif,num} = props
    return(
        <TouchableOpacity style={styles.category} activeOpacity={.7} onPress={fun}>
            <View style={styles.img_wrap}>
            <Image source={img} style={styles.img}/>
                </View>
            <Text style={styles.cat_name}>{title}</Text>
            {notif && <View style={styles.notif}>
                <Text style={styles.num}>{num}</Text>
            </View>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    category:{paddingVertical: 15, alignItems:'center', justifyContent: 'center', width: '33%',position:'relative'},
    img:{resizeMode:'contain',height:'80%',marginBottom:5},
    cat_name:{fontSize: RFValue(12)},
    img_wrap:{height:RFValue(62),width:'100%',alignItems:'center',justifyContent:'flex-end',padding:5,paddingBottom:0},
    notif:{position:'absolute',top:20,right:15,height:RFValue(18),minWidth:RFValue(18),borderRadius:20,backgroundColor:Colors.red,alignItems:'center',justifyContent:'center',zIndex:2},
    num:{color:Colors.white,fontWeight:'bold',paddingHorizontal:5}
})