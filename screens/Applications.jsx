import React, { useReducer, useCallback, useState, useEffect } from 'react'
import {View, Text,FlatList, ActivityIndicator,StyleSheet,TouchableOpacity} from 'react-native'
import Colors from '../constants/Colors'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import Block from '../components/Block'
import InputField from '../components/InputField'
import { useDispatch, useSelector } from 'react-redux'
import { RFValue } from 'react-native-responsive-fontsize'
import { setDate1,makeDate } from '../constants/functions'

const RESPOND = 'RESPOND'
const formReducer = (state,action)=>{
    switch(action.type){
        case RESPOND:
            let {id,response,message} = action
            let p = state.pending
            let r = state.responded
            let app = p.find(e=>e.id == id)
            app.status = response
            app.message = message
            p = p.filter(e=>e.id !== id)
            r = r.concat(app)
            r.sort(function(a,b){
                let d1 = a.date
                let d2 = b.date
                d1 = makeDate(d1)
                d2 = makeDate(d2)
                return d2 - d1;
            })
            return{...state,pending:p,responded:r}
    }
    return state
}
export default function Applications(props){
    const {navigation,route} = props
    let u = useSelector(state=>state.user)
    let [loading,setLoading] = useState(false)
    let [active,setActive] = useState(true)
    let {leave_applications,students,classes} = u
    useEffect(()=>{
        leave_applications.sort(function(a,b){
            let d1 = a.date
            let d2 = b.date
            d1 = makeDate(d1)
            d2 = makeDate(d2)
            return d2 - d1;
        })
    },[])
    let [state,dispatchState] = useReducer(formReducer,{
        pending:leave_applications.filter(e=>e.status == 'pending'),
        responded:leave_applications.filter(e=>e.status !== 'pending')
    })
    const accept = useCallback((id,message)=>{
        dispatchState({type:RESPOND,id,response:'granted',message})
    },[dispatchState])
    const reject = useCallback(async (id,message)=>{
        dispatchState({type:RESPOND,id,response:'rejected',message})
    },[dispatchState])
    const render = (item)=>{
        let {index} = item
        let {id,date,subject,status,studentID} = item.item
        let student = students.find(e=>e.id == studentID)
        let clsID = student.classId
        let token = student.token
        let cls = classes.find(e=>e.id == clsID)
        return(
            <Block heading={subject} text={`${student.name} (${cls.name}) ${setDate1(date)}`} fun={()=>navigation.navigate('application',{id,fun:{accept,reject}})} css={index < (status == 'pending' ? state.pending.length-1 : state.responded.length-1) && true}/>
        )
    }
    return (
        <View style={Style.screen}>
            <Header1 text='Leave Applications' fun1={()=>navigation.goBack()}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={Colors.blue}/></View>:
            <View style={Style.body_container}>
                <View style={styles.flex}>
                    <View style={{...styles.flex,flexDirection:'row',width:'70%'}}>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>setActive(true)} style={{...styles.btn,backgroundColor:active?Colors.blue:Colors.white,borderBottomLeftRadius:10,borderTopLeftRadius:10}}>
                            <Text style={{...styles.btn_txt,color:active?'white':Colors.blue}}>Pending</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>setActive(false)} style={{...styles.btn,backgroundColor:!active?Colors.blue:Colors.white,borderBottomRightRadius:10,borderTopRightRadius:10}}>
                            <Text style={{...styles.btn_txt,color:!active?'white':Colors.blue}}>Responded</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height:20}}/>
                {active ? 
                state.pending.length == 0 ? <View style={Style.list_wrap}><Text style={{...Style.label,fontSize:RFValue(15),paddingVertical:10,textAlign:'center'}}>No pending applications.</Text></View>:
                <View style={Style.list_wrap}>
                    <FlatList data={state.pending} keyExtractor={(item,index)=>index.toString()} showsVerticalScrollIndicator={false} overScrollMode="never" renderItem={render}/>
                </View>
                :
                state.responded.length == 0 ? <View style={Style.list_wrap}><Text style={{...Style.label,fontSize:RFValue(15),paddingVertical:10,textAlign:'center'}}>No applications.</Text></View>:
                <View style={Style.list_wrap}>
                    <FlatList data={state.responded} keyExtractor={(item,index)=>index.toString()} showsVerticalScrollIndicator={false} overScrollMode="never" renderItem={render}/>
                </View>
                }
            </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    flex:{alignItems:'center',justifyContent:'center'},
    btn:{paddingVertical:14,paddingHorizontal:20,width:'50%'},
    btn_txt:{fontSize:RFValue(15),fontWeight:'bold',textAlign:'center'}
})