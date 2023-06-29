import {View, ActivityIndicator} from 'react-native'
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers} from 'redux'
import Nav from './Navigation/Navigation';
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold } from "@expo-google-fonts/poppins";
import Colors from './constants/Colors';
import Style from './constants/Style'
import user from './store/reducer'
import { createTable } from './helpers/sql-database';
createTable().then(()=>{
}).catch(err=>{
  console.log('table not created')
})
const rootReducer = combineReducers({
  user: user
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk))
export default function App() {
  let [fontsLoaded] = useFonts({
    p3: Poppins_300Light,
    p4: Poppins_400Regular,
    p5: Poppins_500Medium,
    p6: Poppins_600SemiBold,
    p7: Poppins_700Bold,
    p8: Poppins_800ExtraBold,
  });
  if(!fontsLoaded){
    return(
      <View style={Style.screen}>
        <ActivityIndicator color={Colors.dark_blue} size="large"/>
      </View>
    )
  }
  return (
    <Provider store={store}>
      <Nav/>
    </Provider>
  );
}