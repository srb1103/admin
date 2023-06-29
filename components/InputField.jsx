import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TextInput,TouchableOpacity} from 'react-native'
import Colors from '../constants/Colors'
import Style from '../constants/Style'
import { RFValue } from 'react-native-responsive-fontsize'
export default function InputField(props){
    const {value, onChangeFun, label, placeholder, password, name, keyboard, multiline, nol,iseye} = props
    const [focus, setFocus] = useState(false)
    const [val, setValue] = useState(value)
    const [eye,setEye] = useState(password ? true : false)

    const handleChange = (txt)=>{
        let value = keyboard == 'number-pad' ? txt.replace(/[-, ]/g,'') : txt
        setValue(value)
    }
    useEffect(()=>{
        onChangeFun(name, val)
    },[name, val])
    return(
        <View style={styles.inpGrp}>
            <Text style={{...Style.label, color: Colors.black}}>{label}</Text>
            <TextInput value={val} style={{...Style.input, borderColor: focus ? Colors.black : '#e9e9e9', textAlignVertical: nol ? 'top' : 'center'}} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} onChangeText={handleChange} placeholder={placeholder} secureTextEntry={eye} keyboardType={keyboard ? keyboard : 'default'} multiline={multiline ? true : false} numberOfLines={nol ? nol : 1}/>
            {iseye && <TouchableOpacity activeOpacity={.5} onPress={()=>setEye(e=>!e)} style={{...styles.eye_wrap,top:RFValue(37)}}><Text style={styles.toggle}>{eye?'Show':'Hide'}</Text></TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    inpGrp:{paddingVertical: 10,position:'relative'},
    eye_wrap:{position:'absolute',right:13},
    toggle:{fontSize:RFValue(13),color:'#a9a9a9',backgroundColor:Colors.white,fontWeight:'bold',paddingVertical:10}
})