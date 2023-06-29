import React, {useReducer, useCallback, useState} from 'react'
import {View, Text, Alert, ScrollView,StyleSheet,Image,TouchableOpacity} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import { ButtonCombo } from '../components/CTAButton'
import Colors from '../constants/Colors'
import * as ImgPicker from 'expo-image-picker'
import { RFValue } from 'react-native-responsive-fontsize'
import {ref,uploadBytesResumable,getStorage, getDownloadURL,uploadBytes} from 'firebase/storage'
import { ProgressDialog  } from 'react-native-simple-dialogs'

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
export default function Addnew_staff(props){
    const {navigation, route} = props
    const {type, mode} = route.params
    const {fun1, fun2} = route.params.fun
    const [loading,setLoading] = useState(false)
    let id, name, category,phone,email,img_url
    if(mode == 'edit'){
        let user = route.params.data
        id = user.id
        name = user.name
        category = user.category
        email = user.email
        phone = user.phone
        img_url = user.img_url
    }
    const [state, dispatchState] = useReducer(stateReducer,{
        name: mode == 'edit' ? name : '',
        phone: mode == 'edit' ? phone : '',
        email: mode == 'edit' ? email : '',
        category: mode == 'edit' ? category : '',
        img_url: mode == 'edit' ? img_url : '',
    })
    const handleChange = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE,
            name, value
        })
    },[dispatchState])
    // const setCat = (opt)=>{
    //     let array = category_options
    //     let cl = array.filter(e=>e.key == opt)
    //     let {key, value} = cl[0]
    //     handleChange('cat_id', key)
    //     handleChange('category', value)
    // }
    // const [selected, setSelected] = useState("");
    const save = ()=>{
        const {name, email, phone, category,img_url} = state
        let alert = '';
        if(email.match(email_regex) == null){
            alert = 'Please enter valid email address';
        }
        if(phone.match(phone_regex) == null){
            alert = 'Please enter valid mobile number';
        }
        if(!name || !category){
            alert = "All fields are required";
        }
        if (alert !== ''){Alert.alert('Error',`${alert}`,[{text: 'Okay'}]); return}
        fun2(name, category, email, phone,img_url)
        navigation.goBack()
    }
    const frstFunction = ()=>{
        if(mode == 'edit'){
            Alert.alert('Are you sure?',`Do you really want to delete ${name}?`,[{text: 'Cancel'},{text: 'Delete',onPress:()=>{fun1(); navigation.pop(2)}}])
            
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
            let path = `/staff_images/${img_name}`
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
            <Header1 text={mode == 'edit' ? name : 'Add New Staff'} fun1={()=>navigation.goBack()} icon2="home-outline" fun2={()=>navigation.navigate('home_page')}/>
            <ScrollView style={Style.body_container} overScrollMode='never' showsVerticalScrollIndicator={false}>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity activeOpacity={.5} onPress={imgPickerHandler} style={styles.imgPickerWrap}>
                        {state.img_url ? <Image source={{uri:state.img_url}} style={styles.image_}/>: <Image source={require('../assets/camera.png')} style={styles.camera_img}/>}
                    </TouchableOpacity>
                </View>
                <InputField name="name" value={state.name} onChangeFun={handleChange} label="Name" placeholder="Enter Name"/>
                <InputField name="phone" value={state.phone} onChangeFun={handleChange} label="Phone" placeholder="Enter Contact Number" keyboard='number-pad'/>
                <InputField name="email" value={state.email} onChangeFun={handleChange} label="Email" placeholder="Enter Email Address" keyboard="email-address"/>
                <InputField name="category" value={state.category} onChangeFun={handleChange} label="Category" placeholder="Enter Category"/>
                {/* <View style={{height: 15}}/>
                <Text style={Style.label}>Select Category</Text>
                <SelectList setSelected={setSelected} data={category_options} onSelect={() => setCat(selected)} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Select Category" searchPlaceholder="Search category..." dropdownStyles={{backgroundColor: Colors.white, borderColor: '#eee'}} 
                defaultOption={mode == 'edit' ? {key: cat_id, value: category} : null}
                /> */}
                <View style={{height: 40}}/>
                <ButtonCombo fun1={frstFunction} fun2={save} txt1={mode == 'edit' ? 'Delete' : 'Cancel'} txt2='Save'/>
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