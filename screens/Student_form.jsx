import React, {useReducer, useCallback, useState} from 'react'
import {View, Text, Alert, ScrollView, TouchableOpacity,StyleSheet, Image, ActivityIndicator} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import SelectList from 'react-native-dropdown-select-list'
import { ButtonCombo } from '../components/CTAButton'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import * as ImgPicker from 'expo-image-picker'
import {ref,uploadBytesResumable,getStorage, getDownloadURL,uploadBytes} from 'firebase/storage'
import { ProgressDialog  } from 'react-native-simple-dialogs'
import { db } from '../constants/config'
import { addDoc,collection } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { addStudent } from '../store/actions'


const UPDATE = 'UPDATE'
const stateReducer = (state, action)=>{
    switch (action.type){
        case UPDATE:
            let {name, value} = action
            return{
                ...state,
                [name]: value
            }
    }
    return state
}
let email_regex= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
let phone_regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}/
export default function Student_form(props){
    const {navigation, route} = props
    const {mode, fun1, fun2,instituteID,mail,iname,logoURL,contact,label} = route.params
    const [loading,setLoading] = useState(false)
    const [loading1,setLoading1] = useState(false)
    let cls_array = route.params.data.cls
    let classes = []
    cls_array.forEach(e=>{
        classes.push({key: e.id,value: e.name})
    })
    let id, name, phone,email,guardian,class_name,address,rollNo,admissionNo,img_url
    if(mode == 'edit'){
        let user = route.params.data
        id = user.id
        name = user.name
        email = user.email
        phone = user.phone
        guardian = user.guardian
        class_name = user.class_name
        address = user.address
        rollNo = user.rollNo
        admissionNo = user.admissionNo
        img_url = user.img_url
    }
    const [state, dispatchState] = useReducer(stateReducer,{
        name: mode == 'edit' ? name : '',
        phone: mode == 'edit' ? phone : '',
        email: mode == 'edit' ? email : '',
        guardian: mode == 'edit' ? guardian : '',
        class_name: mode == 'edit' ? class_name : '',
        address: mode == 'edit' ? address : '',
        rollNo: mode == 'edit' ? rollNo : '',
        admissionNo: mode == 'edit' ? admissionNo : '',
        img_url: mode == 'edit' ? img_url : 'https://i.imgur.com/o28Do8L.png',
    })
    const handleChange = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE,
            name, value
        })
    },[dispatchState])
    const setCat = (opt)=>{
        let c = classes.find(e=>e.key == opt)
        handleChange('class_name',c.value)
    }
    const [selected, setSelected] = useState("");
    let dispatch = useDispatch()
    const save = ()=>{
        const {name,phone,email,class_name,rollNo,admissionNo,img_url,guardian,address} = state
        let alert = '';
        if(email.match(email_regex) == null){
            alert = 'Please enter valid email address';
        }
        if(phone.match(phone_regex) == null){
            alert = 'Please enter valid mobile number';
        }
        if(!name || !class_name || !rollNo || !admissionNo){
            alert = "All fields are required";
        }
        if(!img_url){
            alert = "Please upload student's image";
        }
        if (alert !== ''){Alert.alert('Error',`${alert}`,[{text: 'Okay'}]); return}
        setLoading1(true)
        if(mode == 'edit'){
            fun2(state)
            setTimeout(()=>{
                setLoading1(false)
                navigation.pop(2)
            },3000)
        }else if(mode == 'add'){
            const generateUniqueString = () => {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let uniqueString = '';
              
                for (let i = 0; i < 8; i++) {
                  const randomIndex = Math.floor(Math.random() * characters.length);
                  const randomChar = characters.charAt(randomIndex);
                  uniqueString += randomChar;
                }
              
                return uniqueString;
            };
            let u = generateUniqueString()
            let username = `${label}-${u}`
            let classId = classes.find(e=>e.value == class_name).key
            addDoc(collection(db,'students'),{name,phone,email,classId,rollNo,admissionNo,img_url,instituteID,password:'',guardian,address,username}).then(res=>{
                let id = res.id
                fetch(`https://emezy.in/LMS_api/send_lms_registration_mail.php?type=student_registration&name=${name}&iLogo=${logoURL}&iName=${iname}&email=${email}&id=${id}&username=${username}&mail=${mail}&contact=${contact}`).then(r=>{
                    let st = r.status
                    if(st == 200){
                        dispatch(addStudent({...state,id,classId}))
                        setLoading1(false)
                        navigation.pop(2)
                    }
                }).catch(err=>{console.log(err);setLoading1(false)})
                
            }).catch(err=>{console.log(err);setLoading1(false)})
        }
    }
    
    const frstFunction = ()=>{
        if(mode == 'edit'){
            Alert.alert('Are you sure?',`Do you really want to delete ${name}?`,[{text: 'Cancel'},{text: 'Delete',onPress:()=>{
                setLoading1(true)
                fun1(id);
                setTimeout(()=>{
                    setLoading1(false)
                    navigation.pop(2)
                },3000)
            }}])
        }else{
            navigation.goBack()
        }
    }
    const imgPickerHandler = async ()=>{
        const image = await ImgPicker.launchImageLibraryAsync({
            mediaTypes: ImgPicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: .5
        })
        if(!image.cancelled){
            setLoading(true)
            let im = image.uri.split('.')
            let im_l = im.length - 1
            let img_name = `${im[im_l-1].split('/').pop()}.${im[im_l]}`
            let storage = getStorage()
            let path = `/students-images/${img_name}`
            const rf = ref(storage, path)
            const img = await fetch(image.uri)
            const bytes = await img.blob()
            await uploadBytes(rf, bytes)
            getDownloadURL(rf)
            .then(url=>handleChange('img_url',url))
            setLoading(false)
        }else{setLoading(false)}
    }
    return(
        <View style={Style.screen}>
            <Header1 text={mode == 'edit' ? name : 'Add New Student'} fun1={()=>navigation.goBack()} img2={require('../assets/home.png')} fun2={()=>navigation.navigate('home_page',{screen:'home'})}/>
            <ScrollView style={Style.body_container} overScrollMode='never' showsVerticalScrollIndicator={false}>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity activeOpacity={.5} onPress={imgPickerHandler} style={styles.imgPickerWrap}>
                        {state.img_url ? <Image source={{uri:state.img_url}} style={styles.image_}/>: <Image source={require('../assets/camera.png')} style={styles.camera_img}/>}
                    </TouchableOpacity>
                </View>
                <InputField name="name" value={state.name} onChangeFun={handleChange} label="Name" placeholder="Enter Name"/>
                <InputField name="guardian" value={state.guardian} onChangeFun={handleChange} label="Guardian" placeholder="Guardian"/>
                <InputField name="phone" value={state.phone} onChangeFun={handleChange} label="Phone" placeholder="Enter Contact Number" keyboard='number-pad'/>
                <InputField name="rollNo" value={state.rollNo} onChangeFun={handleChange} label="Roll No" placeholder="Enter Roll Number" keyboard='number-pad'/>
                <InputField name="admissionNo" value={state.admissionNo} onChangeFun={handleChange} label="Admission No" placeholder="Enter Admission Number"/>
                <InputField name="email" value={state.email} onChangeFun={handleChange} label="Email" placeholder="Enter Email Address" keyboard="email-address"/>
                <InputField name="address" value={state.address} onChangeFun={handleChange} label="Address" placeholder="Address" multiline nol={3}/>
                <View style={{height: 15}}/>
                <Text style={Style.label}>Select Class</Text>
                <SelectList setSelected={setSelected} data={classes} onSelect={() => setCat(selected)} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Select Class" searchPlaceholder="Search class..." dropdownStyles={{backgroundColor: Colors.white, borderColor: '#eee'}} 
                defaultOption={mode == 'edit' ? classes.find(e=>e.value == class_name) : null}
                />
                <View style={{height: 40}}/>
                {!loading1 ? <ButtonCombo fun1={frstFunction} fun2={save} txt1={mode == 'edit' ? 'Delete' : 'Cancel'} txt2='Save'/> : <ActivityIndicator size="large" color={Colors.blue}/>}
                <View style={{height: 70}}/>
            </ScrollView>
            <ProgressDialog
                visible={loading}
                message={`Uploading. Please wait...`}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    camera_img:{tintColor:'#ccc',height:RFValue(35),resizeMode:'contain'},
    imgPickerWrap:{height:RFValue(80),width:RFValue(80),borderRadius:50,backgroundColor:Colors.white,alignItems:'center',justifyContent:"center", overflow:'hidden'},
    image_:{height:RFValue(80),width:RFValue(80)}
})