import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, Text,FlatList, ActivityIndicator,TouchableOpacity,StatusBar} from 'react-native'
import Colors from '../constants/Colors'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import CTABtn,{Btn} from '../components/CTAButton'
import Block from '../components/Block'
import { useDispatch, useSelector } from 'react-redux'
import { addSession,removeSession,updateSession } from '../store/actions'
import { db } from '../constants/config'
import {collection,doc,addDoc,deleteDoc,updateDoc} from 'firebase/firestore'
import { RFValue } from 'react-native-responsive-fontsize'

const ADD = 'ADD'
const UPDATE = 'UPDATE'
const REMOVE = 'REMOVE'
const stateReducer = (state, action)=>{
    switch(action.type){
        case ADD:
            const {id,title,uid} = action
            let obj = {id, title, instituteID:uid}
            let cls = state.classes
            cls = cls.concat(obj)
            return{
                ...state,
                classes: cls
            }
        case UPDATE:
            const {idf, value} = action
            let c = state.classes
            let ind = c.findIndex(i=>i.id == idf)
            c[ind].name = value
            return{
                ...state,
                classes: c
            }
        case REMOVE:
            const r_id = action.id
            let cl = state.classes
            cl = cl.filter(i=>i.id !== r_id)
            return{
                ...state,
                classes: cl
            }
    }
    return state
}

export default function Sessions(props){
    const {navigation} = props
    const [loading,setLoading] = useState(false)
    const user = useSelector(state=>state.user)
    let {sessions,session} = user
    let uid = user.user.uid
    const [state, dispatchState] = useReducer(stateReducer,{
        classes: sessions
    })
    let dispatch = useDispatch()
    const renderClass = (item)=>{
        const {id, title} = item.item
        let index = item.index
        let text = null
        if(id == session){
            text = 'Current'
        }
        return(
            <Block heading={title} fun={()=>navigation.navigate('update',{type: 'Session',name:title, id,fun:{fun1: remove_class, fun2: update_name}})} css={index < (state.classes.length-1) && true} text={text}/>
        )
    }
    const add_class = useCallback(async(title)=>{
        setLoading(true)
        try{
            let res = await addDoc(collection(db,'sessions'),{
                instituteID:uid,title
            })
            let id = res.id
            let data = {id,title}
            dispatch(addSession(data))
            dispatchState({type:ADD,id:id,title,uid})
            setLoading(false)
        }catch(err){
            console.log(err)
            setLoading(false)
        }
    },[dispatchState])
    const update_name = useCallback(async(id, value)=>{
        setLoading(true)
        try{
            await updateDoc(doc(db,'sessions',id),{title:value})
            dispatch(updateSession(id,value))
            dispatchState({type:UPDATE,idf: id,value})
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    const remove_class = useCallback(async(id)=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'sessions',id))
            dispatch(removeSession(id))
            dispatchState({type: REMOVE,id})
            setLoading(false)
        }catch(err){
            console.log(err)
            setLoading(false)
        }
    },[dispatchState])
    return(
        <View style={Style.screen}>
        <StatusBar backgroundColor={Colors.blue} hidden={false}/>
            <Header1 text='Sessions' fun1={()=>navigation.goBack()}/>
            {loading ? <View style={Style.ai_screen}>
                <ActivityIndicator size="large" color={Colors.blue}/>
            </View>
            :
            sessions.length > 0 ?
                <View style={Style.body_container}>
                    <View style={Style.list_wrap}>
                        <FlatList data={state.classes} keyExtractor={(item, index)=>index.toString()} renderItem={renderClass} showsVerticalScrollIndicator={false} overScrollMode='never'/>
                    </View>
                </View>
                :
                <View style={Style.ai_screen}>
                    <Text style={Style.label}>You haven't created any session</Text>
                    <Btn text="Create New" fun={()=>navigation.navigate('create',{type: 'Session', fun: add_class})}/>
                </View>
            }
            {sessions.length > 0 && <CTABtn fun={()=>navigation.navigate('create',{type: 'Session', fun: add_class})}/>}
            <View style={{position:'absolute',bottom:RFValue(30),alignItems:'center',justifyContent:'center',width:'100%'}}>
                <TouchableOpacity activeOpacity={.5} onPress={()=>navigation.navigate('change_session',{sessions,session,uid})} style={{backgroundColor:Colors.blue,paddingVertical:10,paddingHorizontal:20,borderRadius:10}}>
                    <Text style={{color:Colors.white,fontWeight:'bold',fontSize:RFValue(15)}}>Change Session</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}