import firebase from 'firebase'

export function Login (email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    console.log('Login Fail')
    console.log(error.code)
    console.log(error.message)
  })
}

export function Logout () {
  console.log('doLogout')
  firebase.auth().signOut().then(function () {
  }).catch(function (error) {
    console.log(error.code)
  })
}
