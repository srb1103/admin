import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, Text,FlatList, ActivityIndicator} from 'react-native'
import Colors from '../constants/Colors'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import CTABtn,{Btn} from '../components/CTAButton'
import Block from '../components/Block'
import InputField from '../components/InputField'
import { useDispatch, useSelector } from 'react-redux'
import { addClass,removeClass,updateClass } from '../store/actions'
import { db } from '../constants/config'
import {collection,doc,addDoc,deleteDoc,updateDoc} from 'firebase/firestore'
import { setNum } from '../constants/functions'

const ADD = 'ADD'
const UPDATE = 'UPDATE'
const REMOVE = 'REMOVE'
const FILTER = 'FILTER'
const stateReducer = (state, action)=>{
    switch(action.type){
        case ADD:
            let {id, name,fee} = action
            let obj = {id, name, total: 0,fee}
            let cls = state.classes
            cls = cls.concat(obj)
            return{
                ...state,
                classes: cls
            }
        case UPDATE:
            let {idf} = action
            name = action.name
            fee = action.fee
            let c = state.classes
            let ind = c.findIndex(i=>i.id == idf)
            c[ind].name = name
            c[ind].fee = fee
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

export default function Students_classes(props){
    const {navigation, route} = props
    const [loading,setLoading] = useState(false)
    const user = useSelector(state=>state.user)
    let {classes,students} = user
    let class_data = classes
    let uid = user.user.uid
    const [state, dispatchState] = useReducer(stateReducer,{
        classes: class_data
    })
    let dispatch = useDispatch()
    const [srch, setSrch] = useState('')
    const renderClass = (item)=>{
        const {id, name,fee} = item.item
        let n = students.filter(e=>e.classId == id).length
        let index = item.index
        let st = `${n} Students`
        if(n == 0){st = `No Student`}
        if(n == 1){st = '1 Student'}
        return(
            <Block heading={name} text={`${st}, Fee: ${setNum(fee)}`} fun={()=>navigation.navigate('class',{mode:'edit',clsID:id,name,fee,fun:{update:update_name,dlt:remove_class}})} css={index < (state.classes.length-1) && true}/>
        )
    }
    const add_class = useCallback(async(name,fee)=>{
        setLoading(true)
        try{
            let res = await addDoc(collection(db,'classes'),{
                instituteID:uid,name,fee
            })
            let id = res.id
            let data = {id,name,fee}
            dispatch(addClass(data))
            dispatchState({type:ADD,id: id,name,fee})
            setLoading(false)
        }catch(err){
            console.log(err)
            setLoading(false)
        }
    },[dispatchState])
    const update_name = useCallback(async(data)=>{
        setLoading(true)
        let {id,name,fee} = data
        try{
            await updateDoc(doc(db,'classes',id),{name,fee})
            dispatch(updateClass(data))
            dispatchState({type:UPDATE,idf: id,name,fee})
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    const remove_class = useCallback(async(id)=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'classes',id))
            dispatch(removeClass(id))
            dispatchState({type: REMOVE,id})
            setLoading(false)
        }catch(err){
            console.log(err)
            setLoading(false)
        }
    },[dispatchState])
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
            <Header1 text='Batches' fun1={()=>navigation.goBack()} img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
            {loading ? <View style={Style.ai_screen}>
                <ActivityIndicator size="large" color={Colors.blue}/>
            </View>
            :
            class_data.length > 0 ?
                <View style={Style.body_container}>
                    <InputField name="srch" value={srch} onChangeFun={handleChange} label="Search Class" placeholder="Enter class name..."/>
                    <View style={Style.list_wrap}>
                        <FlatList data={state.classes} keyExtractor={(item, index)=>index.toString()} renderItem={renderClass} showsVerticalScrollIndicator={false} overScrollMode='never'/>
                    </View>
                </View>
                :
                <View style={Style.ai_screen}>
                    <Text style={Style.label}>You haven't added any class</Text>
                    <Btn text="Add New" fun={()=>navigation.navigate('class',{mode:'create',fun:{create:add_class}})}/>
                </View>
            }
            {class_data.length > 0 && <CTABtn icon='add' fun={()=>navigation.navigate('class',{mode:'create',fun:{create:add_class}})}/>}
        </View>
    )
}