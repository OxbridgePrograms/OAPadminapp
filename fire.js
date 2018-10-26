import firebase from 'firebase'
  var config = {
    apiKey: "AIzaSyDcOiAf4K2ae4CezgpaIYSZkPek9nNcwZI",
    authDomain: "oapapp-578f6.firebaseapp.com",
    databaseURL: "https://oapapp-578f6.firebaseio.com",
    projectId: "oapapp-578f6",
    storageBucket: "oapapp-578f6.appspot.com",
    messagingSenderId: "843542046816"
  };
var fire = firebase.initializeApp(config);
export default fire;