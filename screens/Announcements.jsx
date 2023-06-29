import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, FlatList, ActivityIndicator, Text} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import CTABtn,{Btn} from '../components/CTAButton'
import Block from '../components/Block'
import InputField from '../components/InputField'
import { useDispatch, useSelector } from 'react-redux'
import { addAnnouncement,removeAnnouncement,updateAnnouncement } from '../store/actions'
import { db } from '../constants/config'
import {collection,doc,addDoc,updateDoc,deleteDoc} from 'firebase/firestore'
import Colors from '../constants/Colors'
import { setDate1 } from '../constants/functions'

const ADD = 'ADD'
const UPDATE = 'UPDATE'
const REMOVE = 'REMOVE'
const FILTER = 'FILTER'
const stateReducer = (state, action)=>{
    switch(action.type){
        case ADD:
            let {id, title,text,date,to} = action
            let obj = {id,title,text,date,to}
            let cls = state.announcements
            cls = cls.concat(obj)
            return{
                ...state,
                announcements: cls
            }
        case UPDATE:
            id = action.id
            title = action.title
            text = action.text
            to = action.to
            let c = state.announcements
            let ind = c.findIndex(i=>i.id == id)
            c[ind].title = title
            c[ind].text = text
            c[ind].to = to
            return{
                ...state,
                announcements: c
            }
        case REMOVE:
            const r_id = action.id
            let cl = state.announcements
            cl = cl.filter(i=>i.id !== r_id)
            return{
                ...state,
                announcements: cl
            }
        case FILTER:
            const {str, data} = action
            let clss = state.announcements
            let array = data
            if(str){
                array = data.filter(el=>{
                    return el.title.match(str)
                })
            }
            return{
                ...state,
                announcements: array
            }
    }
    return state
}

export default function Announcements(props){
    const {navigation, route} = props
    const user = useSelector(state=>state.user)
    const [loading,setLoading] = useState(false)
    let {announcements,session,students,staff} = user
    let {teaching} = staff
    let uid = user.user.uid
    const [state, dispatchState] = useReducer(stateReducer,{
        announcements
    })
    let dispatch = useDispatch()
    const [srch, setSrch] = useState('')
    const renderClass = (item)=>{
        const {id, title,to,date,text} = item.item
        let index = item.index
        return(
            <Block heading={title} text={`${setDate1(date)}, To: ${to}`} fun={()=>navigation.navigate('announcement_form',{mode:"edit",data:{id,title,to,date,text},fun1:deleteAnnouncement,fun2:update})} css={index < (state.announcements.length-1) && true}/>
        )
    }
    const filter = useCallback((value)=>{
        dispatchState({
            type: FILTER,
            str: value,
            data: announcements
        })
    },[dispatchState])
    const handleChange = (name, value)=>{
        setSrch(value)
    }
    useEffect(()=>{
        filter(srch)
    },[srch])
    const sendNotif = async(obj,tokens)=>{
        let {title} = obj
        await fetch('https://exp.host/--/api/v2/push/send',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: tokens,
                title: `Annoucement by Admin`,
                body: `${title}`,
                data:{type:'announcement',nav:'homepage',screen:'notification',data:obj,source:'Admin'}
            }),
        })
    }
    const addNew = useCallback(async(data)=>{
        let {title,text,to,date} = data
        let obj = {title,text,date}
        let tokens = []
        let tToken = []
        let sToken = []
        teaching.forEach(t=>{
            let {token} = t
            if(token){
                tToken.push(token)
            }
        })
        students.forEach(t=>{
            let {token} = t
            if(token){
                sToken.push(token)
            }
        })
        setLoading(true)
        try{
            if(to == 'Students'){
                await sendNotif(obj,sToken)
            }else if(to == 'Teachers'){await sendNotif(obj,tToken)}
            else if(to == 'Everyone'){ await sendNotif(obj,sToken); await sendNotif(obj,tToken)}
            addDoc(collection(db,'admin-announcements'),{instituteID:uid,title,text,to,date,session}).then((res)=>{
                let id = res.id
                dispatch(addAnnouncement({id,...data}))
                dispatchState({
                    type: ADD,id,...data
                })
                setLoading(false)
            }).catch(err=>console.log(err))
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    const deleteAnnouncement = useCallback(async id=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'admin-announcements',id))
            dispatch(removeAnnouncement(id))
            dispatchState({type: REMOVE,id})
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
        
    },[dispatchState])
    const update = useCallback(async(data)=>{
        let {id,title,text,to} = data
        setLoading(true)
        try{
            await updateDoc(doc(db,'admin-announcements',id),{title,text,to})
            dispatch(updateAnnouncement(id,title,text,to))
            dispatchState({type: UPDATE,id,title,text,to})
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    return(
        <View style={Style.screen}>
            <Header1 text='Announcements' fun1={()=>navigation.goBack()} icon2="home-outline" fun2={()=>navigation.navigate('home_page')}/>
            {loading ? <View style={Style.ai_screen}>
                <ActivityIndicator size="large" color={Colors.blue}/>
            </View>
            :
            announcements.length > 0 ?
                <View style={Style.body_container}>
                    <InputField name="srch" value={srch} onChangeFun={handleChange} label="Search Announcement" placeholder="Enter title..."/>
                    <View style={Style.list_wrap}>
                        <FlatList data={state.announcements} keyExtractor={(item, index)=>index.toString()} renderItem={renderClass} showsVerticalScrollIndicator={false} overScrollMode='never'/>
                    </View>
                </View>
                :
                <View style={Style.ai_screen}>
                    <Text style={Style.label}>You haven't added any announcement</Text>
                    <Btn text="Add New" fun={()=>navigation.navigate('announcement_form',{mode: 'add',fun2:addNew})}/>
                </View>
            }
            {announcements.length > 0 && <CTABtn icon='add' fun={()=>navigation.navigate('announcement_form',{mode: 'add',fun2:addNew})}/>}
        </View>
    )
}