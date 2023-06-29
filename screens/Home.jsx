import React, {useState,useEffect,useCallback} from 'react'
import {View, Text, ActivityIndicator, StyleSheet, StatusBar, ScrollView, RefreshControl,Alert } from 'react-native'
import Style from '../constants/Style'
import Header from '../components/Header'
import { RFValue } from 'react-native-responsive-fontsize'
import HomeCat from '../components/HomeCat'
import Colors from '../constants/Colors'
import { addApplication, setData,setStaffData } from '../store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../constants/config'
import { updateDoc,doc } from 'firebase/firestore'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { fetch_data } from '../firebase/functions'
export default function Home(props){
    const {navigation, route} = props
    let user = useSelector(state=>state.user)
    let uid = user.user.uid
    let now = JSON.stringify(new Date())
    async function registerForPushNotificationsAsync() {
      let token;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
      } else {
        alert('Must use physical device for Push Notifications');
      }
      return token;
    }
    let {sessions,session,leave_applications} = user
    let l = leave_applications.filter(e=>e.status == 'pending').length
    let s1 = sessions.find(e=>e.id == session)
    let s = null
    if(s1){s = s1.title}
    const [loading,setLoading] = useState(true)
    const [refreshing,setRefreshing] = useState(false)
    let dispatch = useDispatch()
    useEffect(()=>{
        dispatch(setStaffData())
    },[])
    useEffect(()=>{
        dispatch(setData(uid)).then(()=>{
            registerForPushNotificationsAsync().then((token)=>{
                fetch_data('institutions').then((data)=>{
                    let i = data.find(e=>e.iid == uid)
                    let id = i.id
                    updateDoc(doc(db,'institutions',id),{last_login:now,pushToken:token}).then(()=>{
                    setLoading(false)
                    })
                })
              }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
    },[])
    useEffect(()=>{
        const subscription = Notifications.addNotificationResponseReceivedListener(res=>{
          let response = res.notification.request.trigger.remoteMessage.data.body
          response = JSON.parse(response)
          let {data,type,screen} = response
          if(type == 'application'){
            let {id} = data
            let isThere = leave_applications.find(e=>e.id == id)
            if(isThere){
              navigation.navigate(screen,{id})
            }else{
              dispatch(addApplication(data)).then(()=>{
                navigation.navigate(screen,{id})
              }).catch(err=>console.log(err))
            }
          }
        })
        return ()=>{
          subscription.remove()
        }
    },[])
    const onRefresh = useCallback(()=>{
        setRefreshing(true)
        dispatch(setData(uid)).then(()=>{setRefreshing(false)}).catch(err=>console.log(err))
    },[])
    if(loading || refreshing){
        return(
            <View style={Style.screen}>
                <StatusBar backgroundColor={Colors.blue} hidden={false} animated={true}/>
                <Header/>
                <View style={Style.body_container}>
                    <View style={{height:40}}/>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                    <Text style={{...Style.label,marginTop:10,textAlign:'center'}}>Fetching data. Please wait...</Text>
                </View>
            </View>
        )
    }
    return(
        <View style={Style.screen}>
        <StatusBar backgroundColor={Colors.blue} hidden={false}/>
            <Header fun={()=>navigation.navigate('profile')}/>
            <ScrollView style={Style.body_container} showsVerticalScrollIndicator={false} overScrollMode='never' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <Text style={styles.heading}>Hello, admin</Text>
                <Text style={styles.head}>Session: {s}</Text>
                <View style={{...Style.list_wrap, ...styles.cat_wrap}}>
                    <HomeCat title='Batches' img={require('../assets/classes.png')} fun={()=>navigation.navigate('classes')}/>
                    <HomeCat title='Students' img={require('../assets/students.png')} fun={()=>navigation.navigate('students')}/>
                    <HomeCat title='Staff' img={require('../assets/staff.png')} fun={()=>navigation.navigate('select_staff')}/>
                    <HomeCat title='Courses' img={require('../assets/subjects.png')} fun={()=>navigation.navigate('subjects')}/>
                    <HomeCat title='Manage Fees' img={require('../assets/fees.png')} fun={()=>navigation.navigate('select_class',{next:'fee',screen:'fee_home'})}/>
                    <HomeCat title='Announcements' img={require('../assets/announcement.png')} fun={()=>navigation.navigate('announcements')}/>
                    <HomeCat title='Time Table' img={require('../assets/timetable.png')} fun={()=>navigation.navigate('select_class',{next:'tt_nav',screen:'tt_home'})}/>
                    <HomeCat title='Leave Applications' img={require('../assets/applications.png')} fun={()=>navigation.navigate('applications')} notif={l>0?true:false} num={l}/>
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    heading: {fontSize: RFValue(25), marginBottom: -1, marginTop: 15,fontWeight:'bold'},
    head:{marginBottom: 40},
    cat_wrap:{flexDirection: 'row', flexWrap: 'wrap'},
    
})