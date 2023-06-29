import React,{ useReducer,useState,useEffect } from 'react'
import {View,Text,FlatList,TouchableOpacity,StyleSheet} from 'react-native'
import { Header1 } from '../components/Header'
import Style from '../constants/Style'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { setDate1,makeDate } from '../constants/functions'

let reducer = (state,action)=>{
    return state
}
export default function Result(props){
    let {navigation,route} = props
    let {data,subject} = route.params
    let [active,setActive] = useState(0)
    let result_data = []
    let exam_types = [
        {key:'class_test',value:'Class Test'},
        {key:'house_test',value:'House Test'},
        {key:'mid_term',value:'Mid Term'},
        {key:'term_end',value:'Term End'},
    ]
    exam_types.forEach(t=>{
        let cat = t.key
        let r = data.filter(e=>e.type == cat)
        let ary = r.sort(function(a,b){
            let d1 = a.date
            let d2 = b.date
            d1 = makeDate(d1)
            d2 = makeDate(d2)
            return d2 - d1;
        })
        if(r.length>0){
            let obj = {cat,type:t.value,data:ary}
            result_data.push(obj)
        }
    })
    const [state,dispatchState] = useReducer(reducer,{
        data:result_data
    })
    const render = (s)=>{
        let {item,index} = s
        let {type} = item
        return(
            <TouchableOpacity activeOpacity={.5} onPress={()=>{setActive(index)}} style={{paddingVertical:7,paddingHorizontal:20,borderRadius:20,marginRight:5,backgroundColor:active == index?Colors.blue:Colors.white}}>
                <Text style={{color:active == index?Colors.white:Colors.lblack,fontSize:RFValue(15),fontWeight:'bold'}}>{type}</Text>
            </TouchableOpacity>
        )
    }
    const render1 = (s)=>{
        let {item,index} = s
        let num = index+1
        let {title,date,marks,max} = item
        return(
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:5}}>
                <Text style={{...styles.txt,width:'7%'}}>{num}</Text>
                <Text style={styles.txt}>{title}</Text>
                <Text style={styles.txt}>{setDate1(date)}</Text>
                <Text style={{...styles.txt}}>{`${marks}/${max}`}</Text>
            </View>
        )
    }
    let content =  <View style={Style.list_wrap}>
            <FlatList showsVerticalScrollIndicator={false} overScrollMode="never" keyExtractor={(item,index)=>index.toString()} renderItem={render1} data={state.data[active].data}/>
        </View>
    const fetch_content = ()=>{
        content =  <View style={Style.list_wrap}>
            <FlatList showsVerticalScrollIndicator={false} overScrollMode="never" keyExtractor={(item,index)=>index.toString()} renderItem={render1} data={state.data[active].data}/>
        </View>
    }
    useEffect(()=>{
        fetch_content()
    },[active])
    return(
        <View style={Style.screen}>
            <Header1 text={subject} fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <FlatList showsHorizontalScrollIndicator={false} overScrollMode="never" keyExtractor={(item,index)=>index.toString()} renderItem={render} data={state.data} horizontal/>
                <View style={{height:15}}/>
                {content}
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    txt:{color:Colors.lblack,width:'31%',fontSize:RFValue(14)},
    dlt_wrap:{padding:3,paddingHorizontal:10,backgroundColor:'red',borderRadius:5},
    dlt:{color:'white',fontFamily:'normal',fontWeight:'bold'}
})