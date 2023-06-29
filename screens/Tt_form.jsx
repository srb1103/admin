import React, { useReducer, useCallback, useState } from 'react'
import {View, FlatList, TouchableOpacity,Text,StyleSheet, Dimensions, Alert, Image} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectList from 'react-native-dropdown-select-list'
import { Dialog } from 'react-native-simple-dialogs'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { ButtonCombo, Btn } from '../components/CTAButton'

const {width} = Dimensions.get('window')
const hg = RFValue(38)

const SET_TIME = 'SET_TIME'
const UPDATE_VALUE = 'UPDATE_VALUE'
const REMOVE_SUB = 'REMOVE_SUB'
const ADD_SUB = 'ADD_SUB'
const TOGGLE_CHECK = 'TOGGLE_CHECK'
const UPDATE_DAYS= 'UPDATE_DAYS'
const stateReducer = (state,action)=>{
    switch(action.type){
        case SET_TIME:
            let {time,value} = action
            let t = {...state.time,[time]:value}
            return{...state,time:t}
        case REMOVE_SUB:
            let s_id = action.id
            let opts = action.opt
            let mode = action.mode
            t = state.subjects.filter(e=>e.subjectID !== s_id)
            let dys = state.days
            dys.forEach(d=>{
                if(d.subject == s_id){
                    d.subject = null
                }
            })
            let s_list = mode == 'edit' ? state.subjectList : state.subjectList.concat(opts.find(e=>e.key == s_id))

            return{...state,subjectList:s_list,days:dys,subjects:t}
        case ADD_SUB:
            s_id = action.s_id
            let tchr = state.teacher
            let subst = state.substitute
            let obj = {subjectID:s_id,teacher:tchr,substitute:subst}
            let sub_array = state.subjects.concat(obj)
            dys = state.days 
            let cb_o = {}
            dys.forEach(d=>{
                let d_id = d.id
                if(d.subject == null){
                    cb_o = {...cb_o,[d_id]:false}
                }
            })
            t = state.subjectList.filter(e=>e.key !== s_id)
            return{...state,subjectList:t,teacher:'',substitute:'',subjects:sub_array,checks:cb_o}
        case TOGGLE_CHECK:
            let {toggleID,toggleValue} = action
            let chks = {...state.checks,[toggleID]:!toggleValue}
            return{...state,checks:chks}
        case UPDATE_VALUE:
            let id = action.id
            value = action.value
            return{...state,[id]:value}
        case UPDATE_DAYS:
            let sub_id = action.sub_id
            chks = state.checks
            dys = state.days
            dys.forEach(d=>{
                let code = d.id
                if(chks[code] == true){
                    d.subject = sub_id
                }
            })
            return{...state,days:dys}
    }
    return state
}

