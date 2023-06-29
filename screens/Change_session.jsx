import React, {useReducer, useCallback, useState} from 'react'
import {View, Text, Alert, StyleSheet,StatusBar,ActivityIndicator} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import SelectList from 'react-native-dropdown-select-list'
import { ButtonCombo } from '../components/CTAButton'
import Colors from '../constants/Colors'
import { useDispatch } from 'react-redux'
import { RFValue } from 'react-native-responsive-fontsize'
import { db } from '../constants/config'
import { doc, updateDoc } from 'firebase/firestore'
import { fetch_data } from '../firebase/functions'
import { changeSession,setData } from '../store/actions'


export default function Student_form(props){
    const {navigation, route} = props
    const {sessions,session,uid} = route.params
    const [loading,setLoading] = useState(false)
    const [sID,setSID] = useState(session)
    let sess = []
    sessions.forEach(e=>{
        sess.push({key: e.id,value: e.title})
    })
    const setCat = (opt)=>{
        setSID(opt)
    }
    let dispatch = useDispatch()
    const [selected, setSelected] = useState("");
    const save = async()=>{
        setLoading(true)
        try{
            let i = await fetch_data('institutions')
            let ins = i.find(e=>e.iid == uid)
            let iid = ins.id
            await updateDoc(doc(db,'institutions',iid),{sessionID:sID})
            dispatch(changeSession(sID))
            dispatch(setData(uid)).then(()=>Alert.alert('Success','Session has been changed successfully',[{text:'Okay',onPress:()=>navigation.goBack()}])).catch(err=>console.log(err))
        }catch(err){console.log(err);setLoading(false)}
    }
    if(loading){
        return(
            <View style={Style.screen}>
                <StatusBar backgroundColor={Colors.bg} hidden={false}/>
                <View style={Style.ai_screen}>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                    <Text style={{...Style.label,marginTop:5}}>Changing Session. Please wait...</Text>
                </View>
            </View>
        )
    }
    return(
        <View style={Style.screen}>
            <Header1 text="Change Session" fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container} overScrollMode='never' showsVerticalScrollIndicator={false}>
                <Text style={Style.label}>Select Session</Text>
                <SelectList setSelected={setSelected} data={sess} onSelect={() => setCat(selected)} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Select Session" searchPlaceholder="Search session..." dropdownStyles={{backgroundColor: Colors.white, borderColor: '#eee'}} 
                defaultOption={sess.find(e=>e.key == session)}
                />
                <View style={{height: 40}}/>
                <ButtonCombo fun1={()=>navigation.goBack()} fun2={save} txt1={'Cancel'} txt2='Change'/>
                <View style={{height: 70}}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    camera_img:{tintColor:'#ccc',height:RFValue(35),resizeMode:'contain'},
    imgPickerWrap:{height:RFValue(80),width:RFValue(80),borderRadius:50,backgroundColor:Colors.white,alignItems:'center',justifyContent:"center", overflow:'hidden'},
    image_:{height:RFValue(80),width:RFValue(80)}
})