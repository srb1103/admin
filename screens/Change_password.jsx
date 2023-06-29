import React, { useCallback, useReducer } from 'react'
import {View,Text,ActivityIndicator, TouchableWithoutFeedback,Keyboard,Alert} from 'react-native'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import { Btn } from '../components/CTAButton'
import Style from '../constants/Style'
import Colors from '../constants/Colors'
import { useSelector } from 'react-redux'
import { updateDoc,doc } from 'firebase/firestore'
import { db } from '../constants/config'
import { useState } from 'react'
import { fetch_data } from '../firebase/functions'

const UPDATE = 'UPDATE'
const reducer = (state,action)=>{
    switch(action.type){
        case UPDATE:
            let {name,value} = action
            return {...state,[name]:value}
    }
    return state
}
export default function Change_password(props){
    const {navigation} = props
    let u = useSelector(state=>state.user)
    let {uid} = u.user
    let [loading,setLoading] = useState(false)
    let [state,dispatchState] = useReducer(reducer,{
        old:null,
        newP:null
    })
    const handleChange = useCallback((name,value)=>{
        dispatchState({type:UPDATE,name,value})
    },[dispatchState])
    const handleSubmit = async()=>{
        let {old,newP} = state
        if(!old||!newP){Alert.alert('Error','Please enter old and new passwords',[{text:'Okay'}]); return}
        if(old && newP){
            setLoading(true)
            try{
                let t = await fetch_data('institutions')
                let arr = t.find(e=>e.iid == uid)
                let pas = arr.password
                let id = arr.id
                if(old == pas){
                    await updateDoc(doc(db,'institutions',id),{password:newP})
                    Alert.alert('Success','Your password has been changed.',[{text:'Okay',onPress:()=>navigation.goBack()}])
                }else{
                    Alert.alert('Error','Current password does not match.',[{text:'Okay'}])
                    setLoading(false)
                }
            }catch(err){console.log(err);setLoading(false)}
        }
    }
    return(
        <View style={Style.screen}>
            <Header1 text='Change Password' fun1={()=>navigation.goBack()}/>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={Style.body_container}>
            <View style={{padding:20}}>
                <InputField name="old" value={state.old} onChangeFun={handleChange} label="Current Password" placeholder="Enter Current Password" password iseye/>
                <InputField name="newP" value={state.newP} onChangeFun={handleChange} label="New Password" placeholder="Enter New Password" password iseye/>
                <View style={{marginTop:30,alignItems:'center',justifyContent:'center'}}>
                    {loading ? <ActivityIndicator color={Colors.blue} size="large" />: <Btn text="Change Password" fun={handleSubmit}/>}
                </View>
            </View>
            </TouchableWithoutFeedback>
        </View>
    )
}