import jsonMap from './insectMap.json'

var list = []

export function insectData () {
  if (list.length < 1) {
    initList()
  }
  return list
}

function initList () {
  list = []
  var data = jsonMap.data
  for (var orderKey in data) {
    var order = data[orderKey].data
    var orderKo = data[orderKey].ko
    for (var familyKey in order) {
      var family = order[familyKey].data
      var familyKo = order[familyKey].ko
      for (var genusKey in family) {
        var genus = family[genusKey].data
        var genusKo = family[genusKey].ko
        for (var speciesKey in genus) {
          var speciesAy = genus[speciesKey].ay
          var speciesKo = genus[speciesKey].ko
          if (speciesKo.length < 1) {
            speciesKo = '국명없음'
          }
          var tags = orderKey + ',' + orderKo + ',' + familyKey + ',' + familyKo + ',' + genusKey + ',' + genusKo + ',' + speciesKey + ',' + speciesKo
          var speciesEn = genusKey + ' ' + speciesKey
          var id = genusKey + speciesKey
          id = id.replace(/\s/g, '')
          list.push({
            ko: speciesKo,
            en: speciesEn,
            ay: speciesAy,
            tags: tags,
            id: id
          })
        }
      }
    }
  }
}
