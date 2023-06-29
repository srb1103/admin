import React, { useCallback, useReducer,useState } from 'react'
import {View, Text,StyleSheet,Image, ActivityIndicator, Alert, StatusBar, TouchableWithoutFeedback,Keyboard, Dimensions,ScrollView} from 'react-native'
import InputField from '../components/InputField'
import Colors from '../constants/Colors'
import { Btn } from '../components/CTAButton'
import {db} from '../constants/config'
import {doc, getDoc, updateDoc} from 'firebase/firestore'
import { RFValue } from 'react-native-responsive-fontsize'

let {height} = Dimensions.get('window')
const UPDATE = 'UPDATE'
const stateReducer = (state,action)=>{
    switch (action.type){
        case UPDATE:
            let {name,value} = action
            return{...state,[name]:value}
    }
    return state
}
export default function Forgot_password(props){
    let {navigation} = props
    const [loading,setLoading] = useState(false)
    let [otp,setOTP] = useState(null)
    let [showOTP,setShowOTP] = useState(false)
    let [showNEW,setShowNew] = useState(false)
    let [showSend,setShowSend] = useState(true)
    const [state,dispatchState]=useReducer(stateReducer,{
        username:'',
        otpEntered:'',
        password:''
    })
    const handleChange = useCallback((name,value)=>{
        dispatchState({type:UPDATE,name,value})
    },[dispatchState])
    const sendMail = async()=>{
        let {username} = state
        if(username){
            setLoading(true)
            let res = await getDoc(doc(db,'institutions',username))
            if(res._document){
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 6; i++ ) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }
                setOTP(OTP)
                let data = res._document.data.value.mapValue.fields
                let mail = data.mail.stringValue
                await fetch(`https://kotcode.in/LMS_api/send_otp?type=forgot_password&from=admin&mail=${mail}&otp=${OTP}`)
                Alert.alert('Enter OTP','Enter OTP sent to your registered email ID',[{text:'Okay'}])
                setLoading(false)
                setShowSend(false)
                setShowOTP(true)
            }else{
                Alert.alert('Error','Please enter a valid username',[{text:'Okay'}])
                setLoading(false)
            }
        }else{
            Alert.alert('Error','Please enter username',[{text:'Okay'}])
        }
    }
    const verifyOTP = ()=>{
        let {otpEntered} = state
        if(otpEntered == otp){
            setShowOTP(false)
            setShowNew(true)
        }else{
            Alert.alert('Incorrect OTP','You entered incorrect OTP',[{text:'Okay'}])
        }
    }
    const resetPassword = async ()=>{
        let {username,password} = state
        if(username && password){
            setLoading(true)
            try{
                await updateDoc(doc(db,'institutions',username),{password:password})
                Alert.alert('Success','Password reset successful',[{text:'Okay',onPress:()=>navigation.goBack()}])
            }catch(err){console.log(err)}
        }else if(!username){
            Alert.alert('Error','Please enter username',[{text:'Okay'}])
        }else if(!password){
            Alert.alert('Error','Please enter password',[{text:'Okay'}])
        }
    }
    return(
            <View style={{flex:1,position:'relative',alignItems:'center',justifyContent:'center',backgroundColor:Colors.white}}>
                <StatusBar backgroundColor={Colors.blue} hidden={false} animated={true}/>
                <View style={{position:'absolute',top:0,left:0,width:'100%',height:height*.5,zIndex:-1,backgroundColor:Colors.blue}}/>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1,width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <ScrollView overScrollMode='never' style={{width:'100%'}} showsVerticalScrollIndicator={false}>
                    <View style={{padding:10,alignItems:'center',justifyContent:'center',width:'100%'}}>
                        <Image source={require('../assets/icon.png')} style={styles.image}/>
                        <Text style={{fontSize:RFValue(16),fontWeight:'bold',color:Colors.white}}>emezy</Text>
                        <View style={{padding:RFValue(20),borderRadius:20,backgroundColor:Colors.bg,width:'95%',marginTop:30,paddingVertical:30}}>
                            {showSend && <InputField name="username" label="Username" onChangeFun={handleChange} placeholder="Enter Username"/>}
                            {showOTP && <InputField name="otpEntered" label="OTP" onChangeFun={handleChange} placeholder="Enter OPT" keyboard="number-pad"/>}
                            {showNEW && <InputField name="password" label="New Password" onChangeFun={handleChange} placeholder="Enter New Password" password={true} iseye/>}
                            <View style={{height:90,alignItems:'center',justifyContent:'center'}}>
                                {loading ? <ActivityIndicator size="large" color={Colors.blue}/>: 
                                <View>
                                    {showSend && <Btn text="Send OTP" fun={sendMail} full/>}
                                    {showOTP && <Btn text="Verify OPT" fun={verifyOTP} full/>}
                                    {showNEW && <Btn text="Reset" fun={resetPassword} full/>}
                                </View>}
                            </View>
                            
                        </View>
                    </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>
    )
}

const styles = StyleSheet.create({
    image:{height: RFValue(100),width: RFValue(100),borderRadius:20,marginTop:RFValue(100)}
})
