import React, { useState, useRef, useEffect, useReducer, useCallback } from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet,ScrollView, Dimensions, Animated, FlatList, Alert, SafeAreaView, StatusBar} from 'react-native'
import Style from '../constants/Style'
import { Header2 } from '../components/Header'
import { RFValue } from 'react-native-responsive-fontsize'
import Colors from '../constants/Colors'
import { Dialog,ProgressDialog  } from 'react-native-simple-dialogs'
import { useDispatch, useSelector } from 'react-redux'
import { removeSubjectAllotted, updateStaff } from '../store/actions'
import SelectList from 'react-native-dropdown-select-list'
import { allotSubject } from '../store/actions'
import { db } from '../constants/config'
import { doc,updateDoc,deleteDoc } from 'firebase/firestore'
import { formatTime } from '../constants/functions'
import { Btn } from '../components/CTAButton'

const {height, width} = Dimensions.get('window')

const hg = RFValue(38)

const ADD = 'ADD'
const REMOVE = 'REMOVE'
const SET_REMAINING = 'SET_REMAINING'
const UPDATE_REMAINING = 'UPDATE_REMAINING'
const stateReducer = (state, action)=>{
    switch(action.type){
        case ADD:
            let data = action.data
            let s_list = state.subjects
            s_list = s_list.concat(data)
            return{
                ...state,
                subjects: state.subjects.concat(data)
            }
        case REMOVE:
            let id = action.id
            let array = state.subjects
            array = array.filter(e=>e!== id)
            return{
                ...state,
                subjects: array
            }
        case SET_REMAINING:
            let remA = action.data
            return{
                ...state,
                remaining: remA
            }
        case UPDATE_REMAINING:
            let obj = action.obj
            let a = state.remaining
            a = [...a,obj]
            return{
                ...state,
                remaining: a
            }
    }
    return state
}

