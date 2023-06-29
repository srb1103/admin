import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, FlatList} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import Block from '../components/Block'
import InputField from '../components/InputField'
import { useSelector } from 'react-redux'

const FILTER = 'FILTER'
const stateReducer = (state, action)=>{
    switch(action.type){
        case FILTER:
            const {str, data} = action
            let clss = state.classes
            let array = data
            if(str){
                array = data.filter(el=>{
                    return el.name.match(str)
                })
            }
            return{
                ...state,
                classes: array
            }
    }
    return state
}

export default function Select_class(props){
    const {navigation, route} = props
    let {next,screen} = route.params
    const class_data = useSelector(state=>state.user.classes)
    const [state, dispatchState] = useReducer(stateReducer,{
        classes: class_data
    })
    const [srch, setSrch] = useState('')
    const renderClass = (item)=>{
        const {id, name} = item.item
        let index = item.index
        return(
            <Block heading={name} fun={()=>navigation.navigate(next,{screen,params:{class_name:name,class_id:id}})} css={index < (state.classes.length-1) && true}/>
        )
    }
    const filter = useCallback((value)=>{
        dispatchState({
            type: FILTER,
            str: value,
            data: class_data
        })
    },[dispatchState])
    const handleChange = (name, value)=>{
        setSrch(value)
    }
    useEffect(()=>{
        filter(srch)
    },[srch])
    return(
        <View style={Style.screen}>
            <Header1 text='Select Batch' fun1={()=>navigation.goBack()} icon2="home-outline" fun2={()=>navigation.navigate('home_page')}/>
            <View style={Style.body_container}>
                <InputField name="srch" value={srch} onChangeFun={handleChange} label="Search Class" placeholder="Enter class name..."/>
                <View style={Style.list_wrap}>
                    <FlatList data={state.classes} keyExtractor={(item, index)=>index.toString()} renderItem={renderClass} showsVerticalScrollIndicator={false} overScrollMode='never'/>
                </View>
            </View>
        </View>
    )
}