import { RFValue } from "react-native-responsive-fontsize";
import Colors from "./Colors";
import { Dimensions } from "react-native";

const {height, width} = Dimensions.get('window')

export default {
    screen:{flex: 1, backgroundColor: Colors.bg, position: 'relative'},
    ai_screen:{flex:1,alignItems:'center',justifyContent:'center',padding:15,position:'relative'},
    tabBtn:{alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'},
    tabIcon:{fontSize: RFValue(22)},
    tabTxt:{fontSize: RFValue(8)},
    tabBarStyle:{position: 'absolute', bottom: 0, left: 0, height: RFValue(60), alignItems:'center', justifyContent:'center', zIndex: 1},
    body_container:{padding: 15, position: 'relative'},
    list_wrap:{padding: 10, backgroundColor: Colors.white, borderRadius: 10, maxHeight: height*.82},
    list_heading:{paddingVertical: 5, fontSize: RFValue(14), marginBottom: 8},
    input:{padding: 15,color: Colors.black,fontSize: RFValue(13),backgroundColor: Colors.white,borderRadius: 15,borderWidth: 1, borderColor: '#e9e9e9'},
    label:{marginBottom: 3,fontSize: RFValue(12),marginLeft: 5, color: Colors.black},
}