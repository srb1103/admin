import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity,FlatList, Alert} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import { ButtonCombo } from '../components/CTAButton'
import SelectList from 'react-native-dropdown-select-list'
import Colors from '../constants/Colors'
import * as DocumentPicker from 'expo-document-picker';

const UPDATE = 'UPDATE'

const stateReducer = (state,action)=>{
    switch(action.type){
        case UPDATE:
            let {name,value} = action
            return{...state,[name]:value}
    }
    return state
}
export default function Announcement_form(props){
    const {navigation,route} = props
    let id,title,text,date,to
    const {mode,fun1,fun2,data} = props.route.params
    const options = [
        {key: 'sdfsdf',value: 'Everyone'},
        {key: 'dsfdsf',value: 'Students'},
        {key: 'kdjskfl',value: 'Teachers'},
        {key: 'dljfkl',value: 'Non-Teaching Staff'},
    ]
    if(mode == 'edit'){
        id = data.id
        title = data.title
        date = data.date
        to = data.to
        text = data.text
    }
    const [state,dispatchState] = useReducer(stateReducer,{
        title: mode == 'edit' ? title : '',
        text: mode == 'edit' ? text : '',
        to: mode == 'edit' ? to : '',
    })
    const [selected, setSelected] = useState("");
    const frstFunction = ()=>{
        if(mode == 'edit'){
            Alert.alert('Are you sure?',`Do you really want to delete this announcement?`,[{text: 'Cancel'},{text: 'Delete',onPress:()=>{fun1(id); navigation.goBack()}}])
            
        }else{
            navigation.goBack()
        }
    }
    const save = ()=>{
        const {title,text,to} = state
        if(!title || !text || !to){
            Alert.alert('Error','All fields are required',[{text:'Okay'}])
            return
        }
        let date = new Date()
        let d = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
        let data = {...state,date: d}
        mode == 'edit' ? fun2({id,...state}) : fun2(data)
        navigation.goBack()
    }
    const handleChange = useCallback((name,value)=>{
        dispatchState({type: UPDATE,name,value})
    },[dispatchState])
    const setCat = (opt)=>{
        let chs = options.find(e=>e.key == opt).value
        handleChange('to',chs)
    }
    const selectF = async ()=>{
        let result = await DocumentPicker.getDocumentAsync({
            type:'application/pdf'
        });
        console.log(result);
    }
    return(
        <View style={Style.screen}>
            <Header1 text={mode == 'edit' ? title : 'New Announcement'} fun1={()=>navigation.goBack()} icon2="home-outline" img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
            <View style={Style.body_container}>
                <InputField name="title" value={state.title} onChangeFun={handleChange} label="Title" placeholder="Enter Title"/>
                <InputField name="text" value={state.text} onChangeFun={handleChange} label="Announcement" placeholder="Type something here..." nol={5} multiline/>
                <View style={{height: 15}}/>
                <Text style={Style.label}>Announcement To</Text>
                <SelectList setSelected={setSelected} data={options} onSelect={() => setCat(selected)} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Select option" searchPlaceholder="Search option..." dropdownStyles={{backgroundColor: Colors.white, borderColor: '#eee'}} 
                defaultOption={mode == 'edit' ? options.find(o=>o.value == to) : null}
                />
                <View style={{height: 40}}/>
                <ButtonCombo fun1={frstFunction} fun2={save} txt1={mode == 'edit' ? 'Delete' : 'Cancel'} txt2='Save'/>
            </View>
        </View>
    )
}