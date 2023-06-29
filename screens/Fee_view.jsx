import React,{ useState,useEffect }  from 'react'
import {View, Text,TouchableOpacity,Image,ActivityIndicator,Alert,StatusBar, Dimensions, FlatList,StyleSheet} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Header1 } from '../components/Header'
import Style from '../constants/Style'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import {setNum} from '../constants/functions'
import { useReducer } from 'react'
import { setDate1,makeDate } from '../constants/functions'
import { useCallback } from 'react'
import { addDoc, collection, deleteDoc,doc } from 'firebase/firestore'
import { db } from '../constants/config'
import { ProgressDialog  } from 'react-native-simple-dialogs'



let {height} = Dimensions.get('window')
const ADD = 'ADD'
const REMOVE = 'REMOVE'
let reducer = (state,action)=>{
    switch(action.type){
        case ADD:
            let data = action.data
            let ar = state.pay_array.concat(data)
            ar.sort(function(a,b){
                let d1 = a.date
                let d2 = b.date
                d1 = makeDate(d1)
                d2 = makeDate(d2)
                return d2 - d1;
            })
            return{...state,pay_array:ar}
        case REMOVE:
            let {id} = action
            ar = state.pay_array.filter(e=>e.id !== id)
            return{...state,pay_array:ar}
    }
    return state
}
export default function Fee_view(props){
    const {navigation,route} = props
    let {id,rollNo,name,arr,amt,total_fee,class_name,img,fun,class_id} = route.params
    let [loading,setLoading] = useState(false)
    let {removeTxn,addTxn} = fun
    let studentID = id
    let [amount,setAmount] = useState(amt)
    let u = useSelector(state=>state.user)
    let uid = u.user.uid
    let {session} = u
    let ary = arr.sort(function(a,b){
        let d1 = a.date
        let d2 = b.date
        d1 = makeDate(d1)
        d2 = makeDate(d2)
        return d2 - d1;
    })
    const [state,dispatchState] = useReducer(reducer,{
        pay_array:ary
    })
    const handleDelete = useCallback(async(id,amount)=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'fee-collection',id))
            setAmount(amt=>amt-parseInt(amount))
            dispatchState({type:REMOVE,id})
            removeTxn(id,amount,studentID)
            setLoading(false)
        }catch(err){console.warn(err);setLoading(false)}
    },[dispatchState])
    const handleCollection = useCallback(async(data)=>{
        setLoading(true)
        let {amount,date,remarks} = data
        try{
            let obj = {amount,classId:class_id,date,instituteID:uid,remarks,session,studentID:id}
            let res = await addDoc(collection(db,'fee-collection'),obj)
            let fid = res.id
            obj = {...obj,id:fid}
            dispatchState({type:ADD,data:obj})
            setAmount(amt=>amt+parseInt(amount))
            addTxn(obj)
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    const render = (data)=>{
        let {item,index} = data
        let num = index+1
        let {id,date,amount,remarks} = item
        date = setDate1(date)
        let amtP = setNum(amount)
        return(
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:5}}>
                <Text style={{...styles.txt,width:'6%'}}>{num}</Text>
                <Text style={styles.txt}>{date}</Text>
                <Text style={styles.txt}>{amtP}</Text>
                <Text style={{...styles.txt,width:'20%'}}>{remarks}</Text>
                <TouchableOpacity activeOpacity={.5} onPress={()=>Alert.alert('Are you sure?','Do you really want to remove this collection?',[{text:'No'},{text:'Yes,Delete',onPress:()=>handleDelete(id,amount)}])} style={styles.dlt_wrap}>
                    <Text style={styles.dlt}>Delete</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return(
        <View style={Style.screen}>
            <ProgressDialog
                visible={loading}
                message="Please wait..."
            />
            <Header1 text={`Fee Detail: ${name}`} fun1={()=>navigation.goBack()}/>
            <View style={{...Style.body_container,alignItems:'center'}}>
                <View style={{flexDirection:'row',backgroundColor:Colors.bg,borderRadius:10}}>
                    <Image source={{uri:img}} style={{height:RFValue(110),width:RFValue(100),borderRadius:10,backgroundColor:'#f5f5f5'}} resizeMode="cover"/>
                    <View style={{padding:10,alignItems:'flex-start',justifyContent:'center',width:'70%'}}>
                        <Text style={{fontWeight:'bold',color:Colors.black,fontSize:RFValue(18)}}>{name}</Text>
                        <Text style={{color:Colors.lblack,fontSize:RFValue(12)}}>{`${class_name} (Roll No: ${rollNo})`}</Text>
                        <Text style={{color:Colors.lblack,fontSize:RFValue(12)}}>{amount == NaN ? 'Not paid yet': `Fee paid: ${setNum(amount)} / ${setNum(total_fee)}`}</Text>
                        <TouchableOpacity style={{backgroundColor:Colors.blue,width:'45%',borderRadius:6,marginTop:5}} activeOpacity={.5} onPress={()=>navigation.navigate('fee_form',{name,save:handleCollection})}>
                            <Text style={{paddingVertical:8,textAlign:'center',fontWeight:'bold',fontSize:RFValue(14),color:Colors.white}}>Collect Fee</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height:20}}/>
                <View style={{...Style.list_wrap,maxHeight:height*.6,width:'100%'}}>
                    <Text style={Style.list_heading}>Payment history</Text>
                    <FlatList data={state.pay_array} keyExtractor={(item,index)=>index.toString()} showsVerticalScrollIndicator={false} overScrollMode="never" renderItem={render}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    txt:{fontFamily:'sans-serif-condensed',color:Colors.lblack},
    dlt_wrap:{padding:3,paddingHorizontal:10,backgroundColor:'red',borderRadius:5},
    dlt:{color:'white',fontFamily:'normal',fontWeight:'bold'}
})