export default function Staff_view(props){
    const {navigation, route} = props
    const {data, type, fun1, category_options} = route.params
    const [scroll, setScroll] = useState(false)
    const opacity = useRef(new Animated.Value(1)).current;
    const [showAlert, setShowAlert] = useState(false)
    const [loading,setLoading] = useState(false)
    const [selected, setSelected] = useState("");
    let {subjects,classes} = useSelector(state=>state.user)
    let dispatch = useDispatch()
    let {id,name, email, phone, category, subjects_allotted, joiningDate,img_url,last_login} = data
    const [state, dispatchState] = useReducer(stateReducer,{
        subjects: subjects_allotted,
        remaining: null
    })
    let log = null
    if(last_login){
        log = formatTime(last_login)
    }
    const filter_subjects = (ar)=>{
        let array = ar
        let a = []
        if(array.length > 0){
            array.forEach(e=>{
                let class_name = ''
                let ln = classes.length - 1
                e.class_id.forEach((c,i)=>{
                    let cl = classes.find(e=>e.id === c)
                    let com = (i === ln ||i === 0) ? '':', '
                    if(cl){
                        class_name = `${class_name}${com}${cl.name}`
                    }
                })
                let o = {key: e.id,value: `${e.title} (${class_name})`}
                let ind = state.subjects.indexOf(e.id)
                if(ind == -1){
                    a.push(o)
                }
            })
        }
        return a
    }
    const set_remaining = useCallback((d)=>{
        dispatchState({
            type: SET_REMAINING,
            data: d
        })
    },[dispatchState])
    const update_remaining = useCallback((o)=>{
        dispatchState({
            type: UPDATE_REMAINING,
            obj: o
        })
    },[dispatchState])
    type == 'teaching' && useEffect(()=>{
        let res = filter_subjects(subjects)
        set_remaining(res)
    },[])
    const handleScroll = (event)=>{
        let top = event.nativeEvent.contentOffset.y
        top > 200 ? setScroll(true) :  setScroll(false)
    }
    useEffect(()=>{
        scroll == true ? fadeOut() : fadeIn()
    },[scroll])
    const fadeOut = ()=>{
        Animated.timing(opacity,{
            toValue: 0.4,
            duration: 500,
            useNativeDriver: true
        }).start()
    }
    const fadeIn = ()=>{
        Animated.timing(opacity,{
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start()
    }
    
    const remAlert = (id, name)=>{
        Alert.alert('Are you sure?',`Do you really want to remove ${name}?`,[{text: 'Cancel'},{text: 'Remove',onPress:()=>removeSubject(id)}])
    }
    const removeSubject = useCallback(async(subject_id)=>{
        setLoading(true)
        try{
            await updateDoc(doc(db,'teachers',id),{
                subjects_allotted: subjects_allotted.filter(e=>e !== subject_id)
            })
            let e = subjects.find(e=>e.id == subject_id)
            let new_obj = {key: e.id,value: `${e.title} (${e.class_name})`}
            update_remaining(new_obj)
            dispatch(removeSubjectAllotted(id, subject_id))
            dispatchState({
                type: REMOVE,
                id: subject_id
            })
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
        
    },[dispatchState])
    const renderSubject = (item)=>{
        let itm = item.item
        let index = item.index
        if(itm.add){
            return(
                <TouchableOpacity activeOpacity={.5} onPress={()=>setShowAlert(true)} style={{...styles.det, alignItems: 'center', justifyContent:'center', marginRight: 15, width: 100, marginLeft: index == 0 ? 15 : 0}}><Text style={{fontSize:RFValue(50),marginTop:-5,color:Colors.lblack}}>+</Text></TouchableOpacity>
            )
        }
        else{
            let sub = subjects.find(e=>e.id == itm)
            let class_name = ''
            let ln = classes.length - 1
            sub.class_id.forEach((c,i)=>{
                let cl = classes.find(e=>e.id === c)
                let com = (i === ln ||i === 0) ? '':', '
                if(cl){
                    class_name = `${class_name}${com}${cl.name}`
                }
            })
            return(
                <View style={{...styles.det, width: width*.6, marginRight: 10, marginLeft: index == 0 ? 15 : 0}}>
                    <View style={{width: '80%'}}>
                        <Text style={{fontSize: RFValue(18)}}>{sub.title}</Text>
                        <Text style={styles.det_txt}>{`Class: ${class_name}`}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>remAlert(sub.id, sub.title)} style={styles.btn_wrap}><Image source={require('../assets/delete.png')} style={{resizeMode:'contain',height:RFValue(20),tintColor:Colors.black}}/></TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    const send_data = async (name,category,email,phone,img_url)=>{
        let col = 'staff'
        if(type == 'teaching'){
            col = 'teachers'
        }
        await updateDoc(doc(db,col,id),{
            name,phone,email,category,img_url
        })
    }
    const updateDetail = (name, category, email, phone, img_url)=>{
        let data = {
            id,name,phone,email,category,tag: type,img_url
        }
        send_data(name,category,email,phone,img_url).then(()=>{
            dispatch(updateStaff(data))
            navigation.goBack()
        }).catch(err=>console.log(err))
        
    }
    const remove_fun = async ()=>{
        let col = 'staff'
        if(type ==  'teaching'){col = 'teachers'}
        await deleteDoc(doc(db,col,id))
        fun1(id)
    }
    const setCls = (opt)=>{
        allot(opt)
    }
    const allot = async(key)=>{
        setLoading(true)
        let sbj = subjects.find(e=>e.id == key)
        setShowAlert(false)
        try{
            await updateDoc(doc(db,'teachers',id),{
                subjects_allotted : subjects_allotted.concat(sbj.id)
            })
            dispatch(allotSubject(id, sbj.id))
            let rem_s = state.remaining
            let rms = rem_s.filter(e=>e.key !== key)
            set_remaining(rms)
            allot_subject(sbj)
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    }
    const allot_subject = useCallback((sbj)=>{
        dispatchState({
            type: ADD,
            data:sbj.id
        })
    },[dispatchState])
    return(
        <SafeAreaView style={Style.screen}>
            <Header2 text={name} fun1={()=>navigation.goBack()} scroll={scroll}/>
            <ScrollView showsVerticalScrollIndicator={false} overScrollMode='never'
             onScroll={handleScroll}
             >
                <View style={styles.image_wrap}>
                    <Animated.Image style={{...styles.image, opacity}} source={{uri: img_url}}></Animated.Image>
                </View>
                <View style={{...Style.body_container, marginTop: -50}}>
                    <View style={styles.det}>
                        <View>
                            <Text style={styles.det_head}>{name}</Text>
                            <Text style={styles.det_txt}>{category}</Text>
                            <Text style={styles.det_txt}>Phone: {phone}</Text>
                            <Text style={styles.det_txt}>Email: {email}</Text>
                            <Text style={styles.det_txt}>Joined: {joiningDate}</Text>
                            {log && <Text style={styles.det_txt}>Last login: {log}</Text>}

                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity activeOpacity={.5} onPress={()=>navigation.navigate('addnew_staff',{mode:'edit',data:{id, name, category,phone,email,img_url}, type,category_options, fun: {fun1:remove_fun,fun2:updateDetail}})} style={styles.btn_wrap}><Image source={require('../assets/pen.png')} style={{resizeMode:'contain',height:RFValue(18),tintColor:Colors.black}}/></TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height: 20}}/>
                    {type == 'teaching' && <Text style={{...Style.list_heading, marginLeft: 2}}>Subjects Allotted</Text>}
                </View>
                {type == 'teaching' && <View style={{marginTop: -20}}><FlatList data={[...state.subjects, {add: true}]} keyExtractor={(item, index)=>index.toString()} showsHorizontalScrollIndicator={false} overScrollMode="never" horizontal renderItem={renderSubject}/></View>}
            <View style={{height:50}}/>
                <Btn text="Attendance" fun={()=>navigation.navigate('staff_attn',{type,id})}/>

            </ScrollView>
            <Dialog
                visible={showAlert}
                onTouchOutside={() => setShowAlert(false)}
            >
                <View>
                    <Text style={styles.dialog_head}>Allot New Subject</Text>
                    <SelectList setSelected={setSelected} data={state.remaining} onSelect={() => setCls(selected)} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Select Subject" searchPlaceholder="Search subject..." dropdownStyles={{backgroundColor: Colors.white, borderColor: '#eee'}}/>
                </View>
                

            </Dialog>
            <ProgressDialog
                visible={loading}
                message="Please, wait..."
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image_wrap:{height: 350, overflow: 'hidden', alignItems: 'center', justifyContent:'center'},
    image:{width: '100%', height: '100%'},
    det:{padding: 15, backgroundColor: Colors.white, borderRadius: 15, position: 'relative', flexDirection: 'row', justifyContent: 'space-between'},
    det_head:{fontSize: RFValue(20)},
    btn_wrap:{height: hg, width: hg, borderRadius: hg, backgroundColor: Colors.bg, alignItems:'center', justifyContent: 'center', marginLeft: 3, borderWidth: 1, borderColor: "#eee"},
    btn_icon:{fontSize: RFValue(20)},
    det_txt:{color: Colors.lblack},
    dialog_head:{fontSize: RFValue(15), marginBottom: 10, color: Colors.black, textAlign: 'center'}
})