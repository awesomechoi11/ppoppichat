import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React from 'react';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCLPT6_DfuaDFbLOuVn8c1uv15pyq24-YQ",
    authDomain: "ppoppi.firebaseapp.com",
    databaseURL: "https://ppoppi.firebaseio.com",
    projectId: "ppoppi",
    storageBucket: "ppoppi.appspot.com",
    messagingSenderId: "593646853073",
    appId: "1:593646853073:web:31d9435837b58acadb9ef0"
};
// Initialize Firebase
console.log('init firebase')
firebase.initializeApp(firebaseConfig);

export default firebase;
export const firestore = firebase.firestore();
export const fireauth = firebase.auth();


