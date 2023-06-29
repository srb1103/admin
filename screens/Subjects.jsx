import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, Text, StyleSheet, ActivityIndicator,FlatList,TouchableOpacity, Dimensions} from 'react-native'
import Colors from '../constants/Colors'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import CTABtn,{Btn} from '../components/CTAButton'
import Block from '../components/Block'
import InputField from '../components/InputField'
import { addSubject,updateSubject,removeSubject } from '../store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../constants/config'
import {collection,doc,addDoc,updateDoc,deleteDoc} from 'firebase/firestore'
import { RFValue } from 'react-native-responsive-fontsize'
let {height} = Dimensions.get('window')
const ADD = 'ADD'
const UPDATE = 'UPDATE'
const REMOVE = 'REMOVE'
const FILTER = 'FILTER'
const SET = 'SET'
const TOGGLE = 'TOGGLE'
const stateReducer = (state, action)=>{
    switch(action.type){
        case ADD:
            const {id, title, class_id} = action
            let sbj = {id, title, class_id}
            let subs = state.subjects
            return{
                ...state,
                subjects: subs.concat(sbj)
            }
        case FILTER:
            let {subjects,srch} = state
            let clasID = state.class_id
            let q_array = srch != '' ? subjects.filter(e=>e.title.match(srch)) : subjects
            q_array = clasID == 'all' ? q_array : q_array.filter(e=>e.class_id.includes(clasID))
            return {...state,filtered_subjects:q_array}
        case REMOVE:
            let del_id = action.id
            let sbjts = state.subjects
            sbjts = sbjts.filter(e=>e.id !== del_id)
            return{
                ...state,
                subjects: sbjts
            }
        case UPDATE:
            let {idf, CLS_ID, name} = action
            let s = state.subjects
            let s1 = s.findIndex(e=>e.id == idf)
            s[s1].title = name
            s[s1].class_id = CLS_ID
            return{
                ...state,
                subjects: s
            }
        case SET:
            let {key,value} = action
            return {...state,[key]:value}
        case TOGGLE:
            let clsID = action.id
            return {...state,class_id:clsID}
        
    }
    return state
}
export default function Subjects(props){
    const {navigation, route} = props
    const [loading,setLoading] = useState(false)
    const user = useSelector(state=>state.user)
    let {classes,subjects} = user
    let uid = user.user.uid
    const dispatch = useDispatch()
    
    const [state, dispatchState] = useReducer(stateReducer, {
        subjects,classes,filtered_subjects:subjects,class_id:'all',srch:''
    })
    const handleSet = useCallback((key,value)=>{
        dispatchState({type:SET,key,value})
        if(key == 'srch'){
            filterData()
        }
    },[dispatchState])
    // useEffect(()=>{
    //     let clsID = classes ? classes[0].id : ''
    //     let array = subjects.filter(e=>e.class_id.includes(clsID))
    //     handleSet('class_id','all')
    //     handleSet('filtered_subjects',subjects)
    // },[])
    const add_subject = useCallback(async(name,class_id)=>{
        setLoading(true)
        try{
            let res = await addDoc(collection(db,'subjects'),{
                instituteID:uid,name,class_id
            })
            let id = res.id
            let data = {id,name,class_id}
            dispatch(addSubject(data))
            dispatchState({
                type:ADD,
                id: id,
                title: name,
                class_id
            })
            setLoading(false)
        }catch(err){console.log(err); setLoading(false)}
    })
    const update_subject = useCallback(async(id, value, class_id)=>{
        setLoading(true)
        try{
            await updateDoc(doc(db,'subjects',id),{
                name:value,class_id
            })
            dispatch(updateSubject(id,value,class_id))
            dispatchState({
                type:UPDATE,
                idf: id,
                name: value,
                CLS_ID:class_id,
            })
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    const remove_subject = useCallback(async(id)=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'subjects',id))
            dispatch(removeSubject(id))
            dispatchState({
                type: REMOVE,
                id
            })
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
        
    },[dispatchState])
    const renderSubject = (item)=>{
        let index = item.index
        let {title, id, class_id} = item.item
        let class_name = ''
        let ln = state.classes.length - 1
        class_id.forEach((c,i)=>{
            let cl = state.classes.find(e=>e.id === c)
            let com = (i === ln ||i === 0) ? '':', '
            if(cl){
                class_name = `${class_name}${com}${cl.name}`
            }
        })
        return(
            <Block heading={title} fun={()=>navigation.navigate('create_subject',{mode:'edit',courseID:id, name: title, class_id, classes: state.classes,fun:{del: remove_subject, update: update_subject}})} css={index < (state.filtered_subjects.length-1) && true} text={`Class: ${class_name}`}/>
        )
    }
    function renderClass(itm){
        let {index,item} = itm
        let {id,name} = item
        return (
            <TouchableOpacity activeOpacity={.5} onPress={()=>{toggleClass(id)}} style={{padding:5,paddingHorizontal:14,borderRadius:20,backgroundColor:state.class_id == id?Colors.blue:Colors.white,alignItems:'center',justifyContent:'center',marginLeft:index==0?15:0,marginRight:5,borderWidth:1,borderColor:state.class_id == id?Colors.blue:'#eee'}}>
                <Text style={{color: state.class_id == id?Colors.white:Colors.lblack,textAlign:'center',fontSize:RFValue(15)}}>{name}</Text>
            </TouchableOpacity>
        )
    }
    const toggleClass = useCallback(id=>{
        dispatchState({type:TOGGLE,id})
        filterData()
    },[dispatchState])
    const filterData = useCallback(()=>{
        dispatchState({type:FILTER,data:state.subjects})
    },[dispatchState])
    return(
        <View style={Style.screen}>
            <Header1 text={'Courses'} fun1={()=>navigation.goBack()} img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
            {loading ? <View style={Style.ai_screen}>
                <ActivityIndicator size="large" color={Colors.blue}/>
            </View>
            :
            <>
            <View style={{paddingVertical:3,marginTop:8}}>
                <FlatList data={[{id:'all',name:'All Classes'},...state.classes]} renderItem={renderClass} horizontal keyExtractor={(item,index)=>index.toString()} showsHorizontalScrollIndicator={false} overScrollMode='never'/>
            </View>
            {state.subjects.length > 0 ?
                <View style={{...Style.body_container,maxHeight:height*.8}}>
                    <InputField name="srch" value={state.srch} onChangeFun={handleSet} label="Search Subject" placeholder="Enter subject name..."/>
                    <View style={Style.list_wrap}>
                        <FlatList data={state.filtered_subjects} keyExtractor={(item, index)=>index.toString()} renderItem={renderSubject} showsVerticalScrollIndicator={false} overScrollMode='never'/>
                    </View>
                </View>
                :
                <View style={Style.ai_screen}>
                    <Text style={Style.label}>You haven't added any subject</Text>
                    <Btn text="Add New" fun={()=>navigation.navigate('create_subject', {mode:'add',classes:state.classes,fun:{add:add_subject}})}/>
                </View>}
            </>
            }
            {state.filtered_subjects.length > 0 && <CTABtn icon='add' fun={()=>navigation.navigate('create_subject', {mode:'add',classes:state.classes,fun: {add:add_subject}})}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    
})