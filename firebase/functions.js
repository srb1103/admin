import { db } from '../constants/config'
import {collection,getDocs} from 'firebase/firestore'

export async function fetch_data(table){
    let users = []
    await getDocs(collection(db,table)).then(docSnap=>{
        docSnap.forEach((doc)=>{
            users.push({...doc.data(), id:doc.id})
        })
    })
    return users
}
