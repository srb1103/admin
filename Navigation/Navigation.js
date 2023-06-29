import React,{useState} from 'react'
import {View, Text, TouchableOpacity,ActivityIndicator, Button, StatusBar} from 'react-native'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/Home'
import {NavigationContainer} from '@react-navigation/native'
import Classes from '../screens/Classes'
import Create from '../screens/Create'
import Update from '../screens/Update'
import Subjects from '../screens/Subjects'
import Create_subject from '../screens/Create_subject'
import Update_subject from '../screens/Update_subject'
import Staff_type from '../screens/Staff_type'
import Tt_home from '../screens/Tt_home'
import Staff_home from '../screens/Staff_home'
import Addnew_staff from '../screens/Addnew_staff'
import Staff_view from '../screens/Staff_view'
import Announcements from '../screens/Announcements'
import Announcement_form from '../screens/Announcement_form'
import Students from '../screens/Students'
import Student from '../screens/Student'
import Student_form from '../screens/Student_form'
import Select_class from '../screens/Select_class'
import Tt_form from '../screens/Tt_form'
import Login from '../screens/Login'
import { useDispatch, useSelector } from 'react-redux'
import { setUID } from '../store/actions'
import { findUserID } from '../helpers/sql-database'
import Style from '../constants/Style'
import Colors from '../constants/Colors'
import { useEffect } from 'react'
import { usrCr } from '../constants/config'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import Profile from '../screens/Profile'
import Sessions from '../screens/Sessions'
import Change_session from '../screens/Change_session'
import Class from '../screens/Class'
import Applications from '../screens/Applications'
import Application from '../screens/Application'
import Fee_home from '../screens/Fee_home'
import Fee_view from '../screens/Fee_view'
import Fee_form from '../screens/Fee_form'
import Attendance_overview from '../screens/Attendance_overview'
import Attendance_breakdown from '../screens/Attendance_breakdown'
import Result_overview from '../screens/Result_overview'
import Result from '../screens/Result'
import Change_password from '../screens/Change_password'
import Forgot_password from '../screens/Forgot_password'
import { fetch_data } from '../firebase/functions'
import StaffAttendance from '../screens/Staff_attendance'
import MarkAttendance from '../screens/AttendanceMark'
import OldAttendance from '../screens/AttendanceOld'
import AttendanceBreakdownStaff from '../screens/AttendanceBreakdownStaff'

const HomeStack = createStackNavigator()
const TtStack = createStackNavigator()
const LogStack = createStackNavigator()
const MainStack = createStackNavigator()
const HMe = createStackNavigator()
const FeeStack = createStackNavigator()
const SubjectStack = createStackNavigator()

