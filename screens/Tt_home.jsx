import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, FlatList,Text,StyleSheet,ActivityIndicator} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import CTABtn,{Btn} from '../components/CTAButton'
import Block from '../components/Block'
import InputField from '../components/InputField'
import { useSelector, useDispatch } from 'react-redux'
import { addPeriod, removePeriod, updatePeriod } from '../store/actions'
import { db } from '../constants/config'
import {collection,doc,updateDoc,deleteDoc,addDoc} from 'firebase/firestore'
import Colors from '../constants/Colors'

const ADD_PERIOD = 'ADD_PERIOD'
const DELETE_PERIOD = 'DELETE_PERIOD'
const UPDATE_PERIOD = 'UPDATE_PERIOD'
const stateReducer = (state,action)=>{
    switch(action.type){
        case ADD_PERIOD:
            let period = action.data
            let periods = state.periods.concat(period)
            periods = periods.sort(
                (p1, p2) => (p1.period > p2.period) ? 1 : (p1.period < p2.period) ? -1 : 0)
            return {...state,periods}
        case UPDATE_PERIOD:
            period = action.data
            let id = period.id
            periods = state.periods
            let i = periods.findIndex(e=>e.id == id)
            periods[i] = period
            periods = periods.sort(
                (p1, p2) => (p1.period > p2.period) ? 1 : (p1.period < p2.period) ? -1 : 0)
            return{...state,periods}
        case DELETE_PERIOD:
            id = action.id
            periods = state.periods.filter(e=>e.id !== id)
            return{...state,periods}

    }
    return state
}
export default function Tt_home(props){
    let {navigation,route} = props
    let {class_name,class_id} = route.params
    let user = useSelector(state=>state.user)
    const [loading,setLoading] = useState(false)
    let subj = user.subjects
    let {session} = user
    let uid = user.user.uid
    let dispatch = useDispatch()
    const [state,dispatchState] = useReducer(stateReducer,{
        periods:user.timetable.filter(e=>e.class_id == class_id),
        subjects:user.subjects.filter(e=>e.class_id == class_id)
    })
    const add_period = data=>{
        let res = false
        let isThere = state.periods.filter(e=>e.period == data.period)
        if(isThere.length == 0){
            res = true
            addNewPeriod(data)
        }
        return res
    }
    const updateSubject = useCallback(async data=>{
        setLoading(true)
        let doc_id = data.id
        let {days,subjects,time} = data
        try{
            await updateDoc(doc(db,'timetable',doc_id),{
                days,subjects,time
            })
            dispatch(updatePeriod({class_id,...data}))
            dispatchState({type:UPDATE_PERIOD,data})
            setLoading(false)
            return true
        }catch(err){console.log(err);setLoading(false)}
        
    },[dispatchState])
    const remove_period = useCallback(async(id)=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'timetable',id))
            dispatch(removePeriod(id,class_id))
            dispatchState({type:DELETE_PERIOD,id})
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    const addNewPeriod = useCallback(async data=>{
        setLoading(true)
        try{
            let res = await(addDoc(collection(db,'timetable'),{instituteID:uid,...data,class_id,session}))
            let id = res.id
            data = {id,...data}
            dispatch(addPeriod({class_id,...data}))
            dispatchState({type:ADD_PERIOD,data})
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    const renderPeriod = (item)=>{
        let per = item.item
        let sub = ''
        per.subjects.forEach((s,i)=>{
            let com = ', '
            if(i == per.subjects.length || i==0){
                com = ''
            }
            let sub_id = s.subjectID
            let sub_name = subj.find(e=>e.id == sub_id).title
            sub = `${sub}${com}${sub_name}`
        })
        return(
            <Block heading={`${per.period}. ${sub}`} text={`Timing: ${per.time.from} - ${per.time.to}`} fun={()=>navigation.navigate('tt_form',{addFun:updateSubject,class_id,subjects:state.subjects,mode:'edit',user_data:user,period:per,delFun:remove_period})} css={item.index < (state.periods.length-1) && true}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header1 text={class_name} fun1={()=>navigation.goBack()} img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={Colors.blue}/></View>:
            <View style={Style.body_container}>
                {state.periods.length == 0 && <View style={styles.alert_wrap}>
                    <Text style={Style.label}>No period added</Text>
                    <Btn text="Add Period" fun={()=>{navigation.navigate('tt_form',{addFun:add_period,class_id,subjects:state.subjects,mode:'add',user_data:user})}}/>
                </View>}
                {state.periods.length > 0 && <View style={Style.list_wrap}>
                    <Text style={Style.list_heading}>Periods</Text>
                    <FlatList data={state.periods} showsVerticalScrollIndicator={false} overScrollMode='never' keyExtractor={(item,index)=>index.toString()} renderItem={renderPeriod}/>
                </View>}
            </View>
            }
            <CTABtn icon='add' fun={()=>{navigation.navigate('tt_form',{addFun:add_period,class_id,subjects:state.subjects,mode:'add',user_data:user})}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    alert_wrap:{borderWidth:1,borderColor:'#eee',borderRadius: 10,padding:20,alignItems:'center'}
})