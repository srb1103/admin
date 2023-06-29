import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, ActivityIndicator,FlatList, Text} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import CTABtn, { Btn } from '../components/CTAButton'
import Block from '../components/Block'
import InputField from '../components/InputField'
import {useSelector, useDispatch } from 'react-redux'
import { addNewStaff, removeStaff } from '../store/actions'
import Teacher,{NT_Staff} from '../models/staff'
import { db } from '../constants/config'
import { collection,doc,addDoc, updateDoc } from 'firebase/firestore'
import Colors from '../constants/Colors'

const ADD = 'ADD'
const REMOVE = 'REMOVE'
const FILTER = 'FILTER'

const stateReducer = (state, action)=>{
    switch (action.type){
        case FILTER:
            let {q, data} = action
            let array = data
            if(q !== ''){
                array = data.filter(e=>e.name.match(q))
            }
            return{
                ...state,
                data: array
            }
        case ADD:
            let obj = action.data
            return{
                ...state,
                data: state.data.concat(obj)
            }            
        case REMOVE:
            let id = action.id
            let t = state.data
            t = t.filter(e=>e.id !== id)
            return{
                ...state,
                data: t
            }
    }
    return state
}
export default function Staff_home(props){
    const {navigation, route} = props
    const {type} = route.params
    const [srch, setSrch] = useState('')
    const [loading,setLoading] = useState(false)
    let cat = type == 'teaching' ? 'Teaching Staff' : 'Non Teaching Staff'
    let user_data = useSelector(state=>state.user)
    let {uid,logoURL,mail,contact,name} = user_data.user
    let iName = name
    const non_teaching = user_data.staff.non_teaching
    const teaching = user_data.staff.teaching
    const tc = user_data.staff.teaching_category
    const ntc = user_data.staff.non_teaching_category
    let dispatch = useDispatch()
    const [state, dispatchState] = useReducer(stateReducer,{
        data: type == 'teaching' ? teaching : non_teaching,
        categories: type == 'teaching' ? tc : ntc
    })
    const addnew_staff = useCallback( async (name, category,email,phone,img_url)=>{
        let d = new Date()
        let i_src = 'https://i.imgur.com/o28Do8L.png';
        if(img_url !== ''){i_src = img_url}
        let date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
        setLoading(true)
        let data = type == 'teaching' ? {
            name,phone,email,category,joiningDate:date,subjects_allotted:[],img_url:i_src,instituteID:uid,password:''
        } : {
            name,phone,email,category,joiningDate:date,img_url:i_src,instituteID:uid
        }
        let col = type == 'teaching' ? 'teachers' : 'staff'
        try {
            let res = await addDoc(collection(db,col),data)
            let id = res.id
            if(type == 'teaching'){
                await updateDoc(doc(db,'teachers',id),{password:id})
                await fetch(`https://emezy.in/LMS_api/send_lms_registration_mail.php?type=teacher_registration&name=${name}&iLogo=${logoURL}&iName=${iName}&email=${email}&id=${id}&mail=${mail}&contact=${contact}`)
            }
            dispatchState({
                type: ADD,
                data: type == 'teaching' ? new Teacher(id, name, phone,email,date,category,[],i_src) : new NT_Staff(id, name, phone,email,date,category,i_src)
            })
            let obj = {id,name,phone,email,category,joiningDate: date,type: type, img_url:i_src}
            dispatch(addNewStaff(obj))
            setLoading(false)
        }catch(err){
            console.log(err)
        }
    },[dispatchState])
    const remove_staff = useCallback(id=>{
        dispatchState({
            type: REMOVE,
            id
        })
        dispatch(removeStaff(id, type))
    },[dispatchState])
    const filter = useCallback((value)=>{
        dispatchState({
            type: FILTER,
            q: value,
            data: type == 'teaching' ? teaching : non_teaching 
        })
    },[dispatchState])
    useEffect(()=>{
        filter(srch)
    },[srch])
    const renderStaff = (staff)=>{
        let {index,item} = staff
        let {name,category} = item
        return(
            <Block heading={name} fun={()=>navigation.navigate('staff_view',{data: item, category_options: state.categories, type,fun1:remove_staff})} css={index < (state.data.length-1) && true} text={`${category}`}/>
        )
    }
    if (loading){
        return(
            <View style={Style.screen}>
                <Header1 text={cat} fun1={()=>navigation.goBack()}/>
                <View style={Style.ai_screen}>
                    <ActivityIndicator size='large' color={Colors.blue}/>
                </View>
            </View>
        )
    }
    return(
        <View style={Style.screen}>
            <Header1 text={cat} fun1={()=>navigation.goBack()} img2={require('../assets/calendar.png')} fun2={()=>navigation.navigate('staff_attendance',{array:state.data,type})}/>
            {state.data.length > 0 ? <View style={Style.body_container}>
                <InputField name="srch" value={srch} onChangeFun={(name,value)=>{setSrch(value)}} label="Search Staff" placeholder="Enter name..."/>
                <View style={Style.list_wrap}>
                    <FlatList data={state.data} keyExtractor={(item, index)=>index.toString()} renderItem={renderStaff} showsVerticalScrollIndicator={false} overScrollMode='never'/> 
                </View>
            </View> : 
            <View style={{...Style.body_container,flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={Style.label}>You haven't added any staff</Text>
                <Btn text="Add New" fun={()=>navigation.navigate('addnew_staff',{mode:'add',type, category_options: state.categories,fun: {fun2:addnew_staff}})}/>
            </View>
            }
            {state.data.length > 0 && <CTABtn icon='add' fun={()=>navigation.navigate('addnew_staff',{mode:'add',type, category_options: state.categories,fun: {fun2:addnew_staff}})}/>}
        </View>
    )
}