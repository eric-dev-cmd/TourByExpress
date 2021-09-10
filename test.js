/**
 * npm i prettier eslint - config - prettier eslint - plugin - prettier eslint eslint - config - airbnb eslint - plugin - node eslint - plugin -
     import eslint - plugin - jsx - a11y eslint - plugin - react--save - dev
 */
const obj = {
    "duration": 5,
    "difficulty": "easy"
}
// console.log(obj)
const newObj = {
    ...obj
}
// console.log(newObj)
console.log(newObj === obj)
const excludedFields = ['page', 'sort', 'limit', 'fields']
console.log(excludedFields)
console.log("FOREACH")
excludedFields.forEach(el => {
    console.log(newObj[el])
    // delete newObj[el]
})
// console.log("QUERY:", queryObj)