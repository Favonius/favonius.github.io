import { insectData } from '@/assets/insectdata'
import firebase from 'firebase'

export function FindFull (searchText) {
  const len = insectData().length
  var response = []
  for (var i = 0; i < len; i++) {
    const data = insectData()[i]
    if (data.tags.toLowerCase().includes(searchText.toLowerCase())) {
      response.push(data)
    }
  }
  return response
}

export function FindRecentUpdate () {
  var searchResult = []
  firebase.firestore().collection('insect').orderBy('updateDate', 'desc').limit(10).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      const len = insectData().length
      for (var i = 0; i < len; i++) {
        const data = insectData()[i]
        if (data.id === doc.id) {
          searchResult.push(data)
        }
      }
    })
  })
  return searchResult
  // const len = insectData().length
  // var response = []
  // for (var i = 0; i < len; i++) {
  //   const data = insectData()[i]
  //   if (data.tags.toLowerCase().includes(searchText.toLowerCase())) {
  //     response.push(data)
  //   }
  // }
  // return response
}

export function setPhoto (data) {
  firebase.firestore().collection('insect').doc(data.id).set(data)
}

export function getPhoto (data, cbFn) {
  firebase.firestore().collection('insect').doc(data.id)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        cbFn(data.id, doc.data())
      }
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error)
    })
}
