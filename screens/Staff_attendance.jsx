import React, { useReducer, useCallback, useState } from 'react'
import {View, ActivityIndicator, Text,TouchableOpacity,Alert} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import CTABtn, { Btn } from '../components/CTAButton'
import Block from '../components/Block'
import {useSelector, useDispatch } from 'react-redux'
import Colors from '../constants/Colors'
import DateTimePicker from '@react-native-community/datetimepicker'

const ADD = 'ADD'

const stateReducer = (state, action)=>{
    switch (action.type){
        case ADD:
            let {obj} = action
            return{
                ...state,
                attendance_data: state.attendance_data.concat(obj)
            }            
        
    }
    return state
}

export default function StaffAttendance(props){
    let {navigation,route} = props
    let {array,type} = route.params
    let [loading,setLoading] = useState(false)
    let user = useSelector(state=>state.user)
    let {uid} = user.user
    let cat = type == 'teaching' ? 'Teacher Attendance' : 'Staff Attendance'
    let {teacher_attendance,staff_attendance,session} = user
    const [datePop, setDatePop] = useState(false)
    const [date, setDate] = useState(new Date())
    const [dateText, setDateText] = useState('Select Date')
    const [dateBlock, setDateBlock] = useState(null)
    const [state, dispatchState] = useReducer(stateReducer,{
        attendance_data: type === 'teaching' ? teacher_attendance : staff_attendance,
        staff_data: array
    })
    const addAttn = useCallback(obj=>{
        dispatchState({type:ADD,obj})
    },[dispatchState])
    function setDateFun(event, selectedDate){
        setDatePop(false)
        if(selectedDate && event.type == 'set'){
            let currentDate = selectedDate
            const tmpDate = new Date(currentDate)
            setDate(currentDate)
            const fullDate = `${tmpDate.getDate()}-${tmpDate.getMonth()+1}-20${tmpDate.getYear()-100}`
            setDateText(fullDate)
            setLoading(true)
            fetchAttendance(fullDate)
        }
    }
    const fetchAttendance = (date)=>{
        let res = state.attendance_data.find(e=>e.date == date)
        if(res){
            let {date,attendance} = res
            setDateBlock(<Block heading={date} text="See Attendance" fun={()=>{navigation.navigate('oldAttendance',{date,attendance,data:state.staff_data})}}/>)
        }else{Alert.alert('Not available.',`Attendance of ${date} is not available`,[{text:'Okay'},{text:'Mark Attendance',onPress:()=>{setTimeout(()=>{navigation.navigate('markAttendance',{date,type,data:state.staff_data,session,iid:uid,fun:addAttn})},200)}}])}
        setLoading(false)
        
    }
    const handleCTA = ()=>{
        let t = new Date()
        let today = `${t.getDate()}-${t.getMonth()+1}-20${t.getYear()-100}`
        let res = state.attendance_data.find(e=>e.date == today)
        if(res){
            let {attendance} = res
            navigation.navigate('oldAttendance',{date:today,attendance,data:state.staff_data})
        }else{
            navigation.navigate('markAttendance',{date: today,type,data:state.staff_data,session,iid:uid,fun:addAttn})
        }
    }
    if (loading){
        return(
            <View style={Style.screen}>
                <Header1 text={cat} fun1={()=>navigation.goBack()}/>
                <View style={Style.ai_screen}>
                    <ActivityIndicator size='large' color={Colors.blue}/>
                </View>
            </View>
        )
    }
    return(
        <View style={Style.screen}>
            <Header1 text={cat} fun1={()=>navigation.goBack()}/>
            {datePop  && <DateTimePicker
                testID = 'DateTimePicker'
                value={date}
                is24Hour = {false}
                display = 'default'
                onChange={setDateFun}
                maximumDate={new Date()}
            />}
            <View style={Style.body_container}>
                <View style={{paddingVertical: 10}}><Text style={Style.label}>See Previous Attendance</Text><TouchableOpacity activeOpacity={.7} onPress={()=>{setDatePop(true)}}><Text style={Style.input}>{dateText}</Text></TouchableOpacity></View>
                {loading && <View style={{alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large" color={Colors.blue}/></View>}
                {dateBlock}
            </View>
            <Btn text="Today's Attendance" fun={handleCTA}/>

        </View>
    )
}