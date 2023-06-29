import React from 'react'
import {Text, View} from 'react-native'
import Style from '../constants/Style'
import {Header1} from '../components/Header'
import Colors from '../constants/Colors'
import { Calendar } from 'react-native-calendars'
import { RFValue } from 'react-native-responsive-fontsize'
import { useSelector } from 'react-redux'


export default function AttendanceBreakdownStaff(props){
    let {navigation,route} = props
    let {type,id} = route.params
    let user = useSelector(state=>state.user)
    let {teacher_attendance,staff_attendance} = user
    let data = type == 'teaching' ? teacher_attendance : staff_attendance
    let marked = {}
    let ttl = 0
    let present = 0
    data.forEach(s=>{
        let {date,attendance} = s
        let arr = JSON.parse(attendance)
        let attn = arr.find(e=>e.id == id)
        if(attn){
            let status = attn.attendance
            ttl += 1
            if(status == 'present'){
                present += 1
            }
            let d = date.split('-')
            let m = d[1]
            let dt = d[0]
            if(m<9){m = `0${m}`}
            if(dt<9){dt = `0${dt}`}
            let finalDate = `${d[2]}-${m}-${dt}`
            marked = {...marked,[finalDate]:{selected: true, selectedColor: status=='present'?Colors.blue:Colors.red}}
        }
        
    })
    let date = new Date()
    let m = date.getMonth()+1
    let dt = date.getDate()
    if(m<9){m = `0${m}`}
    if(dt<9){dt = `0${dt}`}
    let d = `${date.getFullYear()}-${m}-${dt}`
    let percent = Math.round((present/ttl)*100)
    return(
        <View style={Style.screen}>
            <Header1 text='Attendance Breakdown' fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <Calendar maxDate={d} hideExtraDays={true} markedDates={marked} markingType={'custom'} horizontal={true}/>
                <Text style={{textAlign:'center',fontSize:RFValue(15),marginTop:20,color:Colors.blue,fontWeight:'bold'}}>Attendance: {`${percent}%`}</Text>
            </View>
        </View>
    )
}