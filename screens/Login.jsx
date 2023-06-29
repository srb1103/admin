import React, { useCallback, useReducer,useState } from 'react'
import {View, Text,StyleSheet,Image, ActivityIndicator, Alert, StatusBar, TouchableWithoutFeedback,Keyboard, Dimensions,ScrollView, TouchableOpacity} from 'react-native'
import InputField from '../components/InputField'
import Colors from '../constants/Colors'
import { Btn } from '../components/CTAButton'
import {db} from '../constants/config'
import {doc, getDoc} from 'firebase/firestore'
import {createTable, setUser} from '../helpers/sql-database'
import { useDispatch } from 'react-redux'
import { setUID } from '../store/actions'
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
export default function Login(props){
    let {navigation} = props
    const [loading,setLoading] = useState(false)
    let dispatch = useDispatch()
    const [state,dispatchState]=useReducer(stateReducer,{
        username:'',
        password:''
    })
    const handleChange = useCallback((name,value)=>{
        dispatchState({type:UPDATE,name,value})
    },[dispatchState])
    const login = async ()=>{
        let {username,password} = state
        if(username && password){
        setLoading(true)
        try{
            let res = await getDoc(doc(db,'institutions',state.username))
            if(res._document){
                let data = res._document.data.value.mapValue.fields
                if(state.password == data.password.stringValue){
                    let institutionID = data.iid.stringValue
                    let name = data.Name.stringValue
                    let imgURL = data.logoURL.stringValue
                    let mail = data.mail.stringValue
                    let contact = data.contact.stringValue
                    let label = data.label.stringValue
                    await setUser(institutionID,name,imgURL,mail,contact,label)
                    dispatch(setUID(institutionID,name,imgURL,mail,contact,label))
                }else{
                    Alert.alert('Error','Password incorrect. Please enter valid password',[{text:'Okay'}])
                }
            }else{
                Alert.alert('Error','Username not found.',[{text:'Okay'}])
            }
            setLoading(false)
        }catch(err){
            console.log(err)
        }
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
                            <InputField name="username" label="Username" onChangeFun={handleChange} placeholder="Enter Username"/>
                            <InputField name="password" label="Password" onChangeFun={handleChange} placeholder="Enter Password" password iseye/>
                            <View style={{height:90,alignItems:'center',justifyContent:'center'}}>
                                {loading ? <ActivityIndicator size="large" color={Colors.blue}/>: 
                                <View>
                                    <TouchableOpacity activeOpacity={.5} onPress={()=>{navigation.navigate('forgot_password')}}>
                                        <Text style={{textAlign:'right',fontSize:RFValue(14),marginBottom:RFValue(10),color:"#A0A0A0"}}>forgot password?</Text>
                                    </TouchableOpacity>
                                    <Btn text="Login Now" fun={login} full/>
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
