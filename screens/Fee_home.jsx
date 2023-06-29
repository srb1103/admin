import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, FlatList,Text,StyleSheet,ActivityIndicator} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import CTABtn,{Btn} from '../components/CTAButton'
import Block from '../components/Block'
import InputField from '../components/InputField'
import { useSelector, useDispatch } from 'react-redux'
import { addFee, addPeriod, removeFee, removePeriod, updatePeriod } from '../store/actions'
import { db } from '../constants/config'
import {collection,doc,updateDoc,deleteDoc,addDoc} from 'firebase/firestore'
import Colors from '../constants/Colors'
import {setNum} from '../constants/functions'

const COLLECT = 'COLLECT'
const FILTER = 'FILTER'
const REMOVE = 'REMOVE'
const reducer = (state,action)=>{
    switch(action.type){
        case COLLECT:
            let {id,amount,data} = action
            let ar = state.data
            let i = ar.findIndex(e=>e.id == id)
            let am = ar[i].amt+parseInt(amount)
            ar[i].amt = am
            ar[i].arr.push(data)
            return{...state,data:ar,filtered:ar}

        case FILTER:
            let {value} = action
            ar = state.data
            let fil = value ? ar.filter(a=>a.name.match(value)) : ar
            return{...state,filtered:fil}
        case REMOVE:
            id = action.id
            amount = action.amount
            let {studentID} = action
            ar = state.data
            i = ar.findIndex(e=>e.id == studentID)
            let amt = ar[i].amt
            ar[i].amt = amt - parseInt(amount)
            ar[i].arr.filter(e=>e.id !== id)
            return{...state,data:ar,filtered:ar}
    }
    return state
}
export default function Fee_home(props){
    let {navigation,route} = props
    let {class_name,class_id} = route.params
    let user = useSelector(state=>state.user)
    const [loading,setLoading] = useState(false)
    let [srch,setSrch] = useState(null)
    let {students,fee_collection,classes} = user
    let st = students.filter(e=>e.classId == class_id)
    let st_array = []
    let dispatch = useDispatch()
    let total_fee = classes.find(e=>e.id == class_id).fee
    let fc = fee_collection.filter(e=>e.classId == class_id)
    st.forEach((s=>{
        let arr = fc.filter(e=>e.studentID == s.id)
        let amt = 0
        arr.forEach(a=>{
            amt = amt+parseInt(a.amount)
        })
        let obj = {id:s.id,name:s.name,rollNo:s.rollNo,arr,amt,img:s.img_url}
        st_array.push(obj)
    }))
    let [state,dispatchState] = useReducer(reducer,{
        data: st_array,
        filtered:st_array
    })
    const removeTxn = useCallback((id,amount,studentID)=>{
        dispatch(removeFee(id))
        dispatchState({type:REMOVE,id,amount,studentID})
    },[dispatchState])
    const addTxn = useCallback(data=>{
        let {amount,studentID} = data
        dispatch(addFee(data))
        dispatchState({type:COLLECT,id:studentID,amount,data})
    },[dispatchState])
    const render = (item)=>{
        let index = item.index
        let {id,rollNo,name,arr,amt,img} = item.item
        let percent = Math.floor((amt/total_fee)*100)
        return(
            <Block heading={name} fun={()=>navigation.navigate('fee_view',{id,rollNo,name,arr,amt,total_fee,class_name,class_id,img,fun:{removeTxn,addTxn}})} css={index < (state.data.length-1) && true} text={`Amount Paid: ${setNum(amt)}`} bg width={`${percent}%`}/>
        )
    }
    const filter = useCallback((value)=>{
        dispatchState({
            type: FILTER,
            value,
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
            <Header1 text={class_name} fun1={()=>navigation.goBack()} img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={Colors.blue}/></View>:
            <View style={Style.body_container}>
                <InputField name="srch" value={srch} onChangeFun={handleChange} label="Search Student" placeholder="Enter name..."/>
                <View style={Style.list_wrap}>
                    <FlatList data={state.filtered} showsVerticalScrollIndicator={false} overScrollMode='never' keyExtractor={(item,index)=>index.toString()} renderItem={render}/>
                </View>
            </View>
            }
        </View>
    )
}