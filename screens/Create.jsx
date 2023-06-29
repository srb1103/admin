import React from 'react'
import Create_component from '../components/Create_component'
export default function Create(props){
    const {navigation, route} = props
    const {type, fun} = route.params
    return(
        <Create_component data={{type}} fun={{nav: ()=>navigation.goBack(),create: fun}}/>
    )
}