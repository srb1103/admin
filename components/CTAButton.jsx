import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import Colors from '../constants/Colors'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'

export default function CTABtn(props){
    const {fun} = props;
    return(
        <TouchableOpacity activeOpacity={.7} style={styles.cta_wrap} onPress={fun}>
            <Text style={styles.cta_icon}>+</Text>
        </TouchableOpacity>
    )
}

export function ButtonCombo(props){
    const {txt1, txt2, fun1, fun2} = props;
    return(
        <View style={styles.bc_wrap}>
            <TouchableOpacity activeOpacity={.7} onPress={fun1} style={[styles.btn, styles.sec]}>
                <Text style={{...styles.txt, color: Colors.blue}}>{txt1}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.7} onPress={fun2} style={[styles.btn, styles.pri]}>
                <Text style={{...styles.txt}}>{txt2}</Text>
            </TouchableOpacity>
        </View>
    )
}
export function Btn(props){
    const {text,fun,full} = props
    return(
        <View style={styles.bc_wrap}>
            <TouchableOpacity activeOpacity={.7} onPress={fun} style={{...styles.btn, ...styles.pri, ...styles.big,minWidth:full?'100%':RFValue(100),paddingVertical:full?18:10}}>
                <Text style={{...styles.txt, color: Colors.white}}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    cta_wrap:{position: 'absolute', right: 20, bottom: 20, zIndex: 5, backgroundColor: Colors.blue, height: RFValue(60), width: RFValue(60), alignItems:'center', justifyContent: 'center', borderRadius: RFValue(30)},
    cta_icon:{color: Colors.white, fontSize: RFValue(40),marginTop:-5},
    bc_wrap:{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
    btn:{paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8, borderWidth: 1, minWidth: RFValue(100)},
    sec:{borderColor: Colors.blue},
    txt:{fontSize: RFValue(16), color: Colors.white, textAlign: 'center',fontWeight:'bold'},
    pri:{borderColor: Colors.blue, backgroundColor: Colors.blue, marginLeft: 5},
    big:{paddingHorizontal: 40,paddingVertical: 15,borderRadius: 15}
})