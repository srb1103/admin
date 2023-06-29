import React,{ useReducer } from 'react'
import {View,Text,FlatList, TouchableOpacity} from 'react-native'
import { Header1 } from '../components/Header'
import Block from '../components/Block'
import Style from '../constants/Style'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { useEffect } from 'react'

const reducer = (state,action)=>{
    return state
}
export default function Result_overview(props){
    let {navigation,route} = props
    let {classId,id} = route.params
    let u = useSelector(state=>state.user)
    let [active,setActive] = useState(0)
    let {sessions,results,subjects} = u
    let s_array = []
    sessions.forEach(s=>{
        let arr = results.filter(e=>e.session == s.id)
        let session_data = []
        if(arr){
            subjects.forEach(sb=>{
                let new_arr = arr.filter(e=>e.subjectID == sb.id)
                let subject_tests = []
                if(new_arr){
                    new_arr.forEach(item=>{
                        let res = JSON.parse(item.result)
                        if(res){
                            let num = res.find(e=>e.id == id)
                            if(num){
                                let res_data = {date:item.examDate,marksType:item.marksType,max:item.maxMarks,marks:num.marks,title:item.title,type:item.type}
                                subject_tests.push(res_data)
                            }
                        }
                    })
                }
                let subject_data = {subject:sb.title,tests:subject_tests}
                if(subject_tests.length>1){
                    session_data.push(subject_data)
                }
            })
        }
        s_array.push({session:s.title,data:session_data})
    })
    // 

    const [state,dispatchState] = useReducer(reducer,{
        data:s_array
    })
    const render = (s)=>{
        let {item,index} = s
        let {session} = item
        return(
            <TouchableOpacity activeOpacity={.5} onPress={()=>{setActive(index)}} style={{paddingVertical:7,paddingHorizontal:20,borderRadius:20,marginRight:5,backgroundColor:active == index?Colors.blue:Colors.white}}>
                <Text style={{color:active == index?Colors.white:Colors.lblack,fontSize:RFValue(15),fontWeight:'bold'}}>{session}</Text>
            </TouchableOpacity>
        )
    }
    const render1 = (s)=>{
        let {item,index} = s
        let {subject,tests} = item
        return(
            <Block heading={subject} fun={()=>navigation.navigate('result_view',{data:tests,subject})} css={index < (state.data.length-1) && true}/>
        )
    }
    let content =  <View style={Style.list_wrap}>
            <FlatList showsVerticalScrollIndicator={false} overScrollMode="never" keyExtractor={(item,index)=>index.toString()} renderItem={render1} data={state.data[active].data}/>
        </View>
    const fetch_content = ()=>{
        content =  <View style={Style.list_wrap}>
            <FlatList showsVerticalScrollIndicator={false} overScrollMode="never" keyExtractor={(item,index)=>index.toString()} renderItem={render1} data={state.data[active].data}/>
        </View>
    }
    useEffect(()=>{
        fetch_content()
    },[active])
    return(
        <View style={Style.screen}>
            <Header1 text='Select Session & Subject' fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <FlatList showsHorizontalScrollIndicator={false} overScrollMode="never" keyExtractor={(item,index)=>index.toString()} renderItem={render} data={state.data} horizontal/>
                <View style={{height:15}}/>
                {content}
            </View>
        </View>
    )
}