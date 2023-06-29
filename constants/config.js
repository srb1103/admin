import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBq_zZO9UNIf22L9a9PFp8mwCWe8reWogI",
  authDomain: "lmsbykotcode-175f0.firebaseapp.com",
  databaseURL: "https://lmsbykotcode-175f0-default-rtdb.firebaseio.com",
  projectId: "lmsbykotcode-175f0",
  storageBucket: "lmsbykotcode-175f0.appspot.com",
  messagingSenderId: "806649479707",
  appId: "1:806649479707:web:331d8982fe05508ff7eebe",
  measurementId: "G-H0LKXQ4TVH"
};
let usrCr = {Email:'admin@kotcode.in',Password:'Admin@KotCode#22'}
const app = initializeApp(firebaseConfig);
let db = getFirestore(app)
export {db,usrCr}