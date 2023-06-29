import React, { useCallback, useEffect, useReducer, useState } from 'react'
import {View,Text,Alert,TouchableOpacity} from 'react-native'
import Style from '../constants/Style'
import Colors from '../constants/Colors'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import { ButtonCombo } from '../components/CTAButton'
import DateTimePicker from '@react-native-community/datetimepicker'


const UPDATE = 'UPDATE'
const reducer = (state,action)=>{
    switch(action.type){
        case UPDATE:
            let {name,value} = action
            return{...state,[name]:value}
    }
    return state
}

export default function Fee_form(props){
    let {navigation,route} = props
    let {name,save} = route.params
    const [date, setDate] = useState(new Date())
    let [showDate,setShowDate] = useState(false)
    let [state,dispatchState] = useReducer(reducer,{
        date:'',
        amount:'',
        remarks:''
    })
    function setDateFun(event, selectedDate){
        setShowDate(false)
        if(selectedDate && event.type == 'set'){
            let currentDate = selectedDate
            const tmpDate = new Date(currentDate)
            setDate(currentDate)
            const fullDate = `${tmpDate.getDate()}-${tmpDate.getMonth()+1}-20${tmpDate.getYear()-100}`
            handleChange('date',fullDate)
        }
    }
    useEffect(()=>{
        const tmpDate = new Date()
        const fullDate = `${tmpDate.getDate()}-${tmpDate.getMonth()+1}-20${tmpDate.getYear()-100}`
        handleChange('date',fullDate)
    },[])
    const handleChange = useCallback((name,value)=>{
        dispatchState({type:UPDATE,name,value})
    },[dispatchState])
    const handleSave = ()=>{
        let {date,amount,remarks} = state
        if(!date || !amount || !remarks){
            Alert.alert('Error','All fields are required',[{text:'Okay'}])
            return
        }
        save(state)
        navigation.goBack()
    }
    return(
        <View style={Style.screen}>
            <Header1 text={`Collect fee from ${name}`} fun1={()=>navigation.goBack()}/>
            {showDate  && <DateTimePicker
                testID = 'DateTimePicker'
                value={date}
                is24Hour = {false}
                display = 'default'
                onChange={setDateFun}
                maximumDate={new Date()}
            />}
            <View style={Style.body_container}>
                <View style={{paddingVertical: 10}}><Text style={Style.label}>Date</Text><TouchableOpacity activeOpacity={.7} onPress={()=>{setShowDate(true)}}><Text style={{...Style.input,paddingVertical:20}}>{state.date}</Text></TouchableOpacity></View>
                <InputField name="amount" value={state.amount} onChangeFun={handleChange} label="Amount" placeholder="Enter Amount" keyboard="number-pad"/>
                <InputField name="remarks" value={state.text} onChangeFun={handleChange} label="Remarks" placeholder="ex. for July 2023"/>
                <View style={{height: 40}}/>
                <ButtonCombo fun1={()=>{navigation.goBack()}} fun2={handleSave} txt1='Cancel' txt2='Save'/>
            </View>
        </View>
    )
}
