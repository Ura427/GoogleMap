// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey : "AIzaSyC7Q6BPUjMKJ6R1h66JapiPp1uVT4-IhrA",

//   authDomain :"silken-period-414309.firebaseapp.com",
//   projectId : "silken-period-414309",
//   storageBucket : "silken-period-414309.appspot.com",
//   messagingSenderId : "1096024449236",
//   appId : "1:1096024449236:web:392c7b07bf79eaa27c5b41",
//   measurementId : "G-5Q76395Y0C"
// };

const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API,

  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: "silken-period-414309",
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
