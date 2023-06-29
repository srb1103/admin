import React,{useEffect, useReducer, useCallback,useState} from 'react'
import {View,FlatList,ActivityIndicator,Text, TouchableOpacity, Dimensions} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import Block from '../components/Block'
import { useDispatch, useSelector } from 'react-redux'
import InputField from '../components/InputField'
import CTABtn from '../components/CTAButton'
import { addStudent } from '../store/actions'
import { db } from '../constants/config'
import { collection,addDoc } from 'firebase/firestore'
import Colors from '../constants/Colors'
import { Btn } from '../components/CTAButton'
import { RFValue } from 'react-native-responsive-fontsize'

const ADD = 'ADD'
const UPDATE1 = 'UPDATE1'
const REMOVE = 'REMOVE'
const FILTER = 'FILTER'
let {height} = Dimensions.get('window')
const stateReducer = (state, action)=>{
    switch (action.type){
        case UPDATE1:
            let {clsID} = action
            return{...state,class_id:clsID}
        case FILTER:
            let {q} = action
            let {data} = state
            let array = data
            if(q !== ''){
                array = data.filter(e=>e.name.match(q))
            }
            let cls2 = state.class_id
            array = cls2 == 'All'?array:array.filter(e=>e.classId == cls2)
            return{
                ...state,
                filtered_students: array
            }
        case ADD:
            let obj = action.obj
            let arr = state.data.concat(obj)
            let fil = state.class_id
            return{
                ...state,
                data: arr,
                filtered_students:fil == 'All'?arr:arr.filter(e=>e.classId == fil)
            }            
        case REMOVE:
            let id = action.id
            let t = state.data
            t = t.filter(e=>e.id !== id)
            let fil1 = state.class_id
            return{
                ...state,
                data: t,
                filtered_students: fil1== 'All'?t:t.filter(e=>e.classId == fil1)
            }
        // case UPDATE:
        //     let st = action.data
        //     let {name,guardian,phone,email,classId,address,admissionNo,rollNo} = st
        //     let st_id = st.id
        //     let stn = state.data
        //     let i = stn.findIndex(e=>e.id == st_id)
        //     stn[i].name = name
        //     stn[i].phone = phone
        //     stn[i].email = email
        //     stn[i].classId = classId
        //     stn[i].address = address
        //     stn[i].guardian = guardian
        //     stn[i].admissionNo = admissionNo
        //     stn[i].rollNo = rollNo
        //     return{...state,data: stn,filtered_students:stn}
    }
    return state
}
export default function Students(props){
    const {navigation} = props
    const [loading,setLoading] = useState(false)
    const user = useSelector(state=>state.user)
    let [activeClass,setActiveClass] = useState(0)
    let students = []
    let st = user.students
    let {classes} = user
    if(st){students = st}
    let {uid,name,logoURL,mail,contact,label} = user.user
    let iname = name
    const [srch,setSrch] = useState()
    const dispatch = useDispatch()
    let cls = useSelector(state=>state.user.classes)
    const [state, dispatchState] = useReducer(stateReducer,{
        data: students,
        filtered_students:students,
        class_id: 'All'
    })
    const filter = useCallback((value)=>{
        dispatchState({
            type: FILTER,
            q: value,
        })
    },[dispatchState])
    useEffect(()=>{
        filter(srch)
    },[srch])
    const renderStudent = (item)=>{
        let index = item.index
        let st = item.item
        let class_name
        let c = cls.find(e=>e.id == st.classId)
        class_name = c ?  c.name : 'Not Linked to any class'
        return(
            <Block heading={st.name} fun={()=>navigation.navigate('student',{data:{...st,class_name,cls},fun:{fun1:handleDelete}})} css={index < (state.data.length-1) && true} text={`Class: ${class_name}`}/>
        )
    }
    const handleDelete = useCallback(id=>{
        dispatchState({type:REMOVE,id})
    },[dispatchState])
    // const add_Student = useCallback((data)=>{
    //     setLoading(true)
    //     let {name,email,admissionNo,id} = data
    //     fetch(`https://kotcode.in/LMS_api/send_lms_registration_mail.php?type=student_registration&name=${name}&iLogo=${logoURL}&iName=${iname}&email=${email}&id=${id}&admissionNo=${admissionNo}&mail=${mail}&contact=${contact}`).then(r=>{
    //         let st = r.status
    //         if(st == 200){
    //             dispatch(addStudent(data))
    //             dispatchState({type: ADD,obj:data})
    //             setLoading(false)
    //         }
    //     }).catch(err=>{console.log(err);setLoading(false)})
    // },[dispatchState])
    if (loading){
        return(
            <View style={Style.screen}>
                <Header1 text='Students' fun1={()=>navigation.goBack()} img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
                <View style={Style.ai_screen}>
                    <ActivityIndicator size='large' color={Colors.blue}/>
                </View>
            </View>
        )
    }
    const filterClasses = useCallback((id)=>{
        dispatchState({type:UPDATE1,clsID:id})
        filter('')
    },[dispatchState]) 
    const renderClassChip = (cls)=>{
        let {index,item} = cls
        let {name,id} = item
        let ln = classes.length
        return(
            <TouchableOpacity activeOpacity={.5} onPress={()=>{setActiveClass(index);filterClasses(id)}} style={{padding:5,paddingHorizontal:14,borderRadius:20,backgroundColor:index == activeClass?Colors.blue:Colors.white,alignItems:'center',justifyContent:'center',marginLeft:index==0?15:5,marginRight:index==ln?15:0,borderWidth:1,borderColor:index==activeClass?Colors.blue:'#eee'}}>
                <Text style={{color:index== activeClass?Colors.white:Colors.lblack,textAlign:'center',fontSize:RFValue(15)}}>{name}</Text>
            </TouchableOpacity>
        )
    }
    return(
        <View style={Style.screen}>
            <Header1 text={`Students (${state.filtered_students.length})`} fun1={()=>navigation.goBack()} img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
            {loading ? <View style={Style.ai_screen}>
                <ActivityIndicator size="large" color={Colors.blue}/>
            </View>
            :
            state.data.length > 0 ?
                <View style={{...Style.body_container,paddingHorizontal:0}}>
                    <View style={{paddingVertical:3}}>
                        <FlatList data={[{name:'All',id:'All'},...classes]} renderItem={renderClassChip} horizontal keyExtractor={(item,index)=>index.toString()} showsHorizontalScrollIndicator={false} overScrollMode='never'/>
                    </View>
                    <View style={{paddingHorizontal:15}}>
                        <InputField name="srch" value={srch} onChangeFun={(name,value)=>{setSrch(value)}} label="Search Student" placeholder="Enter name..."/>
                        <View style={{...Style.list_wrap,maxHeight:height*.77}}>
                            <FlatList data={state.class_id ? state.filtered_students : students} keyExtractor={(item, index)=>index.toString()} renderItem={renderStudent} showsVerticalScrollIndicator={false} overScrollMode='never'/>
                        </View>
                    </View>
                </View>
                :
                <View style={Style.ai_screen}>
                    <Text style={Style.label}>You haven't added any student</Text>
                    <Btn text="Add New" fun={()=>navigation.navigate('student_form',{mode: 'add',data:{cls},instituteID:uid,iname,logoURL,mail,contact,label})}/>
                </View>
            }
            {state.data.length > 0 && <CTABtn icon='add' fun={()=>navigation.navigate('student_form',{mode: 'add',data:{cls},instituteID:uid,iname,logoURL,mail,contact,label})}/>}
        </View>
    )
}