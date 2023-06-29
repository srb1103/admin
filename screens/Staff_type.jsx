import React,{useEffect} from 'react'
import {View} from 'react-native'
import Style from '../constants/Style'
import { Header1 } from '../components/Header'
import Block from '../components/Block'

export default function Staff_type(props){
    const {navigation, route} = props
    
    
    return(
        <View style={Style.screen}>
            <Header1 text='Staff' fun1={()=>navigation.goBack()}/>
            <View style={Style.body_container}>
                <View style={Style.list_wrap}>
                    <Block heading='Teaching Staff' fun={()=>navigation.navigate('staff_home',{type: 'teaching'})} css/>
                    <Block heading='Non Teaching Staff' fun={()=>navigation.navigate('staff_home',{type: 'non-teaching'})}/>
                </View>
                
            </View>
        </View>
    )
}