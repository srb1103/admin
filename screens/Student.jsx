import React, { useState, useRef, useEffect, useReducer, useCallback } from 'react'
import {View, Image, Text, TouchableOpacity, StyleSheet,ScrollView, Dimensions, Animated, FlatList, Alert, SafeAreaView, StatusBar} from 'react-native'
import Style from '../constants/Style'
import { Header2 } from '../components/Header'
import { RFValue } from 'react-native-responsive-fontsize'
import Colors from '../constants/Colors'
import { Dialog } from 'react-native-simple-dialogs'
import { useDispatch, useSelector } from 'react-redux'
import SelectList from 'react-native-dropdown-select-list'
import { updateStudent,removeStudent } from '../store/actions'
import { formatTime } from '../constants/functions'
import { db } from '../constants/config'
import { collection,addDoc, deleteDoc,doc, updateDoc } from 'firebase/firestore'

const {height, width} = Dimensions.get('window')

const hg = RFValue(38)

const ADD = 'ADD'
const REMOVE = 'REMOVE'
const stateReducer = (state, action)=>{
    switch(action.type){
        
    }
    return state
}
export default function Student(props){
    const {navigation, route} = props
    const {data,fun} = route.params
    let {fun1} = fun
    const [scroll, setScroll] = useState(false)
    const opacity = useRef(new Animated.Value(1)).current;
    const [showAlert, setShowAlert] = useState(false)
    const [selected, setSelected] = useState("");
    let u = useSelector(state=>state.user)
    let dispatch = useDispatch()
    let {id,name, guardian,rollNo,class_name,img_url,classId,last_login} = data
    const [state, dispatchState] = useReducer(stateReducer,{
        // subjects: subjects_allotted,
    })
    if(last_login){
        last_login = formatTime(last_login)
    }
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
    const updateDetail = (obj)=>{
        let {name,phone,email,address,guardian,class_name,admissionNo,rollNo,img_url} = obj
        let cls = data.cls
        let classId = cls.find(e=>e.name == class_name).id
        let o = {id,name,phone,email,address,guardian,classId,admissionNo,rollNo,img_url}
        updateDoc(doc(db,'students',id),{name,phone,email,address,guardian,classId,admissionNo,rollNo,img_url}).then(()=>{
            dispatch(updateStudent(o))
        }).catch(err=>{console.log(err)})
    }
    const handleDelete = ()=>{
        deleteDoc(doc(db,'students',id)).then(()=>{
            dispatch(removeStudent(id))
            fun1(id)
        }).catch(err=>{console.log(err)})
    }
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
                            <Text style={styles.det_txt}>Class: {class_name}</Text>
                            <Text style={styles.det_txt}>Guardian: {guardian}</Text>
                            <Text style={styles.det_txt}>Roll No: {rollNo}</Text>
                            <Text style={styles.det_txt}>Last Login: {last_login}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity activeOpacity={.5} onPress={()=>navigation.navigate('student_form',{mode:'edit',data,fun1:handleDelete,fun2:updateDetail})} style={styles.btn_wrap}><Image source={require('../assets/pen.png')} style={{resizeMode:'contain',height:RFValue(18),tintColor:Colors.black}}/></TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height: 10}}/>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>navigation.navigate('attendance',{id,name,rollNo,classId})} style={styles.btn}>
                            <Image source={require('../assets/attendance.png')} style={styles.btn_img}/>
                            <Text style={styles.btn_txt}>Attendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>navigation.navigate('result',{id,name,rollNo,classId})} style={styles.btn}>
                            <Image source={require('../assets/results.png')} style={styles.btn_img}/>
                            <Text style={styles.btn_txt}>Results</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    dialog_head:{fontSize: RFValue(15), marginBottom: 10, color: Colors.black, textAlign: 'center'},
    btn:{alignItems:'center',justifyContent:'center',width:'48.7%',borderRadius:13,paddingVertical:20,backgroundColor:Colors.white},
    btn_img:{resizeMode:'contain',height:RFValue(60)},
    btn_txt:{color:Colors.lblack,fontSize:RFValue(14),marginTop:5}
})