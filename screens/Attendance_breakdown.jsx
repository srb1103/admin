import React from 'react'
import {Text, View} from 'react-native'
import Style from '../constants/Style'
import {Header1} from '../components/Header'
import Colors from '../constants/Colors'
import { Calendar } from 'react-native-calendars'
import { RFValue } from 'react-native-responsive-fontsize'


export default function Attendance_breakdown(props){
    let {navigation,route} = props
    let {data,n,n1} = route.params
    let marked = {}
    data.forEach(s=>{
        let {date,status} = s
        let d = date.split('-')
        let m = d[1]
        let dt = d[0]
        if(m<9){m = `0${m}`}
        if(dt<9){dt = `0${dt}`}
        let finalDate = `${d[2]}-${m}-${dt}`
        marked = {...marked,[finalDate]:{selected: true, selectedColor: status=='present'?Colors.blue:Colors.red}}
    })
    let date = new Date()
    let m = date.getMonth()+1
    let dt = date.getDate()
    if(m<9){m = `0${m}`}
    if(dt<9){dt = `0${dt}`}
    let d = `${date.getFullYear()}-${m}-${dt}`
    return(
        <View style={Style.screen}>
            <Header1 text='Attendance Breakdown' fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <Calendar maxDate={d} hideExtraDays={true} markedDates={marked} markingType={'custom'} horizontal={true}/>
                <Text style={{textAlign:'center',fontSize:RFValue(15),marginTop:20,color:Colors.blue,fontWeight:'bold'}}>Present: {`${n1} days out of ${n} days.`}</Text>
            </View>
        </View>
    )
}