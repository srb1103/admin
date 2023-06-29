import React, { useReducer, useCallback,useEffect } from 'react'
import {View, Text,TouchableOpacity,StyleSheet,FlatList,Image} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'

const SET = 'SET'
let stateReducer = (state,action)=>{
    switch (action.type){
        case SET:
            let {name,value} = action
            return {...state,[name]:value}
        default:return state
    }
}
export default function OldAttendance(props){
    let {navigation,route} = props
    let {date,attendance,data} = route.params
    let [state,dispatchState] = useReducer(stateReducer,{
        data:[],present:0,absent:0,
    })
    let handleSet = useCallback((name,value)=>{
        dispatchState({type:SET,name,value})
    },[dispatchState])
    useEffect(()=>{
        let array = []
        let dt = JSON.parse(attendance)
        data.forEach(d=>{
            let {id,name,img_url} = d
            let st = dt.find(e=>e.id == id)
            let status = st ? st.attendance : null
            let obj = {id,name,img_url,status}
            array.push(obj)
        })
        let pr = array.filter(e=>e.status == 'present').length
        let ab = array.filter(e=>e.status == 'absent').length
        handleSet('data',array)
        handleSet('present',pr)
        handleSet('absent',ab)
    },[])
    function renderStaff(itm){
        let {item} = itm
        let {img_url,name,status} = item
        return (
            <View style={styles.box}>
                <View style={styles.img_wrap}><Image source={{uri:img_url}} style={styles.img}/></View>
                <Text style={{color:Colors.lblack,fontSize:RFValue(15),marginVertical:5}}>{name}</Text>
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                    <TouchableOpacity style={{...styles.statusBtn,backgroundColor:status == 'absent'?'red' : '#bbb',borderTopRightRadius:15}} activeOpacity={.7}><Text style={styles.btnTxt}>A</Text></TouchableOpacity>
                    <TouchableOpacity style={{...styles.statusBtn,backgroundColor:status == 'present'?'green' : '#bbb',borderTopLeftRadius:15}} activeOpacity={.7}><Text style={styles.btnTxt}>P</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
    return(
        <View style={Style.screen}>
            <Header1 text={`Attendance ${date}`} fun1={()=>navigation.goBack()}/>
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