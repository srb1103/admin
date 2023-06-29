import React,{ useReducer } from 'react'
import {View,Text,FlatList} from 'react-native'
import { Header1 } from '../components/Header'
import Block from '../components/Block'
import Style from '../constants/Style'
import Colors from '../constants/Colors'
import { useSelector } from 'react-redux'

const reducer = (state,action)=>{
    return state
}
export default function Attendance_overview(props){
    let {navigation,route} = props
    let {classId,id,name,rollNo} = route.params
    let u = useSelector(state=>state.user)
    let {attendance,subjects} = u
    let s_array = subjects.filter(e=>e.class_id == classId)
    let attn_array = []
    s_array.forEach(s=>{
        let arr = attendance.filter(e=>e.classID == s.id)
        let new_array = []
        if(arr){
            arr.forEach(e=>{
                let atn = JSON.parse(e.attendance)
                let st = atn.find(s=>s.id == id)
                let atn_status = null
                if(st){
                    atn_status = st.attendance
                }
                let obj = {date:e.date,status:atn_status}
                new_array.push(obj)
            })
        }
        let new_obj = {subject: s.title,attendance_data: new_array}
        attn_array.push(new_obj)
    })
    const [state,dispatchState] = useReducer(reducer,{
        data:attn_array
    })
    const render = (obj)=>{
        let {item,index} = obj
        let {subject,attendance_data} = item
        let n = attendance_data.length
        let n1 = attendance_data.filter(e=>e.status == 'present').length
        let p = Math.floor((n1/n)*100)
        let percent = `${p}%`
        return(
            <Block heading={subject} fun={()=>navigation.navigate('attendance_brk',{data:attendance_data,n,n1})} css={index < (state.data.length-1) && true} text={`Attendance: ${percent}`} bg width={percent}/>
        )
    }
    return (
        <View style={Style.screen}>
            <Header1 text='Attendance' fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <View style={Style.list_wrap}>
                    <FlatList showsVerticalScrollIndicator={false} overScrollMode="never" keyExtractor={(item,index)=>index.toString()} renderItem={render} data={state.data}/>
                </View>
            </View>
        </View>
    )
}