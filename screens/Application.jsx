import React, { useState } from 'react'
import {View, Text, ActivityIndicator,StyleSheet, Alert} from 'react-native'
import Colors from '../constants/Colors'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import InputField from '../components/InputField'
import { RFValue } from 'react-native-responsive-fontsize'
import { setDate1 } from '../constants/functions'
import { ButtonCombo } from '../components/CTAButton'
import { useSelector,useDispatch } from 'react-redux'
import { updateDoc,doc } from 'firebase/firestore'
import { updateApplication } from '../store/actions'
import { db } from '../constants/config'

export default function Application(props){
    let {navigation,route} = props
    let u = useSelector(state=>state.user)
    let {students,leave_applications,classes} = u
    let {id,fun} = route.params
    let app = leave_applications.find(e=>e.id == id)
    let {status,message,subject,application,date,studentID} = app
    let student = students.find(e=>e.id == studentID)
    let accept = fun ? fun.accept : null
    let reject = fun ? fun.reject : null
    let {name,rollNo,classId,token} = student
    let className = classes.find(e=>e.id == classId).name
    const [note,setNote] = useState(null)
    const [loading,setLoading] = useState(false)
    const handleChange = (name,value)=>{
        setNote(value)
    }
    let dispatch = useDispatch()
    const sendNotif = async(status)=>{
        let data = {id,status,message:note,subject,application,date,studentID}
        await fetch('https://exp.host/--/api/v2/push/send',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: [token],
                title: `Admin responded to your leave application`,
                body: `${subject}`,
                data:{type:'student_inquiry',nav:'app',screen:'application',data}
            }),
        })
    }
    const accept1 = ()=>{
        setLoading(true)
        try{
            sendNotif('granted').then(()=>{
                updateDoc(doc(db,'applications',id),{status:'granted',message:note}).then(()=>{
                    dispatch(updateApplication(id,'granted',note))
                    if(accept){
                        accept(id,note)
                    }
                    navigation.goBack()
                }).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }catch(err){console.log(err);setLoading(false)}
    }
    const reject1 = ()=>{
        setLoading(true)
        try{
            sendNotif('rejected').then(()=>{ 
                updateDoc(doc(db,'applications',id),{status:'rejected',message:note}).then(()=>{
                    dispatch(updateApplication(id,'rejected',note))
                    if(reject){
                        reject(id,note)
                    }
                    navigation.goBack()
                }).catch(err=>console.log(err))
            }).catch(err=>console.log(err))
        }catch(err){console.log(err);setLoading(false)}
    }
    return(
        <View style={Style.screen}>
            <Header1 text={subject} fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <View style={Style.list_wrap}>
                    <Text style={{fontSize:RFValue(16),width:'95%',fontWeight:'bold',color:Colors.black}}>{application}</Text>
                    <View style={{height:20}}/>
                    <Text style={styles.txt}>{`Name: ${name}`}</Text>
                    <Text style={styles.txt}>{`Roll No: ${rollNo}`}</Text>
                    <Text style={styles.txt}>{`Class: ${className}`}</Text>
                    <Text style={styles.txt}>{`Dated: ${setDate1(date)}`}</Text>
                    {status !== 'pending' && <Text style={styles.txt}>{`Status: ${status}`}</Text>}
                    {message && <Text style={styles.txt}>{`Note: ${message}`}</Text>}
                    <View style={{height:15}}/>
                </View>
                {status == 'pending' && <View>
                    <InputField name="note" value={note} onChangeFun={handleChange} placeholder="Write a note (optional)"/>
                    <View style={{height:5}}/>
                 {loading ? <ActivityIndicator size="large" color={Colors.black}/>: <ButtonCombo fun1={()=>Alert.alert('Are you sure?','Do you really want to reject this application?',[{text:'No'},{text:'Yes, Reject',onPress:reject1}])} fun2={accept1} txt1='Reject' txt2='Grant Leave'/>}
                </View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    txt:{fontSize:RFValue(12),color:Colors.lblack,lineHeight:RFValue(15)}
})