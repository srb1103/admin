import React from 'react'
import Update_component from '../components/Update_component'

export default function Update(props){
    const {navigation, route} = props
    const {type, name, id} = route.params
    const {fun1, fun2} = route.params.fun
    return(
        <Update_component data={{id, name, type}} fun={{fun1, fun2, nav: ()=>navigation.goBack()}}/>
    )
}