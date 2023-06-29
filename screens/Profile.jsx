import React from 'react'
import {View, Text,TouchableOpacity,Image,ActivityIndicator,Alert,StatusBar} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Header1 } from '../components/Header'
import Style from '../constants/Style'
import Colors from '../constants/Colors'
import { useEffect } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { ButtonCombo,Btn } from '../components/CTAButton'
import { logOut } from '../store/actions'
import { useState } from 'react'
import {createTable, deleteUser} from '../helpers/sql-database'

export default function Profile(props){
    const {navigation} = props
    let u = useSelector(state=>state.user)
    let [loading,setLoading] = useState(false)
    let dispatch = useDispatch()
    let user = u.user
    let {session,sessions} = u
    let {name,uid,logoURL} = user
    let s1 = sessions.find(e=>e.id == session)
    let s = null
    if(s1){s = s1.title}
    const handleLogout = ()=>{
        Alert.alert('Are you sure?','Do you really want to log out?',[{text:'Cancel'},{text:'Logout', onPress:log_out}])
    }
    const log_out = async ()=>{
        setLoading(true)
        try{
            await deleteUser()
            await createTable()
            dispatch(logOut())
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    }
    if(loading){
        return(
            <View style={Style.screen}>
                <StatusBar backgroundColor={Colors.bg} hidden={false}/>
                <View style={Style.ai_screen}>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                </View>
            </View>
        )
    }
    return(
        <View style={Style.screen}>
            <Header1 text='Profile' fun1={()=>navigation.goBack()}/>
            <View style={{...Style.body_container,alignItems:'center'}}>
                <View style={{flexDirection:'row',backgroundColor:Colors.bg,borderRadius:10}}>
                    <Image source={{uri:logoURL}} style={{height:RFValue(100),width:RFValue(100),borderRadius:10,backgroundColor:'#f5f5f5'}}/>
                    <View style={{paddingHorizontal:10,alignItems:'flex-start',justifyContent:'center',width:'70%'}}>
                        <Text style={{fontWeight:'bold',color:Colors.black,fontSize:RFValue(18)}}>{name}</Text>
                        <Text style={{color:Colors.lblack,fontSize:RFValue(12)}}>Current Session: {s}</Text>
                        <TouchableOpacity style={{backgroundColor:Colors.white,width:'50%',borderRadius:6,marginTop:5,borderColor:'#ccc',borderWidth:1}} activeOpacity={.5} onPress={()=>navigation.navigate('change_password')}>
                            <Text style={{paddingVertical:5,textAlign:'center',fontWeight:'bold',fontSize:RFValue(12),color:Colors.black}}>Change Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height:20}}/>
                <ButtonCombo fun1={()=>navigation.navigate('sessions')} fun2={()=>handleLogout()} txt1='Sessions' txt2='Logout'/>
                <View style={{height:15}}/>
            </View>
        </View>
    )
}