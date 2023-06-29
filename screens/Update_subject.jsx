import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity,FlatList, Alert} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import { ButtonCombo } from '../components/CTAButton'
import SelectList from 'react-native-dropdown-select-list'
import Colors from '../constants/Colors'
import { useSelector } from 'react-redux'

const UPDATE = 'UPDATE'
const stateReducer = (state, action)=>{
    switch (action.type){
        case UPDATE:
            let {name, value} = action
            return{
                ...state,
                [name]: value
            }
    }
    return state
}

export default function Update_subject(props){
    const {navigation, route} = props
    const {id, name, class_id, class_name, classes} = route.params
    const {del, update} = route.params.fun
    const [state, dispatchState] = useReducer(stateReducer, {
        name: name,
        class_id: class_id,
        class_name: class_name
    })
    const handleChange = useCallback((name, value)=>{
        dispatchState({
            type:  UPDATE,
            name, 
            value
        })
    },[dispatchState])
    const setCls = (opt)=>{
        let cl = classes.filter(e=>e.key == opt)
        let {key, value} = cl[0]
        handleChange('class_id', key)
        handleChange('class_name', value)
    }
    const [selected, setSelected] = useState("");
    const save_fun = ()=>{
        if(!state.name || !state.class_id){
            Alert.alert('Error','All fields are required.',[{text: 'Okay'}])
            return
        }
        update(id, state.name, state.class_id, state.class_name)
        navigation.goBack()
    }
    const del_fun = ()=>{
        Alert.alert('Are you sure?',`Do you really want to delete ${name}?`,[{text: 'Cancel'},{text: 'Delete', onPress: ()=>{del(id); navigation.goBack()}}])
    }
    return(
        <View style={Style.screen}>
            <Header1 text={`Update Subject`} fun1={()=>navigation.goBack()} icon2="home-outline" fun2={()=>navigation.navigate('home_page')}/>
            <View style={Style.body_container}>
                <InputField name="name" value={state.name} onChangeFun={handleChange} label="Subject Name" placeholder="Enter subject name..."/>
                <View style={{height: 5}}/>
                <Text style={Style.label}>Select Class</Text>
                <SelectList setSelected={setSelected} data={classes} onSelect={() => setCls(selected)} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Select Class" searchPlaceholder="Search class..." dropdownStyles={{backgroundColor: Colors.white, borderColor: '#eee'}} defaultOption={{key: class_id, value: class_name}}/>
                <View style={{height: 40}}/>
                <ButtonCombo fun1={del_fun} fun2={save_fun} txt1='Delete' txt2='Update'/>
            </View>
        </View>
    )
}