const HmNav = ()=>(
    <HMe.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <HMe.Screen name="home" component={Home} options={()=>({headerShown:false})}/>
        <HMe.Screen name="profile" component={Profile} options={()=>({headerShown:false})}/>
        <HMe.Screen name="sessions" component={Sessions} options={()=>({headerShown:false})}/>
        <HMe.Screen name="change_session" component={Change_session} options={()=>({headerShown:false})}/>
        <HMe.Screen name="change_password" component={Change_password} options={()=>({headerShown:false})}/>
    </HMe.Navigator>
)
const Ttnav = ()=>(
    <TtStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <TtStack.Screen name="tt_home" component={Tt_home} options={()=>({headerShown:false})}/>
        <TtStack.Screen name="tt_form" component={Tt_form} options={()=>({headerShown:false})}/>
    </TtStack.Navigator>
)
const LogNav = ()=>(
    <LogStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <LogStack.Screen name="login" component={Login} options={()=>({headerShown:false})}/>
        <LogStack.Screen name="forgot_password" component={Forgot_password} options={()=>({headerShown:false})}/>
    </LogStack.Navigator>
)
const FeeNav = ()=>(
    <FeeStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <FeeStack.Screen name="fee_home" component={Fee_home} options={()=>({headerShown:false})}/>
        <FeeStack.Screen name="fee_view" component={Fee_view} options={()=>({headerShown:false})}/>
        <FeeStack.Screen name="fee_form" component={Fee_form} options={()=>({headerShown:false})}/>
    </FeeStack.Navigator>
)
const SubjectNav = ()=>(
    <SubjectStack.Navigator screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}>
        <SubjectStack.Screen name="subjects_home" component={Subjects} options={()=>({headerShown:false})}/>
        <SubjectStack.Screen name="create_subject" component={Create_subject} options={()=>({headerShown:false})}/>
        <SubjectStack.Screen name="update_subject" component={Update_subject} options={()=>({headerShown:false})}/>
    </SubjectStack.Navigator>

)
const HomeNav = ()=>(
    <HomeStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <HomeStack.Screen name='home_page' component={HmNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='classes' component={Classes} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='class' component={Class} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='create' component={Create} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='update' component={Update} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='subjects' component={SubjectNav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='select_staff' component={Staff_type} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='staff_home' component={Staff_home} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='markAttendance' component={MarkAttendance} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='oldAttendance' component={OldAttendance} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='staff_attendance' component={StaffAttendance} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='addnew_staff' component={Addnew_staff} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='staff_attn' component={AttendanceBreakdownStaff} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='staff_view' component={Staff_view} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='announcements' component={Announcements} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='announcement_form' component={Announcement_form} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='students' component={Students} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='student' component={Student} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='attendance' component={Attendance_overview} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='attendance_brk' component={Attendance_breakdown} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='result' component={Result_overview} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='result_view' component={Result} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='student_form' component={Student_form} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='select_class' component={Select_class} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='tt_nav' component={Ttnav} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='applications' component={Applications} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='application' component={Application} options={()=>({headerShown: false})}/>
        <HomeStack.Screen name='fee' component={FeeNav} options={()=>({headerShown: false})}/>
    </HomeStack.Navigator>
)
const MainNav = ()=>(
    <MainStack.Navigator
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <MainStack.Screen name="home" component={HomeNav} options={()=>({headerShown: false})}/>
    </MainStack.Navigator>
)

export default function Nav(){
    let [loading,setLoading] = useState(true)
    let {Email,Password} = usrCr
    let auth = getAuth()
    let [fbData,setFbData] = useState(null)
    const authenticate = async ()=>{
        let userCredential = await signInWithEmailAndPassword(auth, Email, Password)
        let usr = userCredential.user
        let {accessToken, refreshToken} = usr.stsTokenManager
        let uid = usr.uid
        setFbData({accessToken,refreshToken,uid})
    }
    let dispatch = useDispatch()
    const updateStore = (id,n,l,mail,contact,label)=>{
        dispatch(setUID(id,n,l,mail,contact,label))
    }
    const check_user = async ()=>{
        let uid = await findUserID()
        auth.onAuthStateChanged(user=>{
            if(user){
                let {accessToken, refreshToken} = user.stsTokenManager
                let uid = user.uid
                setFbData({accessToken,refreshToken,uid})
            }else{
                authenticate();
            }
        })
        if(uid.rows.length > 0){
            let data = uid.rows._array[0]
            if(data.userID){
                let id = data.userID
                let isTh = await fetch_data('institutions')
                let isThere = isTh.find(e=>e.iid == id)
                setLoading(false)
                if(isThere){
                    let {logoURL,name,userID,mail,contact,label} = data
                    updateStore(userID,name,logoURL,mail,contact,label)
                }else{
                    console.log('no data in the database')
                }
            }else{
                setLoading(false)
            }
        }else{
            setLoading(false)
        }
    }
    useEffect(()=>{
        check_user()
    },[])
    const UID = useSelector(state=>state.user.user.uid)
    if (loading){
        return(
            <View style={Style.screen}>
                <StatusBar backgroundColor={Colors.bg} hidden={false}/>
                <View style={Style.ai_screen}>
                    <ActivityIndicator size="large" color={Colors.blue}/>
                </View>
            </View>
        )
    }
    return (
        <NavigationContainer>
            {UID ? <MainNav/> : <LogNav/>}
        </NavigationContainer>
    )
}

