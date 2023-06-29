import React, {useReducer, useCallback} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native'
import InputField from './InputField'
import Colors from '../constants/Colors'
import Style from '../constants/Style'
import { Header1 } from './Header'
import { ButtonCombo } from './CTAButton'


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
export default function Update_component(props){
    const {data, fun} = props
    const {type, name, id} = data
    const {nav, fun1, fun2} = fun
    const [state, dispatchState] = useReducer(stateReducer,{
        name: name
    })
    const handleChange = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE,
            value
        })
    },[dispatchState])
    const save = ()=>{
        fun2(id,state.name)
        nav()
    }
    const del = ()=>{
        Alert.alert(`Are you sure?`,`Do you really want to delete ${state.name}?`,[{text: 'Cancel', style: 'cancel'},{text: 'Delete', onPress: ()=>{fun1(id); nav()}}])
    }
    return(
        <View style={Style.screen}>
            <Header1 text={`Update ${name}`} fun1={()=>nav()}/>
            <View style={Style.body_container}>
                <InputField label={`${type} Name`} onChangeFun={handleChange} name='name' placeholder={`Enter ${type} Name`} value={state.name}/>
                <View style={{height: 30}}/>
                <ButtonCombo fun1={del} fun2={save} txt1='Delete' txt2='Update'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})