export default function Tt_form(props){
    const {navigation,route} = props
    let {addFun,class_id,subjects,mode,user_data,delFun,period} = route.params
    const user = user_data
    let opt = []
    subjects.filter(su=>su.class_id == class_id).forEach(e=>{
        let c_id = e.id
        let stf = ''
        let t_id = ''
        user.staff.teaching.forEach((st,i)=>{
            let arr = st.subjects_allotted.find(t=>t ==c_id)
            if(arr){
                stf = st.name
                t_id = st.id
            }
        })
        let o = {key:c_id,value:`${e.title} (${stf})`,teacher:t_id}
        opt.push(o)
    })
    const [show,setShow] = useState(false)
    const [showAlert,setShowAlert] = useState(false)
    const [date,setDate] = useState(new Date())
    const [t_code,setTime] = useState('from')
    const [selected, setSelected] = useState("");
    const [subID,setSubID] = useState(null)
    const [subName,setSubName] = useState(null)
    const [state,dispatchState] = useReducer(stateReducer,{
        time:{from:mode == 'edit' ? period.time.from:null,to:mode == 'edit' ? period.time.to:null},
        perID: mode == 'edit' ? period.id : null,
        teacher:'',
        substitute:'',
        period:mode == 'edit' ? period.period:'',
        days:mode == 'edit' ? period.days : [
            {id:'m',name:'Monday',subject:null},
            {id:'t',name:'Tuesday',subject:null},
            {id:'w',name:'Wednesday',subject:null},
            {id:'th',name:'Thursday',subject:null},
            {id:'f',name:'Friday',subject:null},
            {id:'s',name:'Saturday',subject:null},
        ],
        subjects:mode == 'edit' ? period.subjects : [],
        subjectList:opt,
        init:user.subjects.filter(e=>e.class_id == class_id),
        checks:{m:false,t:false,w:false,th:false,f:false,s:false}
    })
    const onChange = (e)=>{
        let ts = e.nativeEvent.timestamp
        let d = new Date(ts).toLocaleTimeString('en-IN')
        let t = d.split(':')
        let time = `${t[0]}:${t[1]}`
        if(e.type == 'set'){
            updateTime(t_code,time)
        }
        setShow(false)
    }
    const updateDays = useCallback((sub_id)=>{
        dispatchState({type: UPDATE_DAYS,sub_id})
    },[dispatchState])
    const updateTime = useCallback((time,value)=>{
        dispatchState({type: SET_TIME,time,value})
    },[dispatchState])
    const setCls = o=>{
        let sf = opt.find(e=>e.key == o)
        let v = sf.value.split('(')
        setSubID(o)
        setSubName(v[0])
        handleChange('teacher',sf.teacher)
    }
    const handleChange = useCallback((id,value)=>{
        dispatchState({type: UPDATE_VALUE,id,value})
    },[dispatchState])
    const removeSubject = useCallback(id=>{
        dispatchState({type: REMOVE_SUB,id,opt,mode})
    },[dispatchState])
    const renderSubject = (item)=>{
        let itm = item.item
        if(itm.add){
            return(
                <TouchableOpacity activeOpacity={.5} onPress={()=>setShowAlert(true)} style={{...styles.det, alignItems: 'center', justifyContent:'center', marginRight: 15, width: 100}}><Text style={{fontSize:RFValue(50),marginTop:-5,color:Colors.lblack}}>+</Text></TouchableOpacity>
            )
        }else{
            let day_string = ''
            let s_id = itm.subjectID
            state.days.forEach(d=>{
                if(d.subject == s_id){
                    let com = ', '
                    if(day_string == ''){com = ''}
                    day_string = `${day_string}${com}${d.name}`
                }
            })
            let sub_name = subjects.find(e=>e.id == s_id).title
            let teacher_name = user.staff.teaching.find(e=>e.id == itm.teacher).name
            return(
                <View style={{...styles.det, width: width*.6, marginRight: 10}}>
                    <View style={{width: '80%'}}>
                        <Text style={{fontSize: RFValue(16),lineHeight:RFValue(17),marginBottom:2}}>{sub_name}</Text>
                        <Text style={{fontSize: RFValue(12)}}>By: {teacher_name}</Text>
                        <Text style={{fontSize: RFValue(10),color:Colors.lblack}}>Days: {day_string}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>Alert.alert('Are you sure?','Do you really want to delete this subject?',[{text:'No'},{text:'Yes, Delete',onPress:()=>removeSubject(itm.subjectID)}])} style={styles.btn_wrap}><Image source={require('../assets/delete.png')} style={{resizeMode:'contain',height:RFValue(20),tintColor:Colors.black}}/></TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    const updateCheck = useCallback((id,value)=>{
        dispatchState({type:TOGGLE_CHECK,toggleID:id,toggleValue:value})
    },[dispatchState])

    const renderDays=(item)=>{
        let day = item.item
        let {id,name} = day
        let d_id = state.checks[id]
        return(
            <TouchableOpacity activeOpacity={.5} onPress={()=>updateCheck(id,d_id)} style={{paddingVertical:10,paddingHorizontal:15,color:Colors.black,marginRight:5,backgroundColor:d_id ? Colors.blue : Colors.white,borderRadius:10}}><Text style={{fontSize: 15,color:d_id?'white':Colors.black}}>{name}</Text></TouchableOpacity>
        )
    }
    const addNewSubject = useCallback((id)=>{
        dispatchState({type: ADD_SUB,s_id:id})
    },[dispatchState])
    const save = ()=>{
        let dt = state
        let i = 0
        dt.days.forEach(e=>{
            let id = e.id
            if(dt.checks[id] == true){i = i+1}
        })
        if(dt.substitute !== ''){
            if(i == 0){
                Alert.alert('Error','Please select atleast one day.',[{text:'Okay'}])
            }else{
                updateDays(subID)
                addNewSubject(subID,subName)
                setSubID('')
                setSubName('')
                setShowAlert(false)
            }
        }else{
            Alert.alert('Error','Please fill all inputs',[{text:'Okay'}])
        }
    }
    const savePeriod = ()=>{
        let {period,time,subjects,days} = state
        let data = {period,time,subjects,days}
        if (mode == 'edit' ){
            data = {id:state.perID,...data}
        }
        if(!period || !time.from || !time.to){
            Alert.alert('Error','Please fill all mandatory fields!',[{text: 'Okay'}])
        }else{
            if(subjects.length == 0){
                Alert.alert('Error','Please add atleast one subject',[{text: 'Okay'}])
            }else{
                let res = addFun(data)
                if(res){
                    navigation.goBack()
                }else{
                    Alert.alert('Error',`Period ${period} already exists!`,[{text: 'Okay'}])
                }
            }
        }
    }
    const dlt = ()=>{
        Alert.alert('Are you sure?','Do you really want to delete this period?',[{text:'Cancel'},{text:'Delete',onPress:()=>{delFun(period.id);navigation.goBack()}}])
    }
    return(
        <View style={Style.screen}>
            <Header1 text={mode == 'edit' ? 'Edit Period' : `Add period`} fun1={()=>navigation.goBack()} img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
            <View style={Style.body_container}>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode='time'
                    is24Hour={true}
                    onChange={onChange}
                    />
                )}
                <Text style={{...Style.list_heading, marginLeft: 2,marginBottom:0}}>Timing</Text>
                <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                    <View style={{width:'48%'}}>
                        <Text style={Style.label}>From</Text>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>{setTime('from');setShow(true)}}>
                            <Text style={Style.input}>{state.time.from}</Text>
                        </TouchableOpacity>
                    </View>
                    {state.time.from && <View style={{width:'48%'}}>
                        <Text style={Style.label}>To</Text>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>{setTime('to');setShow(true)}}>
                            <Text style={Style.input}>{state.time.to}</Text>
                        </TouchableOpacity>
                    </View>}
                </View>
                <InputField name="period" onChangeFun={handleChange} label="Period Number" keyboard='number-pad' placeholder="Period number" value={state.period}/>
                <View style={{height: 20}}/>
                <Text style={{...Style.list_heading, marginLeft: 2,marginBottom:0}}>Subject</Text>
                <FlatList data={[...state.subjects, {add: true}]} renderItem={renderSubject} horizontal showsHorizontalScrollIndicator={false} overScrollMode='never' keyExtractor={(item,index)=>index.toString()}/>
                <View style={{height: 40}}/>
                {mode == 'add' && state.time.from !== '' && state.time.to !== '' && state.subjects.length > 0 && state.period !== '' && <Btn text="Save Period" fun={savePeriod}/>}
                {mode == 'edit' && <ButtonCombo fun1={dlt} fun2={savePeriod} txt1='Delete' txt2='Update'/>}
            </View>
            <Dialog
                visible={showAlert}
                dialogStyle={{minHeight: 450,borderRadius: 10}}
            >
                <View>
                    <Text style={styles.dialog_head}>Select Subject</Text>
                    <SelectList setSelected={setSelected} data={state.subjectList} onSelect={() => setCls(selected)} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Select Subject" searchPlaceholder="Search subject..." dropdownStyles={{backgroundColor: Colors.white, borderColor: '#eee'}}/>
                    <InputField value={state.substitute} name="substitute" label="Substitute Teacher" onChangeFun={handleChange}/>
                    <View style={{height: 5}}/>
                    <Text style={styles.dialog_head}>Select Week Days</Text>
                    <FlatList data={state.days.filter(e=>e.subject == null)} keyExtractor={(item,index)=>index.toString()} renderItem={renderDays} horizontal showsHorizontalScrollIndicator={false} overScrollMode='never'/>
                    <View style={{height: 60}}/>
                    <ButtonCombo fun1={()=>setShowAlert(false)} fun2={save} txt1='Cancel' txt2='Save'/>
                </View>
            </Dialog>
        </View>
    )
}
const styles = StyleSheet.create({
    det:{padding: 15, backgroundColor: Colors.white, borderRadius: 15, position: 'relative', flexDirection: 'row', justifyContent: 'space-between'},
    btn_wrap:{height: hg, width: hg, borderRadius: hg, backgroundColor: Colors.bg, alignItems:'center', justifyContent: 'center', marginLeft: 3, borderWidth: 1, borderColor: "#eee"},
    btn_icon:{fontSize: RFValue(20)},
    det_txt:{color: Colors.lblack},
    dialog_head:{fontSize: RFValue(15), marginBottom: 10, color: Colors.black, textAlign: 'center'},
    check_box:{height: 30,width: 30,borderRadius: 40,borderWidth:1,borderColor:'#eee',marginRight: 5},
    day_wrap:{flexDirection:'row',padding:5,borderWidth:1,borderColor:'#eee',borderRadius:10,marginVertical:3,paddingVertical:10}
})