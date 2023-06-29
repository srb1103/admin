import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity,FlatList, Alert, Dimensions} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import { ButtonCombo } from '../components/CTAButton'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
let {width} = Dimensions.get('window')
// import SelectList from 'react-native-dropdown-select-list'
// import Colors from '../constants/Colors'
// import { useSelector } from 'react-redux'

const ADD = 'ADD'
const TOGGLE = 'TOGGLE'

const stateReducer = (state, action)=>{
    switch (action.type){
        case ADD:
            let {name, value} = action
            return{
                ...state,
                [name]: value
            }
        case TOGGLE:
            let {id} = action
            let {class_id} = state
            let isThere = class_id.includes(id)
            let array = isThere ? class_id.filter(e=>e != id) : class_id.concat(id)
            return{
                ...state,class_id:array
            }
        default: return state
    }
}
export default function Create_subject(props){
    const {navigation, route} = props
    const {fun,classes,mode,class_id,name,courseID} = route.params
    const {del, update, add} = fun
    const [state, dispatchState] = useReducer(stateReducer, {
        name: mode == 'add'?'':name,class_id:mode == 'add'?[]:class_id
    })
    const handleChange = useCallback((name, value)=>{
        dispatchState({
            type: ADD,
            name, 
            value
        })
    },[dispatchState])
    const save = ()=>{
        let {name,class_id} = state
        let error = ''
        if(!name){
            error = 'Subject Name is required'
        }
        if(class_id.length == 0){
            error = 'Select atleast one class'
        }
        if(error != ''){
            Alert.alert('Error',`${error}`,[{text:'Okay'}])
        }else{
            mode == 'add' ? add(name,class_id) : update(courseID,name,class_id)
            navigation.goBack()
        }
    }
    function renderClass(cls){
        let {item} = cls
        let {id,name} = item
        let isThere = state.class_id.includes(id)
        return (
            <TouchableOpacity activeOpacity={.5} onPress={()=>toggleSelection(id)} style={{...styles.class_wrap,borderColor:isThere?Colors.blue:'#eee'}}><Text style={{...styles.class_text,color:isThere?Colors.blue:Colors.lblack}}>{name}</Text></TouchableOpacity>
        )
    }
    const toggleSelection = useCallback(id=>{
        dispatchState({type:TOGGLE,id})
    },[dispatchState])
    const del_fun = ()=>{
        Alert.alert('Are you sure?',`Do you really want to delete ${name}?`,[{text: 'Cancel'},{text: 'Delete', onPress: ()=>{del(courseID); navigation.goBack()}}])
    }
    return(
        <View style={Style.screen}>
            <Header1 text={mode == 'add'?'Add New Course':`Edit ${name}`} fun1={()=>navigation.goBack()} icon2="home-outline" fun2={()=>navigation.navigate('home_page')}/>
            <View style={Style.body_container}>
                <InputField name="name" value={state.name} onChangeFun={handleChange} label="Course Name" placeholder="Enter course name..."/>
                <View style={{height: 5}}/>
                <View style={styles.msWrap}>
                    <Text style={Style.label}>Select Class(es)</Text>
                    <FlatList data={classes} keyExtractor={(item,index)=>index.toString()} renderItem={renderClass} showsHorizontalScrollIndicator={false} overScrollMode='never' numColumns={2}/>
                </View>
                {mode == 'add' ? <ButtonCombo fun1={()=>navigation.goBack()} fun2={save} txt1='Cancel' txt2='Save'/> : <ButtonCombo fun1={del_fun} fun2={save} txt1='Delete' txt2='Update'/>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    msWrap:{marginVertical: 5,marginBottom:20},
    class_wrap:{borderRadius:5,borderWidth:2,alignItems:'center',justifyContent:'center',margin:2,padding:10,height:70,width:width*.45},
    class_text:{fontSize:RFValue(14)}
})