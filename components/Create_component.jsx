import React, {useReducer, useCallback} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native'
import InputField from '../components/InputField'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import { ButtonCombo } from '../components/CTAButton'

const UPDATE = 'UPDATE'
const stateReducer = (state, action)=>{
    switch (action.type){
        case UPDATE:
            let value = action.value
            return{
                ...state,
                name: value
            }
    }
}
export default function Create_component(props){
    const {data, fun} = props
    const {type} = data
    const {nav, create} = fun
    const [state, dispatchState] = useReducer(stateReducer,{
        name: ''
    })
    const handleChange = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE,
            value
        })
    },[dispatchState])
    const save = ()=>{
        create(state.name)
        nav()
    }
    return(
        <View style={Style.screen}>
            <Header1 text={`Create new ${type}`} fun1={nav}/>
            <View style={Style.body_container}>
                <InputField label={`${type} Name`} onChangeFun={handleChange} name='name' placeholder={`Enter ${type} Name`} value={state.name}/>
                <View style={{height: 30}}/>
                <ButtonCombo fun1={nav} fun2={save} txt1='Cancel' txt2='Save'/>
            </View>
        </View>
    )
}