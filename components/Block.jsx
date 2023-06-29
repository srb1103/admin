import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'

export default function Block(props){
    const {heading, text, image, icon, fun, css,bg,width} = props
    let st = css == true ? {...styles.wrap, borderBottomColor: '#f7f7f7', borderBottomWidth: 1} : {...styles.wrap}
    return(
        <TouchableOpacity activeOpacity={.5} onPress={fun} style={{...st,position:'relative',overflow:'hidden',borderRadius:10,backgroundColor:bg?Colors.bg:null,marginBottom:bg?5:0}}>
            {(image || icon) && <View style={{width: '9%', alignItems: 'center', justifyContent:'center'}}>
                {image && <Image source={{uri: image}} style={styles.image}/>} 
            </View>}
            <View style={styles.block_det}>
                <View style={{width: '85%'}}>
                    <Text style={styles.heading}>{heading}</Text>
                    {text && <Text style={styles.text}>{text}</Text>}
                </View>
                {fun && <Image style={styles.icon} source={require('../assets/left.png')}/>}
            </View>
            {bg && <View style={{position:'absolute',top:0,left:0,height:'200%',width:width,backgroundColor:Colors.blue,zIndex:-1,opacity:.1}}/>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrap:{padding: 3, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', marginVertical: 2},
    icon:{height: RFValue(20), tintColor: 'grey',resizeMode:'contain',rotation:180},
    block_det:{flexDirection:'row', alignItems: 'center', justifyContent:'space-between', flex: 1, marginLeft: 10},
    heading:{fontSize: RFValue(16), color: Colors.black,width:'90%'},
    text:{fontSize: RFValue(11), color: Colors.lblack},
    image:{height: RFValue(24), width: RFValue(24), borderRadius: RFValue(12)}
})