import React, { useReducer, useCallback, useState,useEffect } from 'react'
import {View, ActivityIndicator, Text,TouchableOpacity,Alert,StyleSheet,FlatList,Image} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import { Btn } from '../components/CTAButton'
import { useDispatch } from 'react-redux'
import { db } from '../constants/config'
import { collection,addDoc } from 'firebase/firestore'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { addAttendance } from '../store/actions'

let SET = 'SET'
let MARK = 'MARK'
let stateReducer = (state,action)=>{
    switch (action.type){
        case SET:
            let {name,value} = action
            return {...state,[name]:value}
        case MARK:
            let {id,status} = action
            let {data} = state
            let array = data
            let ind = array.findIndex(e=>e.id == id)
            array[ind].status = status
            let present = array.filter(e=>e.status == 'present').length
            let absent = array.filter(e=>e.status == 'absent').length
            let rem = array.filter(e=>e.status == null).length
            return {...state,data:array,present,absent,remaining:rem}
        default:return state
    }
}
export default function MarkAttendance(props){
    let {navigation,route} = props
    let {date,iid,session,data,type,fun} = route.params
    let [loading,setLoading] = useState(true)
    let dispatch = useDispatch()
    let [state,dispatchState] = useReducer(stateReducer,{
        data:[],present:0,absent:0,remaining:0,date
    })
    let handleSet = useCallback((name,value)=>{
        dispatchState({type:SET,name,value})
    },[dispatchState])
    useEffect(()=>{
        let array = []
        data.forEach(d=>{
            let {id,name,img_url} = d
            let obj = {id,name,img_url,status:null}
            array.push(obj)
        })
        let rem = array.filter(e=>e.status == null).length
        handleSet('data',array)
        handleSet('remaining',rem)
        setLoading(false)
    },[])
    function renderStaff(itm){
        let {item} = itm
        let {id,img_url,name,status} = item
        return (
            <View style={styles.box}>
                <View style={styles.img_wrap}><Image source={{uri:img_url}} style={styles.img}/></View>
                <Text style={{color:Colors.lblack,fontSize:RFValue(15),marginVertical:5}}>{name}</Text>
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={()=>{loading ? null : markAttn(id,'absent')}} style={{...styles.statusBtn,backgroundColor:status == 'absent'?'red' : '#bbb',borderTopRightRadius:15}} activeOpacity={.7}><Text style={styles.btnTxt}>A</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{loading ? null : markAttn(id,'present')}} style={{...styles.statusBtn,backgroundColor:status == 'present'?'green' : '#bbb',borderTopLeftRadius:15}} activeOpacity={.7}><Text style={styles.btnTxt}>P</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
    const markAttn = useCallback((id,status)=>{
        dispatchState({type:MARK,id,status})
    },[dispatchState])
    let goBack = ()=>{
        navigation.goBack()
    }
    const handleSubmit = async()=>{
        let {data,date} = state
        let array = []
        data.forEach(d=>{
            let {id,status} = d
            let obj = {id,attendance:status}
            array.push(obj)
        })
        let attendance = JSON.stringify(array)
        setLoading(true)
        try{
            let str = type == 'teaching' ? 'teacher-attendance' : 'staff-attendance'
            let res = await addDoc(collection(db,str),{instituteID:iid,sessionID:session,date,attendance})
            let id = res.id
            let obj = {id,date,attendance}
            dispatch(addAttendance(type,obj))
            fun(obj)
            Alert.alert('Success','Attendance submitted successfully',[{text:'Okay',onPress:goBack}])
            
        }catch(err){
            setLoading(false)
            console.log(err)
            Alert.alert('Error','Something went wrong. Please try again',[{text:'Okay'}])
        }
        
    }
    const handleSubmit1 = ()=>{
        Alert.alert('Final Submit?',"You won't be able to make any change once submitted.",[{text:'Cancel'},{text:'Submit',onPress:handleSubmit}])
    }
    return(
        <View style={Style.screen}>
            <Header1 text={`Mark Attendance`} fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <View style={styles.flex}>
                    <View style={{...styles.flex,flexDirection:'row',width:'70%'}}>
                        <TouchableOpacity activeOpacity={.5} style={{...styles.btn,backgroundColor:Colors.blue,borderBottomLeftRadius:10,borderTopLeftRadius:10}}>
                            <Text style={{...styles.btn_txt,color:Colors.white}}>{`Present (${state.present})`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5} style={{...styles.btn,borderBottomRightRadius:10,borderTopRightRadius:10}}>
                            <Text style={{...styles.btn_txt}}>{`Absent (${state.absent})`}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height:20}}/>
                <FlatList data={state.data} keyExtractor={(item,index)=>index.toString()} renderItem={renderStaff} showsVerticalScrollIndicator={false} overScrollMode='never' numColumns={2}/>
                <View style={{height:50}}/>
                {loading ? <ActivityIndicator size="large" color={Colors.blue} />: state.remaining == 0 && <Btn text="Submit Attendance" fun={handleSubmit1}/>}
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    flex:{alignItems:'center',justifyContent:'center'},
    btn:{paddingVertical:14,paddingHorizontal:20,width:'50%',backgroundColor:Colors.white},
    btn_txt:{fontSize:RFValue(15),fontWeight:'bold',textAlign:'center',color:Colors.blue},
    box:{background:'red',width:'45%',borderRadius:10,alignItems:'center',justifyContent:'center',borderColor:'#eee',borderWidth:1,margin:5,overflow:'hidden'},
    btnTxt:{textAlign:'center',fontFamily:'p6',fontSize:RFValue(15),color:Colors.white},
    img_wrap:{height:RFValue(60),width:RFValue(60),borderRadius:60,overflow:'hidden',marginTop:20},
    img:{resizeMode:'cover',height:'100%',width:'100%'},
    statusBtn:{width:'45%',paddingVertical:7}
})