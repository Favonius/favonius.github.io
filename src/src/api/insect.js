import insect from '@/assets/insectdata'
import firebase from 'firebase'

export function FindFull (searchText) {
  const len = insect.data.length
  var response = []
  for (var i = 0; i < len; i++) {
    const data = insect.data[i]
    var x = data.faKN + data.faN + data.far + data.fn + data.gkn + data.gn + data.okn + data.on + data.sa + data.sgkn + data.sgn + data.skn + data.sn + data.ssa + data.sskn + data.ssn
    if (x.toLowerCase().includes(searchText.toLowerCase())) {
      response.push(data)
    }
  }
  return response
}

export function getAuthorYear (data) {
  var result
  result = getrenameauthoryear(data.ssa, data.ssy)
  if (result.length < 2) {
    result = getrenameauthoryear(data.sa, data.sy)
  }
  return result
}

export function getfullSpeciesName (data) {
  var result
  result = data.gn + ' '
  if (data.sgn.length > 0) {
    result += '(' + data.sgn + ') '
  }
  result += data.sn + ' '
  if (data.ssn.length > 0) {
    result += data.ssn + ' '
  }
  return result
}

export function getTags (data) {
  var result = ''
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== null && data[key] !== undefined) {
        if (data[key].length > 0) {
          result += data[key] + ','
        }
      }
    }
  }
  return result.substring(0, result.length - 1)
}

export function getID (data) {
  return data.gn + data.sn + data.ssn
}

export function setPhoto (data) {
  firebase.firestore().collection('insect').doc(data.id).set(data)
}

export function getPhoto (data, cbFn) {
  firebase.firestore().collection('insect').doc(getID(data))
    .get()
    .then(function (doc) {
      if (doc.exists) {
        cbFn(getID(data), doc.data())
      }
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error)
    })
}

function getrenameauthoryear (author, year) {
  if (author.length < 1) {
    return ''
  }
  if (author.startsWith('(')) {
    author = author.substring(1)
    if (author.charAt(author.length - 1) === ')') {
      author = author.substring(0, author.length - 1)
    }
    author = '(' + author + ', ' + year + ')'
  } else {
    author = author + ', ' + year
  }
  return author
}
