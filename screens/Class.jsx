import React, { useCallback, useReducer } from 'react'
import {View,Text,TouchableOpacity,ActivityIndicator, Alert} from 'react-native'
import InputField from '../components/InputField'
import { ButtonCombo } from '../components/CTAButton'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'

const UPDATE = 'UPDATE'
const stateReducer = (state,action)=>{
    switch(action.type){
        case UPDATE:
            let {name,value} = action
            return{...state,[name]:value}
    }
    return state
}
export default function Class(props){
    let {navigation,route} = props
    let {mode,clsID,name,fee,fun} = route.params
    let {create,update,dlt} = fun
    const [state,dispatchState] = useReducer(stateReducer,{
        name:mode == 'edit'?name:null,
        fee:mode == 'edit'?fee:null
    }) 
    const handleChange = useCallback((name,value)=>{
        dispatchState({type:UPDATE,name,value})
    },[dispatchState])
    const handleOne = ()=>{
        if(mode == 'edit'){
            Alert.alert('Are you sure?',`Do you really want to delete ${name}`,[{text:'No'},{text:'Yes, delete',onPress:()=>{
                dlt(clsID)
                navigation.goBack()
            }}])
        }else{
            navigation.goBack()
        }
    }
    const handleTwo = ()=>{
        let {name,fee} = state
        if(!name || !fee){
            Alert.alert('Error','All fields are required',[{text:'Okay'}])
            return
        }
        mode == 'edit'?update({id:clsID,name,fee}):create(name,fee)
        navigation.goBack()
    }
    return(
        <View style={Style.screen}>
            <Header1 text={mode == 'edit'?`Update ${name}`:'Create new class'} fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <InputField label='Batch Name' onChangeFun={handleChange} name='name' placeholder={`Enter Batch Name`} value={state.name}/>
                <InputField label='Batch Fee (for 1 session)' onChangeFun={handleChange} name='fee' placeholder={`Enter Batch Fee`} value={state.fee} keyboard="number-pad"/>
                <View style={{height: 30}}/>
                <ButtonCombo fun1={handleOne} fun2={handleTwo} txt1={mode == 'edit'?'Delete':'Cancel'} txt2={mode == 'edit'?'Update':'Save'}/>
            </View>
        </View>
    )
}