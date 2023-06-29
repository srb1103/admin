import React from 'react'
import {View, StyleSheet, Text} from 'react-native'
import Colors from '../constants/Colors'
import { RFValue } from 'react-native-responsive-fontsize'

export default function Td(props){
    const {t1, t2, css} = props
    let st = css == true ? {...styles.tr, borderBottomColor: '#f7f7f7', borderBottomWidth: 1} : {...styles.tr}

    return(
        <View style={st}>
            <Text style={styles.td_left}>{t1}</Text>
            <Text style={styles.td_right}>{t2}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    tr:{flexDirection: 'row', justifyContent: 'space-between', padding: 15, paddingHorizontal: 25},
    td_left:{color: Colors.lblack, fontSize: RFValue(14)},
    td_right:{textAlign: 'right', fontFamily: 'p6', fontSize: RFValue(14), maxWidth: '70%', color: Colors.black}
})